import os
import json
import re
from collections import defaultdict
from booknlp.booknlp import BookNLP

def process_book_with_booknlp(input_file, output_dir, book_id):
    """
    Process a book with BookNLP and extract character and theme information.
    
    Args:
        input_file (str): Path to the text file of the book
        output_dir (str): Directory to save the BookNLP output files
        book_id (str): ID for the book
    """
    print(f"Processing {input_file} with BookNLP...")
    
    # Initialize BookNLP
    model_params = {
        "pipeline": "entity,quote,supersense,event,coref",
        "model": "en_core_web_sm"
    }
    booknlp = BookNLP("en", model_params)
    
    # Process the book
    booknlp.process(input_file, output_dir, book_id)
    
    print(f"BookNLP processing complete. Results saved to {output_dir}")
    return output_dir

def extract_characters(entities_file, tokens_file, quotes_file):
    """
    Extract character information from BookNLP output files.
    
    Args:
        entities_file (str): Path to the entities.csv file
        tokens_file (str): Path to the tokens.csv file
        quotes_file (str): Path to the quotes.csv file
    
    Returns:
        list: List of character dictionaries
    """
    print("Extracting character information...")
    
    # Load entity data
    entity_data = {}
    with open(entities_file, 'r', encoding='utf-8') as f:
        next(f)  # Skip header
        for line in f:
            parts = line.strip().split(',')
            if len(parts) >= 7:
                entity_id = parts[0]
                entity_name = parts[1]
                entity_type = parts[2]
                count = int(parts[3])
                
                # Only process PER (person) entities
                if entity_type == "PER" and count > 5:
                    gender = parts[6] if len(parts) > 6 else "unknown"
                    entity_data[entity_id] = {
                        "id": entity_id,
                        "name": entity_name,
                        "mention_count": count,
                        "gender": gender,
                        "aliases": [entity_name],
                        "mentions": [],
                        "quote_count": 0,
                        "sample_quotes": []
                    }
    
    # Load token data to get mentions
    with open(tokens_file, 'r', encoding='utf-8') as f:
        next(f)  # Skip header
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 8:
                entity_id = parts[7]
                if entity_id in entity_data and parts[4] in ["PROP", "NOM", "PRON"]:
                    token_text = parts[3]
                    token_type = parts[4]
                    start_token = parts[0]
                    end_token = parts[0]  # Assuming single-token mentions for simplicity
                    
                    # Add to aliases if not already there
                    if token_text not in entity_data[entity_id]["aliases"] and token_type != "PRON":
                        entity_data[entity_id]["aliases"].append(token_text)
                    
                    # Add mention
                    mention = {
                        "text": token_text,
                        "type": token_type,
                        "start_token": start_token,
                        "end_token": end_token
                    }
                    entity_data[entity_id]["mentions"].append(mention)
    
    # Load quotes data
    character_quotes = defaultdict(list)
    with open(quotes_file, 'r', encoding='utf-8') as f:
        next(f)  # Skip header
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 4:
                entity_id = parts[1]
                quote_text = parts[3]
                
                if entity_id in entity_data:
                    entity_data[entity_id]["quote_count"] += 1
                    character_quotes[entity_id].append(quote_text)
    
    # Add sample quotes (up to 10 per character)
    for entity_id, quotes in character_quotes.items():
        # Select quotes that are meaningful (longer than a few words)
        meaningful_quotes = [q for q in quotes if len(q.split()) > 5]
        sample_quotes = meaningful_quotes[:10] if meaningful_quotes else quotes[:10]
        entity_data[entity_id]["sample_quotes"] = sample_quotes
    
    # Convert to list and sort by mention count
    characters = list(entity_data.values())
    characters.sort(key=lambda x: x["mention_count"], reverse=True)
    
    # Keep only the top characters (those with significant presence)
    top_characters = [c for c in characters if c["mention_count"] > 20][:20]
    
    print(f"Extracted information for {len(top_characters)} main characters")
    return top_characters

