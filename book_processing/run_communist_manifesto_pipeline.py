import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and display its output"""
    print(f"\n===== {description} =====")
    print(f"Running: {command}")
    
    try:
        process = subprocess.run(command, shell=True, check=True, 
                                text=True, capture_output=True)
        print(process.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        print(f"Output: {e.stdout}")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Run the full processing pipeline for The Communist Manifesto"""
    # Ensure output directory exists
    os.makedirs("book_processing/output", exist_ok=True)
    os.makedirs("book_processing/data", exist_ok=True)
    
    # Make sure the PDF is in the correct location
    if not os.path.exists("attached_assets/communist_manifesto.pdf"):
        print("Error: The Communist Manifesto PDF file not found at 'attached_assets/communist_manifesto.pdf'")
        print("Please place the PDF file in the 'attached_assets' directory with the name 'communist_manifesto.pdf'")
        return False
    
    # Step 1: Extract text from PDF
    if not run_command("python book_processing/extract_pdf_text.py", 
                      "Extracting text from Communist Manifesto PDF"):
        print("Failed to extract text from PDF. Aborting.")
        return False
    
    # Step 2: Process the text with BookNLP
    if not run_command("python book_processing/process_text_with_booknlp.py", 
                      "Processing Communist Manifesto with BookNLP"):
        print("Failed to process text with BookNLP.")
        return False
    
    # Step 3: Extract quotes from the text file
    if not run_command("python book_processing/extract_quotes_communist_manifesto.py",
                      "Extracting quotes from Communist Manifesto"):
        print("Failed to extract quotes.")
        return False
    
    print("\n===== Processing complete =====")
    print("All processing steps for The Communist Manifesto completed successfully!")
    print("\nOutput files generated:")
    print("1. book_processing/data/communist_manifesto.txt - Raw text from the PDF")
    print("2. book_processing/data/communist_manifesto_booknlp/* - BookNLP processing results")
    print("3. book_processing/output/communist_manifesto_characters.json - Character data")
    print("4. book_processing/output/communist_manifesto_themes.json - Theme data")
    print("5. book_processing/output/communist_manifesto_relationships.json - Relationship data")
    print("6. book_processing/output/communist_manifesto_character_profiles.json - Character profiles")
    print("7. book_processing/output/communist_manifesto_quotes.json - Raw quotes")
    print("8. book_processing/output/communist_manifesto_quote_explorer.json - Organized quotes for UI")
    
    print("\nNext steps:")
    print("1. Review the generated files to ensure they contain quality data")
    print("2. Update the application to include The Communist Manifesto data")
    print("3. Create UI components and conversation handlers for the new book")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 