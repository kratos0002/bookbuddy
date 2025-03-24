#!/usr/bin/env python3
"""
Extract_quotes.py - Extract meaningful quotes from 1984 PDF using extracted text and BookNLP
"""

import os
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

# Set up paths
SCRIPT_DIR = Path(__file__).parent
PDF_PATH = SCRIPT_DIR.parent / "attached_assets" / "1984.pdf"
OUTPUT_DIR = SCRIPT_DIR / "output"
QUOTES_OUTPUT = OUTPUT_DIR / "1984_quotes.json"
EXPLORER_OUTPUT = OUTPUT_DIR / "1984_quote_explorer.json"

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    """Extract raw text from a PDF file."""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page_num, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text += f"--- PAGE {page_num + 1} ---\n{page_text}\n\n"
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

def prepare_chapter_mapping():
    """Create a mapping of chapter indicators to chapter numbers."""
    # For 1984, chapters are simply numbered but may be styled differently
    chapter_map = {}
    
    # Part 1 has 8 chapters
    for i in range(1, 9):
        chapter_map[f"CHAPTER {i}"] = i
        chapter_map[f"Chapter {i}"] = i
        chapter_map[f"CHAPTER{i}"] = i
        chapter_map[f"Chapter{i}"] = i
    
    # Part 2 has 9 chapters (9-17)
    for i in range(9, 18):
        chapter_map[f"CHAPTER {i}"] = i
        chapter_map[f"Chapter {i}"] = i
        chapter_map[f"CHAPTER{i}"] = i
        chapter_map[f"Chapter{i}"] = i
    
    # Part 3 has 6 chapters (18-23)
    for i in range(18, 24):
        chapter_map[f"CHAPTER {i}"] = i
        chapter_map[f"Chapter {i}"] = i
        chapter_map[f"CHAPTER{i}"] = i
        chapter_map[f"Chapter{i}"] = i
    
    return chapter_map

