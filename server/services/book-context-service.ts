import fs from 'fs';
import path from 'path';
import { log } from '../vite';

interface CharacterData {
  id: string;
  name: string;
  aliases: string[];
  mention_count: number;
  quote_count: number;
  gender: string;
  sample_quotes: string[];
  mentions?: any[];
}

interface ThemeData {
  name: string;
  keywords: string[];
  occurrence_count: number;
  evidence_sentence_ids: string[];
}

interface RelationshipData {
  source: string;
  source_name: string;
  target: string;
  target_name: string;
  type: string;
  strength: number;
}

interface CharacterProfileData extends CharacterData {
  traits: string[];
  role: string;
  description: string;
}

class BookContextService {
  private characters: CharacterData[] = [];
  private themes: ThemeData[] = [];
  private relationships: RelationshipData[] = [];
  private characterProfiles: CharacterProfileData[] = [];
  private initialized: boolean = false;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      // Load character data
      const characterPath = path.resolve('./book_processing/output/characters.json');
      if (fs.existsSync(characterPath)) {
        this.characters = JSON.parse(fs.readFileSync(characterPath, 'utf-8'));
      }
      
      // Load theme data
      const themePath = path.resolve('./book_processing/output/themes.json');
      if (fs.existsSync(themePath)) {
        this.themes = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
      }
      
      // Load relationship data
      const relationshipPath = path.resolve('./book_processing/output/relationships.json');
      if (fs.existsSync(relationshipPath)) {
        this.relationships = JSON.parse(fs.readFileSync(relationshipPath, 'utf-8'));
      }
      
      // Load character profiles
      const profilePath = path.resolve('./book_processing/output/character_profiles.json');
      if (fs.existsSync(profilePath)) {
        this.characterProfiles = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      }
      
      this.initialized = this.characters.length > 0 && this.themes.length > 0;
      
      if (this.initialized) {
        log(`BookNLP context service initialized with ${this.characters.length} characters and ${this.themes.length} themes`, 'book-context');
      } else {
        log('Book data files not found. Run the Python book processing scripts first.', 'book-context');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`Error loading book data: ${errorMessage}`, 'book-context');
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Analyze a user message to extract relevant literary context
   */
  public analyzeMessage(message: string): { 
    relevantThemes: ThemeData[], 
    mentionedCharacters: CharacterData[] 
  } {
    const lowerCaseMessage = message.toLowerCase();
    const relevantThemes: ThemeData[] = [];
    const mentionedCharacters: CharacterData[] = [];
    
    // Find themes mentioned in the message
    for (const theme of this.themes) {
      // Check if any of the theme keywords are in the message
      const mentioned = theme.keywords.some(keyword => 
        lowerCaseMessage.includes(keyword.toLowerCase())
      );
      
      if (mentioned) {
        relevantThemes.push(theme);
      }
    }
    
    // Find characters mentioned in the message
    for (const character of this.characters) {
      // Check if the character's name or aliases are in the message
      const mentioned = [character.name, ...character.aliases].some(name => 
        lowerCaseMessage.includes(name.toLowerCase())
      );
      
      if (mentioned) {
        mentionedCharacters.push(character);
      }
    }
    
    return { relevantThemes, mentionedCharacters };
  }

  /**
   * Enrich a character prompt with BookNLP-extracted data
   */
  public enrichCharacterPrompt(characterId: number, basePrompt: string): string {
    if (!this.initialized) {
      return basePrompt;
    }
    
    const charId = characterId.toString();
    
    // Find the character profile
    const profile = this.characterProfiles.find(p => p.id === charId);
    if (!profile) {
      return basePrompt;
    }
    
    // Find relationships for this character
    const relations = this.relationships.filter(
      r => r.source === charId || r.target === charId
    );
    
    // Build enriched prompt
    let enrichedPrompt = basePrompt + '\n\n--- Character Analysis from "1984" Text ---\n';
    
    // Add character profile information
    enrichedPrompt += `\nCharacter Description: ${profile.description}\n`;
    enrichedPrompt += `Role in Story: ${profile.role}\n`;
    enrichedPrompt += `Key Traits: ${profile.traits.join(', ')}\n`;
    
    // Add relationship information
    if (relations.length > 0) {
      enrichedPrompt += '\nKey Relationships:\n';
      relations.forEach(rel => {
        const isSource = rel.source === charId;
        const otherName = isSource ? rel.target_name : rel.source_name;
        const relationDirection = isSource ? 'to' : 'from';
        enrichedPrompt += `- Relationship ${relationDirection} ${otherName}: ${rel.type} (strength: ${rel.strength})\n`;
      });
    }
    
    // Add authentic quotes
    if (profile.sample_quotes.length > 0) {
      enrichedPrompt += '\nAuthentic Quotes from the Text:\n';
      profile.sample_quotes.forEach(quote => {
        enrichedPrompt += `- "${quote}"\n`;
      });
    }
    
    return enrichedPrompt;
  }

  /**
   * Get all characters with their data
   */
  public getAllCharacters(): CharacterData[] {
    return this.characters;
  }

  /**
   * Get all themes with their data
   */
  public getAllThemes(): ThemeData[] {
    return this.themes;
  }
}

// Create and export a singleton instance
const bookContextService = new BookContextService();
export default bookContextService;