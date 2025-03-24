# Book Processing Scripts for LitViz

This directory contains scripts to process books and extract various data for use in the LitViz application.

## Quote Extraction

The `extract_quotes.py` script extracts meaningful quotes from the 1984 PDF and organizes them for the Quote Explorer feature.

### How to Run

1. Make sure you have the required Python packages installed:
   ```
   pip install pypdf
   ```

2. Run the script:
   ```
   python extract_quotes.py
   ```

3. The script will:
   - Extract text from the PDF file in `attached_assets/1984.pdf`
   - Identify quotes and significant statements
   - Save raw quotes to `output/1984_quotes.json`
   - Process and organize quotes into `output/1984_quote_explorer.json` for the explorer UI

### Output Format

The `1984_quotes.json` file contains an array of raw quotes with the following structure:
```json
[
  {
    "id": 1,
    "bookId": 1,
    "characterId": 1,
    "chapterId": 3,
    "page": 45,
    "text": "The quote text here...",
    "context": "Some surrounding text for context...",
    "significance": 5,
    "extractionMethod": "pdf_extract"
  },
  ...
]
```

The `1984_quote_explorer.json` file contains an organized structure for the Quote Explorer UI:
```json
{
  "quotesByTheme": {
    "Totalitarianism": [
      {
        "id": 1,
        "text": "Quote text...",
        "chapter": 3,
        "significance": 5,
        "character": "Winston Smith"
      },
      ...
    ],
    ...
  },
  "quotesByCharacter": {
    "Winston Smith": [
      {
        "id": 1,
        "text": "Quote text...",
        "themes": ["Totalitarianism", "Surveillance"],
        "chapter": 3,
        "significance": 5
      },
      ...
    ],
    ...
  },
  "mostSignificantQuotes": [
    {
      "id": 1,
      "text": "Quote text...",
      "themes": ["Totalitarianism", "Surveillance"],
      "chapter": 3,
      "significance": 5,
      "character": "Winston Smith"
    },
    ...
  ]
}
```

### How It Works

The quote extraction process works in three main stages:

1. **PDF Text Extraction**: Extracts raw text from the PDF file, preserving page numbers.

2. **Quote Identification**: Uses several methods to identify potential quotes:
   - Extracts text in quotation marks
   - Identifies significant statements containing key terms from the book
   - Attempts to associate quotes with characters based on context
   - Assigns significance scores based on length, keywords, and chapter importance

3. **Theme Assignment**: Organizes quotes by:
   - Themes - based on keywords in the quote text
   - Characters - based on detected character associations
   - Significance - highlighting the most important quotes

### Known Limitations

- PDF extraction quality depends on the PDF formatting and OCR quality
- Character attribution is based on simple name detection in surrounding text
- Theme assignment uses keyword matching and may not capture nuanced thematic elements
- Quotes without quotation marks rely on keyword detection and may include some irrelevant content