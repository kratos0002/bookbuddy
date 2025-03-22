import os
from pypdf import PdfReader

def extract_text_from_pdf(pdf_path, output_path):
    """
    Extract text from a PDF file and save it to a text file.
    
    Args:
        pdf_path (str): Path to the PDF file
        output_path (str): Path to save the extracted text
    """
    print(f"Extracting text from {pdf_path}...")
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Extract text from PDF
    reader = PdfReader(pdf_path)
    text = ""
    
    # Process each page
    total_pages = len(reader.pages)
    print(f"Processing {total_pages} pages...")
    
    for i, page in enumerate(reader.pages):
        print(f"Processing page {i+1}/{total_pages}...", end="\r")
        page_text = page.extract_text()
        text += page_text + "\n\n"
    
    # Write text to file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
    
    print(f"\nExtracted {len(text)} characters to {output_path}")
    return output_path

if __name__ == "__main__":
    pdf_path = "attached_assets/1984.pdf"
    output_path = "book_processing/data/1984.txt"
    
    # Ensure the data directory exists
    os.makedirs("book_processing/data", exist_ok=True)
    
    extract_text_from_pdf(pdf_path, output_path)
    print("Text extraction complete!")