def extract_themes(tokens_file, character_data):
    """
    Extract theme information from BookNLP output.
    
    This is a simplified approach since BookNLP doesn't directly extract themes.
    We'll use keyword frequency and context to infer themes.
    
    Args:
        tokens_file (str): Path to the tokens.csv file
        character_data (list): List of character dictionaries
    
    Returns:
        list: List of theme dictionaries
    """
    print("Extracting theme information...")
    
    # Define potential themes and their keywords for 1984
    theme_keywords = {
        "Totalitarianism": ["big brother", "party", "government", "control", "watching", 
                          "surveillance", "power", "authority", "police", "ministry"],
        "Surveillance": ["telescreen", "watching", "spying", "observe", "listen", "monitor", 
                       "camera", "eye", "watched", "privacy"],
        "Psychological Manipulation": ["doublethink", "newspeak", "thoughtcrime", "memory", 
                                     "alter", "propaganda", "brainwash", "mind", "thought", "language"],
        "Rebellion": ["resist", "rebel", "freedom", "fight", "against", "defy", 
                     "disobey", "rebel", "resistance", "revolution"],
        "Loss of Identity": ["identity", "self", "individual", "personality", "conform", 
                           "vaporize", "person", "human", "dignity", "self-expression"],
        "Historical Revisionism": ["history", "memory", "change", "rewrite", "record", 
                                "ministry of truth", "past", "document", "adjust", "memory hole"]
    }
    
    # Count keyword occurrences
    theme_counts = {theme: 0 for theme in theme_keywords}
    theme_evidence = {theme: [] for theme in theme_keywords}
    
    # Load token data and count theme keywords
    text = ""
    with open(tokens_file, 'r', encoding='utf-8') as f:
        next(f)  # Skip header
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 4:
                token = parts[3].lower()
                sentence_id = parts[1]
                text += token + " "
                
                # Check if token is part of any theme keywords
                for theme, keywords in theme_keywords.items():
                    for keyword in keywords:
                        if keyword == token or (len(keyword.split()) > 1 and keyword in text[-100:]):
                            theme_counts[theme] += 1
                            if sentence_id not in theme_evidence[theme]:
                                theme_evidence[theme].append(sentence_id)
    
    # Create theme data
    themes = []
    for theme, keywords in theme_keywords.items():
        occurrence_count = theme_counts[theme]
        evidence_sentence_ids = theme_evidence[theme][:10]  # Limit to 10 examples
        
        themes.append({
            "name": theme,
            "keywords": keywords,
            "occurrence_count": occurrence_count,
            "evidence_sentence_ids": evidence_sentence_ids
        })
    
    # Sort by occurrence count
    themes.sort(key=lambda x: x["occurrence_count"], reverse=True)
    
    print(f"Extracted information for {len(themes)} themes")
    return themes

def extract_relationships(entities_file, quotes_file, tokens_file, character_data):
    """
    Extract relationship information between characters.
    
    Args:
        entities_file (str): Path to the entities.csv file
        quotes_file (str): Path to the quotes.csv file
        tokens_file (str): Path to the tokens.csv file
        character_data (list): List of character dictionaries
    
    Returns:
        list: List of relationship dictionaries
    """
    print("Extracting relationship information...")
    
    # Create a map of character IDs to data
    character_map = {c["id"]: c for c in character_data}
    character_ids = set(character_map.keys())
    
    # Count co-occurrences in the same paragraphs
    co_occurrences = defaultdict(int)
    
    # Track the current paragraph
    current_para = ""
    para_entities = set()
    
    # Process tokens to find co-occurrences in paragraphs
    with open(tokens_file, 'r', encoding='utf-8') as f:
        next(f)  # Skip header
        current_para_id = None
        
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 8:
                para_id = parts[2]
                entity_id = parts[7]
                
                # If we've moved to a new paragraph
                if para_id != current_para_id:
                    # Process the previous paragraph's entities
                    entities_list = list(para_entities & character_ids)
                    for i in range(len(entities_list)):
                        for j in range(i+1, len(entities_list)):
                            pair = tuple(sorted([entities_list[i], entities_list[j]]))
                            co_occurrences[pair] += 1
                    
                    # Reset for new paragraph
                    current_para_id = para_id
                    para_entities = set()
                
                # Add entity to current paragraph if it's a character
                if entity_id in character_ids:
                    para_entities.add(entity_id)
    
    # Define some relationship types based on character interactions
    # In a full implementation, you would use more sophisticated NLP to determine relationship types
    relationships = []
    
    # Convert co-occurrence data to relationships
    for (char1_id, char2_id), strength in co_occurrences.items():
        if strength < 3:  # Ignore weak connections
            continue
            
        if char1_id in character_map and char2_id in character_map:
            # Get character names
            char1_name = character_map[char1_id]["name"]
            char2_name = character_map[char2_id]["name"]
            
            # For simplicity, we'll use a generic relationship type
            relationship_type = "interacts with"
            
            relationships.append({
                "source": char1_id,
                "source_name": char1_name,
                "target": char2_id,
                "target_name": char2_name,
                "type": relationship_type,
                "strength": strength
            })
    
    # Sort by strength
    relationships.sort(key=lambda x: x["strength"], reverse=True)
    
    print(f"Extracted {len(relationships)} character relationships")
    return relationships

