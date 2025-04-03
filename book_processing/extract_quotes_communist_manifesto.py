import os
import json
import re
from collections import defaultdict

def extract_text_from_file(filepath):
    """Extract text from a text file."""
    print(f"Reading text from {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as file:
        text = file.read()
    
    return text

def split_into_chapters(text):
    """Split the text into chapters based on various patterns."""
    print("Splitting text into chapters...")
    
    # For Communist Manifesto, look for chapter patterns
    # Common patterns in Communist Manifesto editions:
    # - "Chapter X. ..."
    # - "I. ..." (Roman numerals)
    # - "CHAPTER X"
    
    # Try to find chapter markers
    chapter_patterns = [
        r'CHAPTER\s+[IVX]+',  # CHAPTER I, CHAPTER II, etc.
        r'Chapter\s+[IVX]+',  # Chapter I, Chapter II, etc.
        r'^[IVX]+\.\s',       # I., II., etc. at beginning of line
        r'^[IVX]+\s',         # I, II, etc. at beginning of line
    ]
    
    # Get potential chapter boundaries
    chapter_boundaries = []
    for pattern in chapter_patterns:
        for match in re.finditer(pattern, text, re.MULTILINE):
            chapter_boundaries.append(match.start())
    
    # Sort boundaries to ensure they're in order
    chapter_boundaries.sort()
    
    # If no chapter boundaries are found, try to use generic section breaks
    if not chapter_boundaries:
        print("No clear chapter markers found. Using paragraph breaks as approximate boundaries.")
        paragraphs = re.split(r'\n\s*\n', text)
        
        # Group paragraphs into approximate chapters (Communist Manifesto has 4 main sections)
        num_chapters = 4
        paragraphs_per_chapter = max(1, len(paragraphs) // num_chapters)
        
        chapters = []
        for i in range(0, len(paragraphs), paragraphs_per_chapter):
            chapter_text = '\n\n'.join(paragraphs[i:i+paragraphs_per_chapter])
            chapters.append({
                'id': len(chapters) + 1,
                'title': f"Section {len(chapters) + 1}",
                'text': chapter_text
            })
            
            if len(chapters) >= num_chapters:
                break
        
        return chapters
    
    # Extract chapters based on found boundaries
    chapters = []
    for i, start in enumerate(chapter_boundaries):
        end = chapter_boundaries[i+1] if i+1 < len(chapter_boundaries) else len(text)
        chapter_text = text[start:end].strip()
        
        # Extract chapter title from first line
        first_line = chapter_text.split('\n')[0].strip()
        chapter_id = i + 1
        
        chapters.append({
            'id': chapter_id,
            'title': first_line,
            'text': chapter_text
        })
    
    return chapters

def extract_quotes(chapters):
    """Extract quotes from the text."""
    print("Extracting quotes from text...")
    
    quotes = []
    quote_id = 1
    
    # Keywords relevant to Communist Manifesto
    marx_keywords = [
        "bourgeoisie", "proletariat", "capitalism", "communism", "revolution", 
        "class struggle", "means of production", "private property", "historical materialism",
        "exploitation", "labour", "labor", "worker", "capital", "bourgeois", "proletarian",
        "dialectic", "alienation", "communist", "capitalist", "class", "socialist", "socialism",
        "production", "property", "wage", "social", "political", "economic"
    ]
    
    for chapter in chapters:
        chapter_id = chapter['id']
        chapter_text = chapter['text']
        
        # Extract content between quotes
        quote_pattern = r'["\'](.*?)[\'\"]'
        quoted_texts = re.findall(quote_pattern, chapter_text, re.DOTALL)
        
        for quoted_text in quoted_texts:
            # Skip very short quotes
            if len(quoted_text.split()) < 4:
                continue
                
            # Find the context (text surrounding the quote)
            quote_index = chapter_text.find(quoted_text)
            
            # Get surrounding text for context
            start_idx = max(0, quote_index - 100)
            end_idx = min(len(chapter_text), quote_index + len(quoted_text) + 100)
            context = chapter_text[start_idx:end_idx].strip()
            
            # Determine significance based on length and keywords
            significance = 1
            
            # Longer quotes are more significant
            if len(quoted_text.split()) > 20:
                significance += 1
            
            # Check if quote contains important keywords
            keyword_count = sum(1 for keyword in marx_keywords if keyword.lower() in quoted_text.lower())
            if keyword_count >= 3:
                significance += 1
            if keyword_count >= 5:
                significance += 1
            
            quotes.append({
                "id": quote_id,
                "bookId": 2,  # Using 2 for Communist Manifesto (assuming 1984 is 1)
                "characterId": None,  # Will try to determine from content
                "chapterId": chapter_id,
                "page": 0,  # No page info in text extraction
                "text": quoted_text.strip(),
                "context": context,
                "significance": significance,
                "extractionMethod": "text_extract"
            })
            quote_id += 1
        
        # Additionally extract key statements by looking for sentences with keywords
        sentences = re.split(r'(?<=[.!?])\s+', chapter_text)
        
        for sentence in sentences:
            # Skip very short sentences
            if len(sentence.split()) < 8:
                continue
                
            # Check if sentence contains multiple keywords
            keyword_count = sum(1 for keyword in marx_keywords if keyword.lower() in sentence.lower())
            
            if keyword_count >= 3:
                # This sentence contains multiple keywords and might be significant
                significance = 1
                
                # Longer sentences with keywords are more significant
                if len(sentence.split()) > 15:
                    significance += 1
                if keyword_count >= 5:
                    significance += 1
                
                quotes.append({
                    "id": quote_id,
                    "bookId": 2,  # Using 2 for Communist Manifesto
                    "characterId": None,
                    "chapterId": chapter_id,
                    "page": 0,
                    "text": sentence.strip(),
                    "context": sentence.strip(),
                    "significance": significance,
                    "extractionMethod": "keyword_extract"
                })
                quote_id += 1
    
    return quotes

def detect_character_associations(quotes):
    """Attempt to detect character associations for quotes based on context."""
    print("Detecting character associations for quotes...")
    
    # Define main characters in Communist Manifesto
    characters = {
        "Karl Marx": ["marx", "karl"],
        "Friedrich Engels": ["engels", "friedrich"],
        "Bourgeoisie": ["bourgeois", "capitalist", "employer", "owner"],
        "Proletariat": ["proletarian", "worker", "laborer", "labourer", "working class"]
    }
    
    for quote in quotes:
        context = quote["context"].lower()
        
        # Check if any character names or references appear in the context
        for character_name, keywords in characters.items():
            if any(keyword in context for keyword in keywords):
                # For now, we're just storing the character name
                # In a more sophisticated system, we'd map to character IDs
                quote["character"] = character_name
                break
    
    return quotes

def organize_quotes_for_explorer(quotes):
    """Organize quotes for the quote explorer interface."""
    print("Organizing quotes for explorer UI...")
    
    # Define themes for Communist Manifesto
    themes = {
        "Class Struggle": ["class struggle", "class conflict", "oppressor", "oppressed"],
        "Capitalism Critique": ["capital", "capitalist", "profit", "bourgeois", "exploitation"],
        "Historical Materialism": ["history", "historical", "material conditions", "economic base"],
        "Proletariat Revolution": ["revolution", "revolutionary", "overthrow", "revolt"],
        "Bourgeois Society": ["bourgeois society", "middle class", "bourgeoisie"],
        "Communism": ["communism", "communist", "common ownership", "abolition"],
        "Exploitation of Labor": ["labour", "labor", "exploitation", "wage", "worker"]
    }
    
    quote_explorer = {
        "quotesByTheme": defaultdict(list),
        "quotesByCharacter": defaultdict(list),
        "mostSignificantQuotes": []
    }
    
    for quote in quotes:
        # Determine themes
        quote_themes = []
        text = quote["text"].lower()
        for theme_name, keywords in themes.items():
            if any(keyword in text for keyword in keywords):
                quote_themes.append(theme_name)
        
        # If no themes were detected, add to "Miscellaneous"
        if not quote_themes:
            quote_themes = ["Miscellaneous"]
        
        character = quote.get("character", "Unknown")
        
        # Add to quotes by theme
        for theme in quote_themes:
            quote_explorer["quotesByTheme"][theme].append({
                "id": quote["id"],
                "text": quote["text"],
                "chapter": quote["chapterId"],
                "significance": quote["significance"],
                "character": character
            })
        
        # Add to quotes by character
        quote_explorer["quotesByCharacter"][character].append({
            "id": quote["id"],
            "text": quote["text"],
            "themes": quote_themes,
            "chapter": quote["chapterId"],
            "significance": quote["significance"]
        })
        
        # Add to most significant quotes if significance is high
        if quote["significance"] >= 2:
            quote_explorer["mostSignificantQuotes"].append({
                "id": quote["id"],
                "text": quote["text"],
                "themes": quote_themes,
                "chapter": quote["chapterId"],
                "significance": quote["significance"],
                "character": character
            })
    
    # Sort significant quotes by significance
    quote_explorer["mostSignificantQuotes"].sort(key=lambda q: q["significance"], reverse=True)
    
    # Convert defaultdicts to regular dicts
    return {
        "quotesByTheme": dict(quote_explorer["quotesByTheme"]),
        "quotesByCharacter": dict(quote_explorer["quotesByCharacter"]),
        "mostSignificantQuotes": quote_explorer["mostSignificantQuotes"][:20]  # Top 20
    }

def save_json(data, filepath):
    """Save data to a JSON file."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"Saved data to {filepath}")

def main():
    """Main function to process the text and extract quotes."""
    # Paths
    text_file = "book_processing/data/communist_manifesto.txt"
    output_dir = "book_processing/output"
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract text
    if not os.path.exists(text_file):
        print(f"Error: Text file {text_file} not found.")
        print("Please run extract_pdf_text.py first to extract text from PDF.")
        return
    
    text = extract_text_from_file(text_file)
    
    # Split into chapters
    chapters = split_into_chapters(text)
    print(f"Found {len(chapters)} chapters/sections.")
    
    # Extract quotes
    quotes = extract_quotes(chapters)
    print(f"Extracted {len(quotes)} quotes and significant statements.")
    
    # Detect character associations
    quotes = detect_character_associations(quotes)
    
    # Save raw quotes
    save_json(quotes, f"{output_dir}/communist_manifesto_quotes.json")
    
    # Organize for quote explorer
    quote_explorer = organize_quotes_for_explorer(quotes)
    save_json(quote_explorer, f"{output_dir}/communist_manifesto_quote_explorer.json")
    
    print("Quote extraction complete!")

if __name__ == "__main__":
    main() 