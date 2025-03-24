# Merge Request: Quote Explorer Feature

## Overview
This MR implements a Quote Explorer feature for the LitViz application, which allows users to explore memorable quotes from "1984" by theme, character, and significance. The implementation includes backend services, API endpoints, and a data extraction script for processing the book text.

## Changes

### New Files Added
1. `server/services/quote-explorer-service.ts` - Service for retrieving and organizing quotes
   - Implements the `QuoteExplorerService` class that loads and processes quote data
   - Provides methods to retrieve quotes by theme, character, chapter, and significance
   - Includes sample data fallback when BookNLP processed data is not available

2. `book_processing/extract_quotes.py` - Script to extract quotes from the 1984 PDF file
   - Extracts text from the 1984 PDF file
   - Identifies potential quotes using regex patterns for quoted text
   - Associates quotes with characters and themes based on context
   - Calculates significance scores for quotes based on multiple factors
   - Outputs structured JSON data for use by the application

### Files Modified
1. `shared/schema.ts` - Added schema definitions for quotes, quote themes, and quote annotations
   ```typescript
   // Added quote-related schema definitions
   export const quotes = pgTable("quotes", {
     id: serial("id").primaryKey(),
     bookId: integer("book_id").references(() => books.id, { onDelete: "cascade" }),
     characterId: integer("character_id").references(() => characters.id),
     chapterId: integer("chapter_id"),
     page: integer("page"),
     text: text("text").notNull(),
     context: text("context"),
     significance: integer("significance").default(1),
     extractionMethod: text("extraction_method")
   });

   export const quoteThemes = pgTable("quote_themes", {
     id: serial("id").primaryKey(),
     quoteId: integer("quote_id").references(() => quotes.id, { onDelete: "cascade" }),
     themeId: integer("theme_id").references(() => themes.id, { onDelete: "cascade" })
   });

   export const quoteAnnotations = pgTable("quote_annotations", {
     id: serial("id").primaryKey(),
     quoteId: integer("quote_id").references(() => quotes.id, { onDelete: "cascade" }),
     userId: integer("user_id").references(() => users.id),
     annotation: text("annotation").notNull(),
     createdAt: timestamp("created_at").defaultNow()
   });

   // Added QuoteExplorerData interface
   export interface QuoteExplorerData {
     quotesByTheme: Record<string, Array<{
       id: number;
       text: string;
       character?: string;
       chapter: number;
       significance: number;
     }>>;
     quotesByCharacter: Record<string, Array<{
       id: number;
       text: string;
       themes: string[];
       chapter: number;
       significance: number;
     }>>;
     mostSignificantQuotes: Array<{
       id: number;
       text: string;
       character?: string;
       themes: string[];
       chapter: number;
       significance: number;
     }>;
   }
   ```

2. `server/routes.ts` - Added API endpoints for the Quote Explorer feature
   ```typescript
   // Added Quote Explorer endpoints
   // Get all quotes
   app.get("/api/quotes", async (req: Request, res: Response) => {
     try {
       const quotes = await storage.getAllQuotes();
       res.json(quotes);
     } catch (error) {
       console.error("Error getting quotes:", error);
       res.status(500).json({ error: "Failed to retrieve quotes" });
     }
   });

   // Get quotes by theme
   app.get("/api/quotes/by-theme/:themeId", async (req: Request, res: Response) => {
     try {
       const themeId = parseInt(req.params.themeId);
       const quotes = await storage.getQuotesByThemeId(themeId);
       res.json(quotes);
     } catch (error) {
       console.error("Error getting quotes by theme:", error);
       res.status(500).json({ error: "Failed to retrieve quotes by theme" });
     }
   });

   // Get quotes by character
   app.get("/api/quotes/by-character/:characterId", async (req: Request, res: Response) => {
     try {
       const characterId = parseInt(req.params.characterId);
       const quotes = await storage.getQuotesByCharacterId(characterId);
       res.json(quotes);
     } catch (error) {
       console.error("Error getting quotes by character:", error);
       res.status(500).json({ error: "Failed to retrieve quotes by character" });
     }
   });

   // Get most significant quotes
   app.get("/api/quotes/significant", async (req: Request, res: Response) => {
     try {
       const quotes = await storage.getMostSignificantQuotes();
       res.json(quotes);
     } catch (error) {
       console.error("Error getting significant quotes:", error);
       res.status(500).json({ error: "Failed to retrieve significant quotes" });
     }
   });

   // Get complete Quote Explorer data
   app.get("/api/quotes/explorer-data", async (req: Request, res: Response) => {
     try {
       const explorerData = await storage.getQuoteExplorerData();
       res.json(explorerData);
     } catch (error) {
       console.error("Error getting quote explorer data:", error);
       res.status(500).json({ error: "Failed to retrieve quote explorer data" });
     }
   });
   ```

3. `server/storage.ts` - Added storage methods for quotes data
   ```typescript
   // Added to IStorage interface
   interface IStorage {
     // ...existing methods...
     
     // Quote methods
     getAllQuotes(): Promise<Quote[]>;
     getQuotesByThemeId(themeId: number): Promise<Quote[]>;
     getQuotesByCharacterId(characterId: number): Promise<Quote[]>;
     getQuotesByChapterId(chapterId: number): Promise<Quote[]>;
     getMostSignificantQuotes(): Promise<Quote[]>;
     getQuoteThemes(quoteId: number): Promise<number[]>;
     getQuoteExplorerData(): Promise<QuoteExplorerData>;
   }
   
   // Implementation in MemStorage and DatabaseStorage classes
   async getAllQuotes(): Promise<Quote[]> {
     // Implementation details
   }
   
   async getQuotesByThemeId(themeId: number): Promise<Quote[]> {
     // Implementation details
   }
   
   async getQuotesByCharacterId(characterId: number): Promise<Quote[]> {
     // Implementation details
   }
   
   async getQuotesByChapterId(chapterId: number): Promise<Quote[]> {
     // Implementation details
   }
   
   async getMostSignificantQuotes(): Promise<Quote[]> {
     // Implementation details
   }
   
   async getQuoteThemes(quoteId: number): Promise<number[]> {
     // Implementation details
   }
   
   async getQuoteExplorerData(): Promise<QuoteExplorerData> {
     // Implementation details
   }
   ```

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