# Merge Request: Quote Explorer Feature

## Overview
This MR implements a Quote Explorer feature for the LitViz application, which allows users to explore memorable quotes from "1984" by theme, character, and significance. The implementation includes backend services, API endpoints, and a data extraction script for processing the book text.

## Changes

### New Files Added
1. `server/services/quote-explorer-service.ts` - Service for retrieving and organizing quotes
2. `book_processing/extract_quotes.py` - Script to extract quotes from the 1984 PDF file

### Files Modified
1. `shared/schema.ts` - Added schema definitions for quotes, quote themes, and quote annotations
2. `server/routes.ts` - Added API endpoints for the Quote Explorer feature
3. `server/storage.ts` - Added storage methods for quotes data

## Feature Details

### Quote Explorer Data Structure
The Quote Explorer organizes quotes in three main categories:
- **By Theme**: Quotes organized under themes like "Totalitarianism", "Psychological Manipulation", etc.
- **By Character**: Quotes attributed to characters like Winston Smith, Julia, O'Brien, etc.
- **Most Significant**: The most important quotes from the book based on significance score

### API Endpoints
- `GET /api/quotes/explorer-data` - Get the complete Quote Explorer data structure
- `GET /api/quotes` - Get all quotes
- `GET /api/quotes/by-theme/:themeId` - Get quotes by theme
- `GET /api/quotes/by-character/:characterId` - Get quotes by character
- `GET /api/quotes/significant` - Get most significant quotes

### Quote Extraction Process
The extraction script (`extract_quotes.py`) processes the PDF version of "1984" to:
1. Extract text and identify chapter boundaries
2. Find text enclosed in quotation marks that meet length criteria
3. Identify significant statements even if not in quotes
4. Associate quotes with characters when possible
5. Calculate a significance score based on length, keywords, and chapter importance
6. Organize quotes by themes using keyword matching

## Testing
The Quote Explorer backend has been implemented and the server correctly serves the API endpoints. The implementation uses sample quote data when BookNLP processed data is not available, ensuring the feature works in all environments.

## Future Work
1. Frontend implementation of the Quote Explorer UI (to be handled by you)
2. Refinement of theme detection and significance scoring algorithm
3. Integration with the chat interface to reference relevant quotes

## Conclusion
This MR completes the backend portion of the Quote Explorer feature, providing a solid foundation for the frontend implementation. The feature enhances the literary analysis capabilities of LitViz by enabling users to explore the rich textual content of "1984" through multiple perspectives.