def find_potential_quotes(text, min_length=30, max_length=500):
    """Find potential quotes using some heuristics."""
    # Split text into pages
    pages = re.split(r'--- PAGE \d+ ---', text)
    
    chapter_map = prepare_chapter_mapping()
    current_chapter = 1
    current_page = 1
    
    quotes = []
    
    for page_idx, page_text in enumerate(pages[1:], 1):  # Skip the first empty split
        lines = page_text.strip().split('\n')
        page_number = page_idx
        
        # Check for chapter headings
        for line in lines:
            line = line.strip()
            if line in chapter_map:
                current_chapter = chapter_map[line]
                break
                
        # Skip short pages (likely chapter transitions or blank pages)
        if len(page_text.strip()) < 100:
            continue
        
        # First, look for text in quotation marks
        quote_patterns = [
            r'"([^"]{' + str(min_length) + ',' + str(max_length) + '})"',  # Double quotes
            r"'([^']{" + str(min_length) + ',' + str(max_length) + "})'",  # Single quotes
        ]
        
        for pattern in quote_patterns:
            for match in re.finditer(pattern, page_text):
                quote_text = match.group(1).strip()
                
                # Skip quotes that are too short or too long after stripping
                if len(quote_text) < min_length or len(quote_text) > max_length:
                    continue
                
                # Basic deduplication - check if similar quote already exists
                if not any(q["text"] == quote_text for q in quotes):
                    # Extract some context (text before and after the quote)
                    start_pos = max(0, match.start() - 100)
                    end_pos = min(len(page_text), match.end() + 100)
                    context = page_text[start_pos:end_pos].strip()
                    
                    # Determine significance (somewhat arbitrary for now)
                    # Longer quotes might be more significant, especially in key chapters
                    significance = min(5, max(1, int(len(quote_text) / 100) + 2))
                    
                    # Adjust significance based on chapter (middle chapters often contain key revelations)
                    if 8 <= current_chapter <= 16:
                        significance = min(5, significance + 1)
                    
                    # Check for character names to associate the quote
                    character_id = None
                    character_patterns = {
                        "Winston": 1,
                        "Smith": 1,
                        "Julia": 2,
                        "O'Brien": 3,
                        "Charrington": 4,
                        "Parsons": 5,
                        "Syme": 6,
                        "Ampleforth": 7,
                        "Big Brother": 8
                    }
                    
                    for name, char_id in character_patterns.items():
                        if name in context[:context.find(quote_text)]:
                            character_id = char_id
                            break
                    
                    quotes.append({
                        "id": len(quotes) + 1,
                        "bookId": 1,  # 1984 is book ID 1
                        "characterId": character_id,
                        "chapterId": current_chapter,
                        "page": page_number,
                        "text": quote_text,
                        "context": context,
                        "significance": significance,
                        "extractionMethod": "pdf_extract"
                    })
        
        # Look for significant statements even if not in quotes
        # This is more complex and prone to errors, but can find important quotes
        
        # Split into sentences and process each
        sentences = re.split(r'[.!?]+', page_text)
        for sentence in sentences:
            # Only consider sentences of appropriate length
            sentence = sentence.strip()
            if min_length <= len(sentence) <= max_length:
                # Check if sentence contains significant keywords or phrases
                keywords = [
                    "freedom", "war is peace", "ignorance is strength", "thought crime", 
                    "big brother", "ministry of truth", "ministry of love", "doublethink",
                    "newspeak", "memory hole", "telescreen", "thought police", "room 101",
                    "oceania", "eastasia", "eurasia", "proles", "brotherhood", "goldstein",
                    "thoughtcrime", "crimethink", "facecrime", "unperson", "vaporized",
                    "blackwhite", "bellyfeel", "oldspeak", "crimestop", "goodthink",
                    "Emmanuel", "Smith", "Julia"
                ]
                
                if any(keyword.lower() in sentence.lower() for keyword in keywords):
                    # Basic deduplication - check if similar sentence already exists
                    if not any(q["text"] == sentence for q in quotes):
                        # Determine significance based on keywords and length
                        keyword_count = sum(1 for kw in keywords if kw.lower() in sentence.lower())
                        significance = min(5, max(1, int(keyword_count / 2) + 2))
                        
                        # Extract some context
                        sentence_start = page_text.find(sentence)
                        if sentence_start >= 0:
                            start_pos = max(0, sentence_start - 50)
                            end_pos = min(len(page_text), sentence_start + len(sentence) + 50)
                            context = page_text[start_pos:end_pos].strip()
                        else:
                            context = None
                        
                        quotes.append({
                            "id": len(quotes) + 1,
                            "bookId": 1,  # 1984 is book ID 1
                            "characterId": None,  # Can't reliably determine for non-quoted text
                            "chapterId": current_chapter,
                            "page": page_number,
                            "text": sentence,
                            "context": context,
                            "significance": significance,
                            "extractionMethod": "keyword_extract"
                        })
    
    # Sort quotes by significance (descending)
    quotes.sort(key=lambda q: q["significance"], reverse=True)
    
    return quotes