def create_character_profiles(character_data, relationship_data):
    """
    Create more detailed character profiles by combining character and relationship data.
    
    Args:
        character_data (list): List of character dictionaries
        relationship_data (list): List of relationship dictionaries
    
    Returns:
        list: List of character profile dictionaries
    """
    print("Creating character profiles...")
    
    # Create a map of character IDs to relationships
    character_relationships = defaultdict(list)
    for rel in relationship_data:
        character_relationships[rel["source"]].append(rel)
        character_relationships[rel["target"]].append(rel)
    
    # Infer character traits based on quote content and relationships
    character_profiles = []
    
    for character in character_data:
        char_id = character["id"]
        
        # Start with basic profile
        profile = {
            "id": char_id,
            "name": character["name"],
            "aliases": character["aliases"],
            "mention_count": character["mention_count"],
            "quote_count": character["quote_count"],
            "gender": character["gender"],
            "sample_quotes": character["sample_quotes"],
            "traits": [],  # To be determined based on quotes
            "role": "supporting character",  # Default role
            "description": f"{character['name']} is a character in George Orwell's \"1984\"."
        }
        
        # Infer character role based on mention count
        if character["mention_count"] == max(c["mention_count"] for c in character_data):
            profile["role"] = "protagonist"
        elif character["mention_count"] > 100:
            profile["role"] = "major character"
        
        # For important characters, add more detailed descriptions
        if character["name"] == "Winston Smith":
            profile["role"] = "protagonist"
            profile["traits"] = ["rebellious", "intellectual", "introspective", "paranoid", "curious"]
            profile["description"] = "Winston Smith is a low-ranking member of the ruling Party in London, in the nation of Oceania. Everywhere Winston goes, even his own home, the Party watches him through telescreens. He works at the Ministry of Truth, where he alters historical records to fit Party needs. He is haunted by memories he's uncertain of and is searching for truth amidst the Party's lies."
        
        elif character["name"] == "Julia":
            profile["role"] = "love interest/ally"
            profile["traits"] = ["rebellious", "pragmatic", "sensual", "resourceful", "adaptable"]
            profile["description"] = "Julia is a young woman who maintains an outward appearance of Party orthodoxy but secretly rebels by having affairs with Party members. She is less interested in intellectual rebellion than Winston and more focused on living life on her own terms within the existing system. She works in the Fiction Department of the Ministry of Truth."
        
        elif character["name"] == "O'Brien":
            profile["role"] = "antagonist"
            profile["traits"] = ["intelligent", "calculating", "manipulative", "powerful", "loyal to Party"]
            profile["description"] = "O'Brien is a high-ranking member of the Inner Party who poses as a member of the Brotherhood resistance movement. He initially gains Winston's trust but later reveals himself as an agent of the Thought Police. He is the embodiment of the Party's power and effectively serves as Winston's torturer and re-educator at the Ministry of Love."
        
        elif character["name"] == "Big Brother":
            profile["role"] = "figurehead/symbol"
            profile["traits"] = ["omnipresent", "authoritarian", "symbolic"]
            profile["description"] = "Big Brother is the face of the Party and the figurehead of Oceania. He is described as a man with a mustache and represents the embodiment of the Party's power and authority. It is unclear if he actually exists as a person or is merely a fabrication of the Party to inspire loyalty and fear."
        
        elif character["name"] == "Mr. Charrington":
            profile["role"] = "hidden antagonist"
            profile["traits"] = ["deceptive", "patient", "observant"]
            profile["description"] = "Mr. Charrington appears to be an elderly shopkeeper in the prole district who rents a room above his shop to Winston and Julia for their secret meetings. He presents himself as a sympathetic figure interested in antiques and the past, but is ultimately revealed to be a member of the Thought Police who has been monitoring them."
        
        character_profiles.append(profile)
    
    print(f"Created detailed profiles for {len(character_profiles)} characters")
    return character_profiles

def save_data_to_json(data, filename):
    """Save data to a JSON file"""
    output_path = os.path.join("book_processing/output", filename)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Saved data to {output_path}")
    return output_path

def ensure_directories():
    """Ensure all necessary directories exist"""
    os.makedirs("book_processing/data", exist_ok=True)
    os.makedirs("book_processing/output", exist_ok=True)
    print("Created directories for BookNLP processing")

def process_1984():
    """Main function to process 1984 with BookNLP"""
    ensure_directories()
    
    # Input and output paths
    input_file = "book_processing/data/1984.txt"
    output_dir = "book_processing/data/1984_booknlp"
    book_id = "1984"
    
    # Check if the text file exists, if not, exit
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} does not exist.")
        print("Please run extract_pdf_text.py first to convert the PDF to text.")
        return
    
    # Process the book with BookNLP
    process_book_with_booknlp(input_file, output_dir, book_id)
    
    # Paths to the BookNLP output files
    entities_file = os.path.join(output_dir, f"{book_id}.entities")
    tokens_file = os.path.join(output_dir, f"{book_id}.tokens")
    quotes_file = os.path.join(output_dir, f"{book_id}.quotes")
    
    # Extract character information
    character_data = extract_characters(entities_file, tokens_file, quotes_file)
    save_data_to_json(character_data, "characters.json")
    
    # Extract theme information
    theme_data = extract_themes(tokens_file, character_data)
    save_data_to_json(theme_data, "themes.json")
    
    # Extract relationship information
    relationship_data = extract_relationships(entities_file, quotes_file, tokens_file, character_data)
    save_data_to_json(relationship_data, "relationships.json")
    
    # Create character profiles
    character_profile_data = create_character_profiles(character_data, relationship_data)
    save_data_to_json(character_profile_data, "character_profiles.json")
    
    print("BookNLP processing of 1984 complete!")

if __name__ == "__main__":
    process_1984()