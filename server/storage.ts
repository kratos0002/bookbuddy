import { 
  users, 
  type User, 
  type InsertUser, 
  type Book,
  type Chapter,
  type KeyEvent,
  type Theme,
  type ThemeQuote,
  type ThemeIntensity,
  type Character,
  type Relationship,
  type AiAnalysis,
  type GraphData,
  type NarrativeData,
  type ThemeHeatmapData,
  // New conversation-related types
  type CharacterPersona,
  type InsertCharacterPersona,
  type LibrarianPersona,
  type InsertLibrarianPersona,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type ChatMode
} from "@shared/schema";

import {
  bookData,
  chapterData,
  keyEventData,
  themeData,
  themeQuoteData,
  themeIntensityData,
  characterData,
  relationshipData,
  aiAnalysisData,
  characterNetworkData,
  narrativeData,
  themeHeatmapData,
  characterPersonaData,
  librarianPersonaData,
  conversationData,
  messageData
} from "./mock-data";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Book methods
  getBook(id: number): Promise<Book | undefined>;
  getAllBooks(): Promise<Book[]>;
  
  // Chapter methods
  getChaptersByBookId(bookId: number): Promise<Chapter[]>;
  
  // KeyEvent methods
  getKeyEventsByBookId(bookId: number): Promise<KeyEvent[]>;
  
  // Theme methods
  getThemesByBookId(bookId: number): Promise<Theme[]>;
  getThemeById(id: number): Promise<Theme | undefined>;
  
  // ThemeQuote methods
  getQuotesByThemeId(themeId: number): Promise<ThemeQuote[]>;
  
  // ThemeIntensity methods
  getThemeIntensitiesByBookId(bookId: number): Promise<ThemeIntensity[]>;
  
  // Character methods
  getCharactersByBookId(bookId: number): Promise<Character[]>;
  getCharacterById(id: number): Promise<Character | undefined>;
  
  // Relationship methods
  getRelationshipsByBookId(bookId: number): Promise<Relationship[]>;
  
  // AI Analysis methods
  getAiAnalysisByBookId(bookId: number): Promise<AiAnalysis[]>;
  getAiAnalysisBySection(bookId: number, section: string): Promise<AiAnalysis | undefined>;
  
  // Visualization data methods
  getCharacterNetworkData(bookId: number): Promise<GraphData>;
  getNarrativeData(bookId: number): Promise<NarrativeData>;
  getThemeHeatmapData(bookId: number): Promise<ThemeHeatmapData>;
  
  // Character Persona methods
  getCharacterPersonas(): Promise<CharacterPersona[]>;
  getCharacterPersonaById(id: number): Promise<CharacterPersona | undefined>;
  getCharacterPersonaByCharacterId(characterId: number): Promise<CharacterPersona | undefined>;
  
  // Librarian Persona methods
  getLibrarianPersonas(): Promise<LibrarianPersona[]>;
  getLibrarianPersonaById(id: number): Promise<LibrarianPersona | undefined>;
  getLibrarianPersonaByBookId(bookId: number): Promise<LibrarianPersona | undefined>;
  
  // Conversation methods
  getConversations(): Promise<Conversation[]>;
  getConversationById(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Message methods
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private chapters: Map<number, Chapter[]>;
  private keyEvents: Map<number, KeyEvent[]>;
  private themes: Map<number, Theme[]>;
  private themeQuotes: Map<number, ThemeQuote[]>;
  private themeIntensities: Map<number, ThemeIntensity[]>;
  private characters: Map<number, Character[]>;
  private relationships: Map<number, Relationship[]>;
  private aiAnalyses: Map<number, AiAnalysis[]>;
  private characterNetworks: Map<number, GraphData>;
  private narrativeDataMap: Map<number, NarrativeData>;
  private themeHeatmaps: Map<number, ThemeHeatmapData>;
  
  // New conversation-related maps
  private characterPersonas: Map<number, CharacterPersona>;
  private librarianPersonas: Map<number, LibrarianPersona>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message[]>;
  
  currentId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.chapters = new Map();
    this.keyEvents = new Map();
    this.themes = new Map();
    this.themeQuotes = new Map();
    this.themeIntensities = new Map();
    this.characters = new Map();
    this.relationships = new Map();
    this.aiAnalyses = new Map();
    this.characterNetworks = new Map();
    this.narrativeDataMap = new Map();
    this.themeHeatmaps = new Map();
    
    // Initialize conversation-related maps
    this.characterPersonas = new Map();
    this.librarianPersonas = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    
    this.currentId = 1;
    
    // Initialize with mock data
    this.initializeWithMockData();
  }
  
  private initializeWithMockData(): void {
    // Add book data
    this.books.set(bookData.id, bookData);
    
    // Add chapter data
    this.chapters.set(bookData.id, chapterData);
    
    // Add key events
    this.keyEvents.set(bookData.id, keyEventData);
    
    // Add themes
    this.themes.set(bookData.id, themeData);
    
    // Add theme quotes
    themeData.forEach(theme => {
      const quotes = themeQuoteData.filter(quote => quote.themeId === theme.id);
      this.themeQuotes.set(theme.id, quotes);
    });
    
    // Add theme intensities
    this.themeIntensities.set(bookData.id, themeIntensityData);
    
    // Add characters
    this.characters.set(bookData.id, characterData);
    
    // Add relationships
    this.relationships.set(bookData.id, relationshipData);
    
    // Add AI analyses
    this.aiAnalyses.set(bookData.id, aiAnalysisData);
    
    // Add character network data
    this.characterNetworks.set(bookData.id, characterNetworkData);
    
    // Add narrative data
    this.narrativeDataMap.set(bookData.id, narrativeData);
    
    // Add theme heatmap data
    this.themeHeatmaps.set(bookData.id, themeHeatmapData);
    
    // Add character personas
    if (characterPersonaData) {
      characterPersonaData.forEach(persona => {
        this.characterPersonas.set(persona.id, persona);
      });
    }
    
    // Add librarian personas
    if (librarianPersonaData) {
      librarianPersonaData.forEach(persona => {
        this.librarianPersonas.set(persona.id, persona);
      });
    }
    
    // Add conversations and messages
    if (conversationData) {
      conversationData.forEach(conversation => {
        this.conversations.set(conversation.id, conversation);
      });
    }
    
    if (messageData) {
      const messagesByConversation = messageData.reduce((acc, message) => {
        if (!acc.has(message.conversationId)) {
          acc.set(message.conversationId, []);
        }
        acc.get(message.conversationId)?.push(message);
        return acc;
      }, new Map<number, Message[]>());
      
      messagesByConversation.forEach((messages, conversationId) => {
        this.messages.set(conversationId, messages);
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Book methods
  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }
  
  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }
  
  // Chapter methods
  async getChaptersByBookId(bookId: number): Promise<Chapter[]> {
    return this.chapters.get(bookId) || [];
  }
  
  // KeyEvent methods
  async getKeyEventsByBookId(bookId: number): Promise<KeyEvent[]> {
    return this.keyEvents.get(bookId) || [];
  }
  
  // Theme methods
  async getThemesByBookId(bookId: number): Promise<Theme[]> {
    return this.themes.get(bookId) || [];
  }
  
  async getThemeById(id: number): Promise<Theme | undefined> {
    for (const themes of this.themes.values()) {
      const theme = themes.find(t => t.id === id);
      if (theme) return theme;
    }
    return undefined;
  }
  
  // ThemeQuote methods
  async getQuotesByThemeId(themeId: number): Promise<ThemeQuote[]> {
    return this.themeQuotes.get(themeId) || [];
  }
  
  // ThemeIntensity methods
  async getThemeIntensitiesByBookId(bookId: number): Promise<ThemeIntensity[]> {
    return this.themeIntensities.get(bookId) || [];
  }
  
  // Character methods
  async getCharactersByBookId(bookId: number): Promise<Character[]> {
    return this.characters.get(bookId) || [];
  }
  
  async getCharacterById(id: number): Promise<Character | undefined> {
    for (const characters of this.characters.values()) {
      const character = characters.find(c => c.id === id);
      if (character) return character;
    }
    return undefined;
  }
  
  // Relationship methods
  async getRelationshipsByBookId(bookId: number): Promise<Relationship[]> {
    return this.relationships.get(bookId) || [];
  }
  
  // AI Analysis methods
  async getAiAnalysisByBookId(bookId: number): Promise<AiAnalysis[]> {
    return this.aiAnalyses.get(bookId) || [];
  }
  
  async getAiAnalysisBySection(bookId: number, section: string): Promise<AiAnalysis | undefined> {
    const analyses = await this.getAiAnalysisByBookId(bookId);
    return analyses.find(a => a.sectionName === section);
  }
  
  // Visualization data methods
  async getCharacterNetworkData(bookId: number): Promise<GraphData> {
    return this.characterNetworks.get(bookId) || { nodes: [], links: [] };
  }
  
  async getNarrativeData(bookId: number): Promise<NarrativeData> {
    return this.narrativeDataMap.get(bookId) || { chapters: [] };
  }
  
  async getThemeHeatmapData(bookId: number): Promise<ThemeHeatmapData> {
    return this.themeHeatmaps.get(bookId) || { themes: [], chapters: [], intensities: [] };
  }
  
  // Character Persona methods
  async getCharacterPersonas(): Promise<CharacterPersona[]> {
    return Array.from(this.characterPersonas.values());
  }
  
  async getCharacterPersonaById(id: number): Promise<CharacterPersona | undefined> {
    return this.characterPersonas.get(id);
  }
  
  async getCharacterPersonaByCharacterId(characterId: number): Promise<CharacterPersona | undefined> {
    return Array.from(this.characterPersonas.values()).find(
      (persona) => persona.characterId === characterId
    );
  }
  
  // Librarian Persona methods
  async getLibrarianPersonas(): Promise<LibrarianPersona[]> {
    return Array.from(this.librarianPersonas.values());
  }
  
  async getLibrarianPersonaById(id: number): Promise<LibrarianPersona | undefined> {
    return this.librarianPersonas.get(id);
  }
  
  async getLibrarianPersonaByBookId(bookId: number): Promise<LibrarianPersona | undefined> {
    return Array.from(this.librarianPersonas.values()).find(
      (persona) => persona.bookId === bookId
    );
  }
  
  // Conversation methods
  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }
  
  async getConversationById(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentId++;
    // Add current timestamp for timestamps
    const now = new Date();
    const conversation: Conversation = { 
      ...insertConversation, 
      id,
      startedAt: now,
      updatedAt: now,
      isLibrarianPresent: insertConversation.isLibrarianPresent ?? false
    };
    this.conversations.set(id, conversation);
    this.messages.set(id, []); // Initialize empty message array for this conversation
    return conversation;
  }
  
  // Message methods
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return this.messages.get(conversationId) || [];
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    // Add current timestamp
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id,
      sentAt: now,
      sentimentScore: insertMessage.sentimentScore ?? null,
      senderId: insertMessage.senderId ?? null,
      relevantThemeIds: insertMessage.relevantThemeIds ?? [],
      relevantQuoteIds: insertMessage.relevantQuoteIds ?? []
    };
    
    // Add message to the conversation's message list
    const conversationMessages = this.messages.get(message.conversationId) || [];
    conversationMessages.push(message);
    this.messages.set(message.conversationId, conversationMessages);
    
    return message;
  }
}

export const storage = new MemStorage();