def process_quotes_for_explorer(quotes):
    """Process the extracted quotes to create the explorer data structure."""
    
    # Define the main themes in 1984
    themes = {
        "Totalitarianism": [
            "big brother", "party", "control", "power", "surveillance", 
            "telescreens", "thought police", "ministry", "victory"
        ],
        "Psychological Manipulation": [
            "doublethink", "newspeak", "reality control", "memory hole", 
            "vaporized", "unperson", "confession", "torture", "room 101", "pain"
        ],
        "Control of Information": [
            "ministry of truth", "records", "memory hole", "newspeak", 
            "dictionary", "alter", "rewrite", "history", "facts", "documents"
        ],
        "Individual vs. Collective": [
            "proles", "brotherhood", "rebellion", "resist", "freedom", 
            "individual", "humanity", "solidarity", "alone", "masses"
        ],
        "Surveillance": [
            "telescreen", "watched", "spies", "thought police", "hidden", 
            "microphone", "eyes", "ears", "patrol", "observe"
        ],
        "Identity and Existence": [
            "exist", "existed", "memory", "proof", "photograph", "diary", 
            "remember", "forget", "self", "identity", "persist"
        ]
    }
    
    # Define the main characters
    characters = {
        "Winston Smith": 1,
        "Julia": 2, 
        "O'Brien": 3,
        "Mr. Charrington": 4,
        "Parsons": 5,
        "Syme": 6,
        "Ampleforth": 7,
        "Big Brother": 8,
    }
    
    # Create initial structure
    explorer_data = {
        "quotesByTheme": {theme: [] for theme in themes},
        "quotesByCharacter": {char: [] for char in characters},
        "mostSignificantQuotes": []
    }
    
    # Add "Narrator" for quotes without an assigned character
    explorer_data["quotesByCharacter"]["Narrator"] = []
    
    # Process each quote
    for quote in quotes:
        quote_theme_names = []
        
        # Determine themes for this quote
        for theme_name, keywords in themes.items():
            if any(keyword.lower() in quote["text"].lower() for keyword in keywords):
                quote_theme_names.append(theme_name)
                
                # Add to theme's quotes
                theme_quote = {
                    "id": quote["id"],
                    "text": quote["text"],
                    "chapter": quote["chapterId"],
                    "significance": quote["significance"]
                }
                
                # Add character if available
                if quote["characterId"] is not None:
                    char_id = quote["characterId"]
                    char_name = next((name for name, id in characters.items() if id == char_id), "Unknown")
                    theme_quote["character"] = char_name
                
                explorer_data["quotesByTheme"][theme_name].append(theme_quote)
        
        # If no themes detected, add to "Other" theme
        if not quote_theme_names:
            # Filter out quotes that don't match any theme
            continue
        
        # Determine character for this quote
        char_name = "Narrator"  # Default
        if quote["characterId"] is not None:
            char_id = quote["characterId"]
            char_name = next((name for name, id in characters.items() if id == char_id), "Narrator")
        
        # Add to character's quotes
        character_quote = {
            "id": quote["id"],
            "text": quote["text"],
            "themes": quote_theme_names,
            "chapter": quote["chapterId"],
            "significance": quote["significance"]
        }
        explorer_data["quotesByCharacter"][char_name].append(character_quote)
        
        # Add to most significant quotes if significance >= 4
        if quote["significance"] >= 4:
            significant_quote = {
                "id": quote["id"],
                "text": quote["text"],
                "themes": quote_theme_names,
                "chapter": quote["chapterId"],
                "significance": quote["significance"]
            }
            
            # Add character if not narrator
            if char_name != "Narrator":
                significant_quote["character"] = char_name
                
            explorer_data["mostSignificantQuotes"].append(significant_quote)
    
    # Sort most significant quotes
    explorer_data["mostSignificantQuotes"].sort(key=lambda q: q["significance"], reverse=True)
    
    # Limit to top 50
    explorer_data["mostSignificantQuotes"] = explorer_data["mostSignificantQuotes"][:50]
    
    return explorer_data

def main():
    print(f"Extracting quotes from {PDF_PATH}...")
    
    if not PDF_PATH.exists():
        print(f"Error: PDF file not found at {PDF_PATH}")
        sys.exit(1)
    
    # Extract text from PDF
    text = extract_text_from_pdf(PDF_PATH)
    if not text:
        print("Failed to extract text from the PDF.")
        sys.exit(1)
    
    print(f"Extracted {len(text)} characters of text.")
    
    # Find potential quotes
    quotes = find_potential_quotes(text)
    print(f"Found {len(quotes)} potential quotes.")
    
    if not quotes:
        print("No quotes found. Exiting.")
        sys.exit(1)
    
    # Save raw quotes
    with open(QUOTES_OUTPUT, 'w') as f:
        json.dump(quotes, f, indent=2)
    print(f"Raw quotes saved to {QUOTES_OUTPUT}")
    
    # Process for explorer view
    explorer_data = process_quotes_for_explorer(quotes)
    
    # Save explorer data
    with open(EXPLORER_OUTPUT, 'w') as f:
        json.dump(explorer_data, f, indent=2)
    print(f"Explorer data saved to {EXPLORER_OUTPUT}")
    
    print("Quote extraction completed successfully!")

if __name__ == "__main__":
    main()