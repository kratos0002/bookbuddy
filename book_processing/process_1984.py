import os
import json
from booknlp.booknlp import BookNLP

def process_book_with_booknlp(input_file, output_dir, book_id):
    """Process the book with BookNLP"""
    # Configure model parameters
    model_params = {
        "pipeline": "entity,quote,supersense,event,coref",
        "model": "small"  # Using small model for better compatibility
    }
    
    # Initialize the BookNLP instance
    booknlp = BookNLP("en", model_params)
    
    # Process the book
    print(f"Processing {input_file} with BookNLP...")
    booknlp.process(input_file, output_dir, book_id)
    print(f"Processing complete. Results saved to {output_dir}")

def convert_to_structured_json(output_dir, book_id):
    """Convert BookNLP output to structured JSON files"""
    output_files = {
        "characters": {},
        "quotes": {},
        "events": {},
        "themes": {}
    }
    
    # Paths to the BookNLP output files
    entities_file = os.path.join(output_dir, f"{book_id}.entities")
    tokens_file = os.path.join(output_dir, f"{book_id}.tokens")
    quotes_file = os.path.join(output_dir, f"{book_id}.quotes")
    
    # Process character data
    character_data = {}
    if os.path.exists(entities_file):
        print(f"Processing character data from {entities_file}")
        with open(entities_file, "r", encoding="utf-8") as f:
            for line in f:
                parts = line.strip().split("\t")
                if len(parts) >= 6:
                    coref_id, start_token, end_token, entity_type, entity_category, text = parts[:6]
                    
                    # Only process person entities
                    if entity_category == "PER":
                        if coref_id not in character_data:
                            character_data[coref_id] = {
                                "id": coref_id,
                                "name": text,
                                "mentions": [],
                                "referential_gender": None,  # To be determined
                                "quotes": [],
                                "actions": []
                            }
                        
                        character_data[coref_id]["mentions"].append({
                            "text": text,
                            "type": entity_type,  # PROP, NOM, PRON
                            "start_token": start_token,
                            "end_token": end_token
                        })
    
    # Process quotes
    if os.path.exists(quotes_file):
        print(f"Processing quotes from {quotes_file}")
        with open(quotes_file, "r", encoding="utf-8") as f:
            for line in f:
                parts = line.strip().split("\t")
                if len(parts) >= 7:
                    quote_start, quote_end, speaker_start, speaker_end, speaker_text, speaker_id, quote_text = parts[:7]
                    
                    # Store the quote with its speaker
                    if speaker_id in character_data:
                        character_data[speaker_id]["quotes"].append({
                            "text": quote_text,
                            "start_token": quote_start,
                            "end_token": quote_end
                        })
    
    # Save the character data
    characters_json_path = os.path.join(output_dir, "characters.json")
    with open(characters_json_path, "w", encoding="utf-8") as f:
        json.dump(list(character_data.values()), f, indent=2)
    
    print(f"Character data saved to {characters_json_path}")
    
    # Return paths to the created JSON files
    output_files["characters"] = characters_json_path
    
    return output_files

def main():
    # Use the extracted text file
    input_file = "book_processing/data/1984.txt"
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found.")
        return
    
    # Set up paths
    output_dir = "book_processing/output"
    book_id = "1984"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process with BookNLP
    process_book_with_booknlp(input_file, output_dir, book_id)
    
    # Convert to structured JSON
    json_files = convert_to_structured_json(output_dir, book_id)
    
    print("Processing complete. JSON files created:")
    for file_type, file_path in json_files.items():
        print(f"- {file_type}: {file_path}")

if __name__ == "__main__":
    main()