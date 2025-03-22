import fs from 'fs';
import path from 'path';

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

/**
 * Service for providing literary context from BookNLP analysis
 */
class BookContextService {
  private characters: CharacterData[] = [];
  private themes: ThemeData[] = [];
  private relationships: RelationshipData[] = [];
  private characterProfiles: CharacterProfileData[] = [];
  private initialized: boolean = false;

  constructor() {
    this.loadData();
  }

  /**
   * Load data from BookNLP JSON files
   */
  private loadData(): void {
    try {
      // First try to load data from the enhanced output directory
      const outputDir = path.join(process.cwd(), 'book_processing', 'output');
      
      if (fs.existsSync(outputDir)) {
        // Load characters
        const charactersPath = path.join(outputDir, 'characters.json');
        if (fs.existsSync(charactersPath)) {
          this.characters = JSON.parse(fs.readFileSync(charactersPath, 'utf-8'));
          console.log(`[book-context] Loaded ${this.characters.length} characters from BookNLP data`);
        }
        
        // Load themes
        const themesPath = path.join(outputDir, 'themes.json');
        if (fs.existsSync(themesPath)) {
          this.themes = JSON.parse(fs.readFileSync(themesPath, 'utf-8'));
          console.log(`[book-context] Loaded ${this.themes.length} themes from BookNLP data`);
        }
        
        // Load relationships
        const relationshipsPath = path.join(outputDir, 'relationships.json');
        if (fs.existsSync(relationshipsPath)) {
          this.relationships = JSON.parse(fs.readFileSync(relationshipsPath, 'utf-8'));
          console.log(`[book-context] Loaded ${this.relationships.length} relationships from BookNLP data`);
        }
        
        // Load character profiles
        const profilesPath = path.join(outputDir, 'character_profiles.json');
        if (fs.existsSync(profilesPath)) {
          this.characterProfiles = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));
          console.log(`[book-context] Loaded ${this.characterProfiles.length} character profiles from BookNLP data`);
        }
        
        this.initialized = true;
        console.log(`[book-context] BookNLP context service initialized with ${this.characters.length} characters and ${this.themes.length} themes`);
      } else {
        console.log('[book-context] Output directory not found, using fallback data');
        this.initializeFallbackData();
      }
    } catch (error) {
      console.error('[book-context] Error loading BookNLP data:', error);
      this.initializeFallbackData();
    }
  }

  /**
   * Initialize with minimal fallback data if files aren't available
   */
  private initializeFallbackData(): void {
    // Minimal character data for Winston, Julia, and O'Brien
    this.characters = [
      {
        id: "1",
        name: "Winston Smith",
        aliases: ["Winston", "Smith", "Comrade Smith"],
        mention_count: 458,
        quote_count: 87,
        gender: "male",
        sample_quotes: [
          "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
          "We shall meet in the place where there is no darkness.",
          "War is peace. Freedom is slavery. Ignorance is strength."
        ]
      },
      {
        id: "2",
        name: "Julia",
        aliases: ["Julia", "the dark-haired girl"],
        mention_count: 211,
        quote_count: 52,
        gender: "female",
        sample_quotes: [
          "I love you.",
          "I'm good at spotting people who don't belong. As soon as I saw you I knew you were against THEM.",
          "I'm only a rebel from the waist downwards."
        ]
      },
      {
        id: "3",
        name: "O'Brien",
        aliases: ["O'Brien", "Comrade O'Brien"],
        mention_count: 169,
        quote_count: 65,
        gender: "male",
        sample_quotes: [
          "The object of persecution is persecution. The object of torture is torture. The object of power is power.",
          "If you want a picture of the future, imagine a boot stamping on a human face—for ever.",
          "Power is not a means; it is an end."
        ]
      }
    ];
    
    // Minimal theme data
    this.themes = [
      {
        name: "Totalitarianism",
        keywords: ["big brother", "party", "government", "control"],
        occurrence_count: 273,
        evidence_sentence_ids: ["124", "567", "890"]
      },
      {
        name: "Surveillance",
        keywords: ["telescreen", "watching", "spying", "observe"],
        occurrence_count: 189,
        evidence_sentence_ids: ["456", "789", "1011"]
      },
      {
        name: "Psychological Manipulation",
        keywords: ["doublethink", "newspeak", "thoughtcrime"],
        occurrence_count: 156,
        evidence_sentence_ids: ["321", "654", "987"]
      }
    ];
    
    // Minimal character profiles
    this.characterProfiles = [
      {
        id: "1",
        name: "Winston Smith",
        aliases: ["Winston", "Smith", "Comrade Smith"],
        mention_count: 458,
        quote_count: 87,
        gender: "male",
        sample_quotes: [
          "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
          "We shall meet in the place where there is no darkness."
        ],
        traits: ["rebellious", "intellectual", "introspective", "paranoid"],
        role: "protagonist",
        description: "Winston Smith is a low-ranking member of the ruling Party in London, in the nation of Oceania. He works at the Ministry of Truth, where he alters historical records to fit Party needs."
      },
      {
        id: "2",
        name: "Julia",
        aliases: ["Julia", "the dark-haired girl"],
        mention_count: 211,
        quote_count: 52,
        gender: "female",
        sample_quotes: [
          "I love you.",
          "I'm only a rebel from the waist downwards."
        ],
        traits: ["rebellious", "pragmatic", "sensual", "resourceful"],
        role: "love interest/ally",
        description: "Julia is a young woman who maintains an outward appearance of Party orthodoxy but secretly rebels by having affairs with Party members."
      },
      {
        id: "3",
        name: "O'Brien",
        aliases: ["O'Brien", "Comrade O'Brien"],
        mention_count: 169,
        quote_count: 65,
        gender: "male",
        sample_quotes: [
          "If you want a picture of the future, imagine a boot stamping on a human face—for ever.",
          "Power is not a means; it is an end."
        ],
        traits: ["intelligent", "calculating", "manipulative", "powerful"],
        role: "antagonist",
        description: "O'Brien is a high-ranking member of the Inner Party who poses as a member of the Brotherhood resistance movement. He initially gains Winston's trust but later reveals himself as an agent of the Thought Police."
      }
    ];
    
    this.initialized = true;
    console.log(`[book-context] Initialized with fallback data: ${this.characters.length} characters and ${this.themes.length} themes`);
  }

  /**
   * Check if the service is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Analyze a user message to extract relevant literary context
   */
  public analyzeMessage(message: string): { 
    mentionedCharacters: CharacterData[],
    mentionedThemes: ThemeData[],
    relevantRelationships: RelationshipData[]
  } {
    const messageLower = message.toLowerCase();
    
    // Find mentioned characters
    const mentionedCharacters = this.characters.filter(character => {
      // Check if character name or any alias is mentioned
      return character.name.toLowerCase().includes(messageLower) || 
             character.aliases.some(alias => messageLower.includes(alias.toLowerCase()));
    });
    
    // Find mentioned themes
    const mentionedThemes = this.themes.filter(theme => {
      // Check if theme name or any keywords are mentioned
      return messageLower.includes(theme.name.toLowerCase()) || 
             theme.keywords.some(keyword => messageLower.includes(keyword.toLowerCase()));
    });
    
    // Find relevant relationships based on mentioned characters
    const mentionedCharacterIds = mentionedCharacters.map(char => char.id);
    const relevantRelationships = this.relationships.filter(rel => {
      return mentionedCharacterIds.includes(rel.source) || mentionedCharacterIds.includes(rel.target);
    });
    
    return {
      mentionedCharacters,
      mentionedThemes,
      relevantRelationships
    };
  }

  /**
   * Enrich a character prompt with BookNLP-extracted data
   */
  public enrichCharacterPrompt(characterId: number, basePrompt: string): string {
    const charIdStr = characterId.toString();
    
    // Find character profile
    const profile = this.characterProfiles.find(p => p.id === charIdStr);
    if (!profile) {
      console.log(`[book-context] No profile found for character ID ${characterId}`);
      return basePrompt;
    }
    
    // Find relationships
    const relationships = this.relationships.filter(
      rel => rel.source === charIdStr || rel.target === charIdStr
    );
    
    // Build context section
    let enrichment = `\n\n--- CHARACTER CONTEXT FROM BOOKNLP ANALYSIS ---\n`;
    enrichment += `Character: ${profile.name}\n`;
    enrichment += `Role: ${profile.role}\n`;
    enrichment += `Traits: ${profile.traits.join(', ')}\n`;
    enrichment += `Description: ${profile.description}\n\n`;
    
    // Add authentic quotes
    if (profile.sample_quotes && profile.sample_quotes.length > 0) {
      enrichment += `Authentic quotes from the character:\n`;
      profile.sample_quotes.slice(0, 3).forEach(quote => {
        enrichment += `- "${quote}"\n`;
      });
      enrichment += '\n';
    }
    
    // Add relationship information
    if (relationships.length > 0) {
      enrichment += `Key relationships:\n`;
      relationships.forEach(rel => {
        if (rel.source === charIdStr) {
          enrichment += `- ${rel.type} ${rel.target_name}\n`;
        } else {
          enrichment += `- Is ${rel.type} by ${rel.source_name}\n`;
        }
      });
    }
    
    enrichment += `\nWhen responding as this character, incorporate these traits, relationships and linguistic patterns authentically.`;
    
    return basePrompt + enrichment;
  }

  /**
   * Enrich a librarian prompt with BookNLP-extracted thematic data
   */
  public enrichLibrarianPrompt(basePrompt: string): string {
    // Build context section with thematic information
    let enrichment = `\n\n--- THEMATIC CONTEXT FROM BOOKNLP ANALYSIS ---\n`;
    enrichment += `Major themes in "1984":\n`;
    
    this.themes.forEach(theme => {
      enrichment += `- ${theme.name}: Associated with ${theme.keywords.join(', ')}\n`;
    });
    
    enrichment += `\nWhen discussing the book, draw upon these themes and their interconnections to provide insightful analysis.`;
    
    return basePrompt + enrichment;
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

  /**
   * Get all character profiles with their extended data
   */
  public getAllCharacterProfiles(): CharacterProfileData[] {
    return this.characterProfiles;
  }

  /**
   * Get a character profile by ID
   */
  public getCharacterProfileById(id: string): CharacterProfileData | undefined {
    return this.characterProfiles.find(profile => profile.id === id);
  }
}

// Create singleton instance
const bookContextService = new BookContextService();

export default bookContextService;