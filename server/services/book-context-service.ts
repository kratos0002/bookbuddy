import fs from 'fs';
import path from 'path';
import { log } from '../vite';
import { 
  Character, 
  Theme, 
  ThemeQuote, 
  Relationship,
  CharacterPersona
} from '@shared/schema';

// Path to the processed book data
const BOOK_DATA_PATH = path.join(process.cwd(), 'book_processing/output');

// Interfaces for processed data
interface ProcessedCharacter {
  id: string;
  name: string;
  aliases: string[];
  quote_count: number;
  mention_count: number;
  sample_quotes: string[];
  gender: string;
}

interface ProcessedTheme {
  name: string;
  keywords: string[];
  occurrence_count: number;
  evidence_sentence_ids: string[];
}

interface ProcessedRelationship {
  source: string;
  source_name: string;
  target: string;
  target_name: string;
  type: string;
  strength: number;
}

/**
 * Service to load and provide access to processed book data
 */
class BookContextService {
  private characters: ProcessedCharacter[] = [];
  private themes: ProcessedTheme[] = [];
  private relationships: ProcessedRelationship[] = [];
  private isInitialized: boolean = false;

  /**
   * Load all processed book data
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if the data files exist
      const charactersPath = path.join(BOOK_DATA_PATH, 'character_profiles.json');
      const themesPath = path.join(BOOK_DATA_PATH, 'themes.json');
      const relationshipsPath = path.join(BOOK_DATA_PATH, 'relationships.json');

      if (!fs.existsSync(charactersPath) || !fs.existsSync(themesPath) || !fs.existsSync(relationshipsPath)) {
        log('Book data files not found. Run the Python book processing scripts first.', 'book-context');
        return false;
      }

      // Load the data
      this.characters = JSON.parse(fs.readFileSync(charactersPath, 'utf-8'));
      this.themes = JSON.parse(fs.readFileSync(themesPath, 'utf-8'));
      this.relationships = JSON.parse(fs.readFileSync(relationshipsPath, 'utf-8'));

      this.isInitialized = true;
      log(`Successfully loaded book context data: ${this.characters.length} characters, ${this.themes.length} themes, ${this.relationships.length} relationships`, 'book-context');
      return true;
    } catch (error) {
      log(`Error loading book context data: ${error.message}`, 'book-context');
      return false;
    }
  }

  /**
   * Get all character data
   */
  getCharacters(): ProcessedCharacter[] {
    return this.characters;
  }

  /**
   * Get all theme data
   */
  getThemes(): ProcessedTheme[] {
    return this.themes;
  }

  /**
   * Get all relationship data
   */
  getRelationships(): ProcessedRelationship[] {
    return this.relationships;
  }

  /**
   * Find character by name
   */
  findCharacterByName(name: string): ProcessedCharacter | undefined {
    const lowercaseName = name.toLowerCase();
    return this.characters.find(char => 
      char.name.toLowerCase() === lowercaseName || 
      char.aliases.some(alias => alias.toLowerCase() === lowercaseName)
    );
  }

  /**
   * Find theme by name
   */
  findThemeByName(name: string): ProcessedTheme | undefined {
    const lowercaseName = name.toLowerCase();
    return this.themes.find(theme => theme.name.toLowerCase() === lowercaseName);
  }

  /**
   * Get quotes for a character
   */
  getCharacterQuotes(characterId: string): string[] {
    const character = this.characters.find(char => char.id === characterId);
    return character?.sample_quotes || [];
  }

  /**
   * Find themes relevant to the given text
   */
  findRelevantThemes(text: string): ProcessedTheme[] {
    const lowercaseText = text.toLowerCase();
    return this.themes.filter(theme => 
      theme.keywords.some(keyword => lowercaseText.includes(keyword))
    );
  }

  /**
   * Find characters mentioned in the given text
   */
  findMentionedCharacters(text: string): ProcessedCharacter[] {
    const lowercaseText = text.toLowerCase();
    return this.characters.filter(character => 
      character.name.toLowerCase().includes(lowercaseText) || 
      character.aliases.some(alias => lowercaseText.includes(alias.toLowerCase()))
    );
  }

  /**
   * Enrich OpenAI prompt with character context
   */
  enrichCharacterPrompt(characterId: number, basePrompt: string): string {
    // Find the character in our processed data
    const characterIdStr = characterId.toString();
    const character = this.characters.find(char => char.id === characterIdStr);
    
    if (!character) {
      return basePrompt;
    }
    
    // Get relationships for this character
    const relationships = this.relationships.filter(rel => 
      rel.source === characterIdStr || rel.target === characterIdStr
    );
    
    // Append context to the prompt
    let enrichedPrompt = basePrompt + '\n\n';
    enrichedPrompt += '--- Character Context ---\n';
    enrichedPrompt += `Name: ${character.name}\n`;
    enrichedPrompt += `Aliases: ${character.aliases.join(', ')}\n`;
    enrichedPrompt += `Gender: ${character.gender}\n`;
    enrichedPrompt += `Importance: Character is mentioned ${character.mention_count} times and has ${character.quote_count} quotes.\n`;
    
    if (relationships.length > 0) {
      enrichedPrompt += '\nRelationships:\n';
      relationships.forEach(rel => {
        const otherName = rel.source === characterIdStr ? rel.target_name : rel.source_name;
        enrichedPrompt += `- ${character.name} ${rel.type} ${otherName} (strength: ${rel.strength})\n`;
      });
    }
    
    if (character.sample_quotes.length > 0) {
      enrichedPrompt += '\nSample quotes:\n';
      character.sample_quotes.slice(0, 5).forEach(quote => {
        enrichedPrompt += `- "${quote}"\n`;
      });
    }
    
    return enrichedPrompt;
  }

  /**
   * Get character and theme details for a message
   */
  analyzeMessage(message: string): { 
    relevantThemes: ProcessedTheme[],
    mentionedCharacters: ProcessedCharacter[]
  } {
    return {
      relevantThemes: this.findRelevantThemes(message),
      mentionedCharacters: this.findMentionedCharacters(message)
    };
  }
}

// Singleton instance
const bookContextService = new BookContextService();

export default bookContextService;