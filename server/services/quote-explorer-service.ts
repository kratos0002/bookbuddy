import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { Quote, QuoteTheme, QuoteExplorerData } from '@shared/schema';

// Define interfaces for themeQuoteData to avoid using 'any'
interface ThemeQuoteData {
  id: number;
  text: string;
  chapter: number;
  significance: number;
  character?: string;
}

interface CharacterQuoteData {
  id: number;
  text: string;
  themes: string[];
  chapter: number;
  significance: number;
}

interface SignificantQuoteData {
  id: number;
  text: string;
  themes: string[];
  chapter: number;
  significance: number;
  character?: string;
}

/**
 * Service for the Quote Explorer feature
 * Extracts and analyzes memorable quotes from "1984" using BookNLP data
 */
class QuoteExplorerService {
  private quoteData: Quote[] = [];
  private quoteThemeData: Map<number, number[]> = new Map(); // Quote ID to Theme IDs
  private characterMap: Map<number, string> = new Map(); // Character ID to name
  private themeMap: Map<number, string> = new Map(); // Theme ID to name
  private initialized: boolean = false;
  
  constructor() {
    this.loadQuoteData();
  }
  
  /**
   * Load quote data from BookNLP processed files
   */
  private loadQuoteData(): void {
    try {
      // Get the directory of the current module
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Try multiple possible paths for the quote explorer data
      const possiblePaths = [
        // Development paths
        path.resolve('book_processing/output/1984_quote_explorer.json'),
        path.resolve(__dirname, '../../book_processing/output/1984_quote_explorer.json'),
        // Production paths
        path.resolve(__dirname, '../data/1984_quote_explorer.json'),
        path.resolve(process.cwd(), 'data/1984_quote_explorer.json'),
        path.resolve(process.cwd(), 'dist/data/1984_quote_explorer.json')
      ];
      
      let quoteExplorerData = null;
      let usedPath = '';
      
      // Try each path until we find the file
      for (const filePath of possiblePaths) {
        try {
          if (fs.existsSync(filePath)) {
            quoteExplorerData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            usedPath = filePath;
            console.log(`[quote-explorer] Successfully loaded data from: ${filePath}`);
            break;
          }
        } catch (err) {
          console.log(`[quote-explorer] Could not load from ${filePath}`);
        }
      }
      
      if (quoteExplorerData) {
        this.processExplorerData(quoteExplorerData);
        this.initialized = true;
        console.log(`[quote-explorer] Loaded quote explorer data with quotes for ${Object.keys(quoteExplorerData.quotesByTheme).length} themes and ${Object.keys(quoteExplorerData.quotesByCharacter).length} characters`);
      } else {
        console.log('[quote-explorer] No quote explorer data found, falling back to sample data');
        this.loadSampleData();
      }
    } catch (error) {
      console.error('[quote-explorer] Error loading quote data:', error);
      this.loadSampleData();
    }
  }
  
  /**
   * Process explorer data from pre-processed file
   */
  private processExplorerData(data: any): void {
    // Create theme and character maps
    Object.keys(data.quotesByTheme).forEach((themeName, index) => {
      this.themeMap.set(index + 1, themeName);
    });
    
    Object.keys(data.quotesByCharacter).forEach((characterName, index) => {
      this.characterMap.set(index + 1, characterName);
    });
    
    // Convert to format expected by the app
    this.quoteData = data.mostSignificantQuotes.map((quote: any, index: number) => {
      return {
        id: index + 1,
        bookId: 1, // Assuming 1984 is book ID 1
        characterId: quote.character ? this.getCharacterId(quote.character) : null,
        chapterId: quote.chapter,
        text: quote.text,
        significance: quote.significance,
        extractionMethod: 'booknlp'
      };
    });
    
    // Set up quote-theme mappings
    this.quoteData.forEach(quote => {
      const rawQuote = data.mostSignificantQuotes.find((q: any) => q.text === quote.text);
      if (rawQuote && rawQuote.themes) {
        const themeIds = rawQuote.themes.map((themeName: string) => 
          this.getThemeId(themeName)
        ).filter((id: number | null): id is number => id !== null);
        
        if (themeIds.length > 0) {
          this.quoteThemeData.set(quote.id, themeIds);
        }
      }
    });
  }
  
