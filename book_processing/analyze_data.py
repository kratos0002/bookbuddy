import os
import json
import re
from collections import Counter, defaultdict

def load_json_data(file_path):
    """Load JSON data from a file"""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def extract_character_profiles(characters_json):
    """Extract detailed character profiles from BookNLP output"""
    profiles = []
    
    for character in characters_json:
        # Skip unnamed or minor characters (those with few mentions)
        if len(character['mentions']) < 5:
            continue
        
        # Get most common name for this character
        name_counter = Counter([
            mention['text'] for mention in character['mentions'] 
            if mention['type'] in ['PROP', 'NOM']  # Only consider proper nouns and nominal mentions
        ])
        
        if not name_counter:
            continue  # Skip if no proper/nominal mentions
            
        most_common_name = name_counter.most_common(1)[0][0]
        
        # Extract character quotes
        quotes = [quote['text'] for quote in character['quotes']]
        
        # Create profile
        profile = {
            'id': character['id'],
            'name': most_common_name,
            'aliases': list(name_counter.keys()),
            'quote_count': len(quotes),
            'mention_count': len(character['mentions']),
            'sample_quotes': quotes[:10],  # Include up to 10 sample quotes
            'gender': character.get('referential_gender', 'unknown')
        }
        
        profiles.append(profile)
    
    # Sort by mention count (most mentioned characters first)
    profiles.sort(key=lambda x: x['mention_count'], reverse=True)
    
    return profiles

def extract_themes(characters_json, tokens_file_path):
    """Extract potential themes based on word frequency and context"""
    # Load tokens file if it exists
    if not os.path.exists(tokens_file_path):
        return []
    
    # Load known 1984 themes for identification
    known_themes = [
        {"name": "Totalitarianism", "keywords": ["big brother", "party", "government", "control", "watching", "surveillance"]},
        {"name": "Surveillance", "keywords": ["telescreen", "watching", "spying", "observe", "listen", "monitor"]},
        {"name": "Loyalty", "keywords": ["betray", "brotherhood", "loyalty", "faithful", "trust", "believe"]},
        {"name": "Rebellion", "keywords": ["rebel", "resistance", "fight", "against", "defy", "disobey"]},
        {"name": "Propaganda", "keywords": ["newspeak", "doublethink", "ministry", "truth", "slogans", "history"]},
        {"name": "Dehumanization", "keywords": ["human", "machine", "robot", "emotion", "feeling", "mechanical"]}
    ]
    
    # Read tokens file to get context
    word_context = defaultdict(list)
    theme_evidence = defaultdict(list)
    
    # Process tokens to find theme evidence
    with open(tokens_file_path, 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 5:
                word = parts[4].lower()
                sentence_id = parts[1]
                
                # Check if this word is related to any theme
                for theme in known_themes:
                    if any(keyword in word for keyword in theme["keywords"]):
                        # Store the sentence ID for context recovery later
                        theme_evidence[theme["name"]].append(sentence_id)
    
    # Process themes with evidence
    themes_data = []
    for theme_name, sentence_ids in theme_evidence.items():
        theme_info = next((t for t in known_themes if t["name"] == theme_name), None)
        if theme_info:
            themes_data.append({
                "name": theme_name,
                "keywords": theme_info["keywords"],
                "occurrence_count": len(sentence_ids),
                "evidence_sentence_ids": list(set(sentence_ids))[:20]  # Sample up to 20 unique sentence IDs
            })
    
    # Sort by occurrence count
    themes_data.sort(key=lambda x: x["occurrence_count"], reverse=True)
    
    return themes_data

def extract_relationships(characters_json):
    """Extract character relationships based on co-occurrence in quotes and scenes"""
    # This is a simplified version; in a real implementation, we would analyze
    # token proximity and context to determine actual relationships
    relationships = []
    character_map = {char['id']: char for char in characters_json}
    
    # Characters who frequently appear in quotes from each other
    for char1 in characters_json:
        for char2 in characters_json:
            if char1['id'] == char2['id']:
                continue  # Skip self-relationships
                
            # Count mentions of char2 in char1's quotes
            mentions = 0
            for quote in char1.get('quotes', []):
                quote_text = quote['text'].lower()
                
                # Check if char2's name variants appear in char1's quotes
                for mention in char2.get('mentions', []):
                    if mention['text'].lower() in quote_text:
                        mentions += 1
            
            if mentions > 0:
                relationships.append({
                    'source': char1['id'],
                    'source_name': char1.get('name', 'Unknown'),
                    'target': char2['id'],
                    'target_name': char2.get('name', 'Unknown'),
                    'type': 'mentions',
                    'strength': mentions
                })
    
    # Sort by relationship strength
    relationships.sort(key=lambda x: x['strength'], reverse=True)
    
    return relationships

def main():
    # Paths
    base_output_dir = "book_processing/output"
    book_id = "1984"
    
    characters_json_path = os.path.join(base_output_dir, "characters.json")
    tokens_file_path = os.path.join(base_output_dir, f"{book_id}.tokens")
    
    # Load character data
    characters_json = load_json_data(characters_json_path)
    if not characters_json:
        print(f"Error: Could not load character data from {characters_json_path}")
        return
    
    # Extract character profiles
    character_profiles = extract_character_profiles(characters_json)
    
    # Save character profiles
    profiles_path = os.path.join(base_output_dir, "character_profiles.json")
    with open(profiles_path, 'w', encoding='utf-8') as f:
        json.dump(character_profiles, f, indent=2)
    print(f"Character profiles saved to {profiles_path}")
    
    # Extract themes
    themes = extract_themes(characters_json, tokens_file_path)
    
    # Save themes
    themes_path = os.path.join(base_output_dir, "themes.json")
    with open(themes_path, 'w', encoding='utf-8') as f:
        json.dump(themes, f, indent=2)
    print(f"Themes saved to {themes_path}")
    
    # Extract relationships
    relationships = extract_relationships(characters_json)
    
    # Save relationships
    relationships_path = os.path.join(base_output_dir, "relationships.json")
    with open(relationships_path, 'w', encoding='utf-8') as f:
        json.dump(relationships, f, indent=2)
    print(f"Relationships saved to {relationships_path}")

if __name__ == "__main__":
    main()