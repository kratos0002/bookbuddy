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
    """Run the full processing pipeline"""
    # Ensure output directory exists
    os.makedirs("book_processing/output", exist_ok=True)
    
    # Step 1: Extract text from PDF
    if not run_command("python book_processing/extract_pdf_text.py", 
                      "Extracting text from PDF"):
        print("Failed to extract text from PDF. Aborting.")
        return False
    
    # Step 2: Process the text with BookNLP
    if not run_command("python book_processing/process_text_with_booknlp.py", 
                      "Processing with BookNLP"):
        print("Failed to process text with BookNLP. Using sample data instead.")
        # Fall back to sample data if BookNLP processing fails
        return run_command("python book_processing/generate_sample_data.py",
                          "Generating sample data")
    
    print("\n===== Processing complete =====")
    print("All processing steps completed successfully!")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)