  /**
   * Fall back to sample data if BookNLP data is not available
   */
  private loadSampleData(): void {
    // Create a small set of meaningful quotes from 1984 as sample data
    this.quoteData = [
      {
        id: 1,
        bookId: 1,
        characterId: 1, // Winston
        chapterId: 1,
        page: 1,
        text: "It was a bright cold day in April, and the clocks were striking thirteen.",
        context: null,
        significance: 5,
        extractionMethod: 'manual'
      },
      {
        id: 2,
        bookId: 1,
        characterId: null, // Narrator
        chapterId: 1,
        page: 3,
        text: "BIG BROTHER IS WATCHING YOU, the caption said, while the dark eyes looked deep into Winston's own.",
        context: null,
        significance: 5,
        extractionMethod: 'manual'
      },
      {
        id: 3,
        bookId: 1,
        characterId: 1, // Winston
        chapterId: 2,
        page: 28,
        text: "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
        context: null,
        significance: 5,
        extractionMethod: 'manual'
      },
      {
        id: 4,
        bookId: 1,
        characterId: 3, // O'Brien
        chapterId: 9,
        page: 214,
        text: "How does one man assert his power over another, Winston? By making him suffer. Obedience is not enough. Unless he is suffering, how can you be sure that he is obeying your will and not his own?",
        context: null,
        significance: 5,
        extractionMethod: 'manual'
      },
      {
        id: 5,
        bookId: 1,
        characterId: null, // Narrator
        chapterId: 3,
        page: 45,
        text: "War is peace. Freedom is slavery. Ignorance is strength.",
        context: null,
        significance: 5,
        extractionMethod: 'manual'
      }
    ];
    
    // Set up character map
    this.characterMap.set(1, "Winston Smith");
    this.characterMap.set(2, "Julia");
    this.characterMap.set(3, "O'Brien");
    
    // Set up theme map
    this.themeMap.set(1, "Totalitarianism");
    this.themeMap.set(2, "Control of Information");
    this.themeMap.set(3, "Psychological Manipulation");
    this.themeMap.set(4, "Surveillance");
    
    // Set up quote-theme mappings
    this.quoteThemeData.set(1, [4]); // First quote relates to Surveillance
    this.quoteThemeData.set(2, [1, 4]); // Second quote relates to Totalitarianism and Surveillance
    this.quoteThemeData.set(3, [2, 3]); // Third quote relates to Control of Information and Psychological Manipulation
    this.quoteThemeData.set(4, [1, 3]); // Fourth quote relates to Totalitarianism and Psychological Manipulation
    this.quoteThemeData.set(5, [1, 2]); // Fifth quote relates to Totalitarianism and Control of Information
    
    this.initialized = true;
  }
  
  /**
   * Get theme ID from name
   */
  private getThemeId(themeName: string): number | null {
    const entries = Array.from(this.themeMap.entries());
    for (const [id, name] of entries) {
      if (name === themeName) {
        return id;
      }
    }
    return null;
  }
  
  /**
   * Get character ID from name
   */
  private getCharacterId(characterName: string): number | null {
    const entries = Array.from(this.characterMap.entries());
    for (const [id, name] of entries) {
      if (name === characterName) {
        return id;
      }
    }
    return null;
  }
  
  /**
   * Check if service is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Get all quotes
   */
  public getAllQuotes(): Quote[] {
    return this.quoteData;
  }
  
  /**
   * Get quotes by theme ID
   */
  public getQuotesByThemeId(themeId: number): Quote[] {
    return this.quoteData.filter(quote => {
      const themeIds = this.quoteThemeData.get(quote.id) || [];
      return themeIds.includes(themeId);
    });
  }
  
  /**
   * Get quotes by character ID
   */
  public getQuotesByCharacterId(characterId: number): Quote[] {
    return this.quoteData.filter(quote => quote.characterId === characterId);
  }
  
  /**
   * Get quotes by chapter ID
   */
  public getQuotesByChapterId(chapterId: number): Quote[] {
    return this.quoteData.filter(quote => quote.chapterId === chapterId);
  }
  
  /**
   * Get most significant quotes (significance >= 4)
   */
  public getMostSignificantQuotes(): Quote[] {
    return this.quoteData
      .filter(quote => quote.significance >= 4)
      .sort((a, b) => b.significance - a.significance);
  }
  
  /**
   * Get quote themes
   */
  public getQuoteThemes(quoteId: number): number[] {
    return this.quoteThemeData.get(quoteId) || [];
  }
  
  /**
   * Get theme name
   */
  public getThemeName(themeId: number): string {
    return this.themeMap.get(themeId) || `Theme ${themeId}`;
  }
  
  /**
   * Get character name
   */
  public getCharacterName(characterId: number): string {
    return this.characterMap.get(characterId) || "Unknown Character";
  }
  
  /**
   * Generate complete explorer data
   */
  public getQuoteExplorerData(): QuoteExplorerData {
    const quotesByTheme: Record<string, ThemeQuoteData[]> = {};
    const quotesByCharacter: Record<string, CharacterQuoteData[]> = {};
    const mostSignificantQuotes: SignificantQuoteData[] = [];
    
    // Set up theme buckets
    Array.from(this.themeMap.entries()).forEach(([themeId, themeName]) => {
      quotesByTheme[themeName] = [];
    });
    
    // Set up character buckets
    Array.from(this.characterMap.entries()).forEach(([charId, charName]) => {
      quotesByCharacter[charName] = [];
    });
    quotesByCharacter["Narrator"] = [];
    
    // Fill the buckets
    for (const quote of this.quoteData) {
      const themeIds = this.quoteThemeData.get(quote.id) || [];
      const themeNames = themeIds.map(id => this.getThemeName(id));
      const characterName = quote.characterId 
        ? this.getCharacterName(quote.characterId) 
        : "Narrator";
      
      // Quote data for theme view
      const themeQuoteData: ThemeQuoteData = {
        id: quote.id,
        text: quote.text,
        chapter: quote.chapterId,
        significance: quote.significance
      };
      
      // Add character if available
      if (quote.characterId) {
        themeQuoteData.character = characterName;
      }
      
      // Add to themes
      for (const themeId of themeIds) {
        const themeName = this.getThemeName(themeId);
        if (!quotesByTheme[themeName]) {
          quotesByTheme[themeName] = [];
        }
        quotesByTheme[themeName].push(themeQuoteData);
      }
      
      // Add to characters
      const characterQuoteData: CharacterQuoteData = {
        id: quote.id,
        text: quote.text,
        themes: themeNames,
        chapter: quote.chapterId,
        significance: quote.significance
      };
      
      if (!quotesByCharacter[characterName]) {
        quotesByCharacter[characterName] = [];
      }
      quotesByCharacter[characterName].push(characterQuoteData);
      
      // Add to significant quotes if significance >= 4
      if (quote.significance >= 4) {
        const significantQuote: SignificantQuoteData = {
          id: quote.id,
          text: quote.text,
          themes: themeNames,
          chapter: quote.chapterId,
          significance: quote.significance
        };
        
        if (characterName !== "Narrator") {
          significantQuote.character = characterName;
        }
        
        mostSignificantQuotes.push(significantQuote);
      }
    }
    
    // Sort significant quotes by significance (descending)
    mostSignificantQuotes.sort((a, b) => b.significance - a.significance);
    
    return {
      quotesByTheme,
      quotesByCharacter,
      mostSignificantQuotes: mostSignificantQuotes.slice(0, 20) // Limit to top 20
    };
  }
}

// Create singleton instance
const quoteExplorerService = new QuoteExplorerService();

export default quoteExplorerService;