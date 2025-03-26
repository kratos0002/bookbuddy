import { 
  users, books, chapters, keyEvents, themes, themeQuotes, themeIntensities,
  characters, relationships, aiAnalyses, characterPersonas, librarianPersonas,
  conversations, messages, quotes, quoteThemes, quoteAnnotations,
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
  type ChatMode,
  // Quote explorer types
  type Quote,
  type InsertQuote,
  type QuoteTheme,
  type InsertQuoteTheme,
  type QuoteAnnotation,
  type InsertQuoteAnnotation,
  type QuoteExplorerData
} from "@shared/schema";

import { sequelize } from "./db";
import { eq, and, inArray } from "drizzle-orm";
import { Sequelize, QueryTypes } from 'sequelize';

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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const rows = await sequelize.query<User>(
      `SELECT * FROM users WHERE id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await sequelize.query<User>(
      `SELECT * FROM users WHERE username = '${username}';`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const rows = await sequelize.query<User>(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`,
      {
        type: QueryTypes.SELECT,
        bind: [insertUser.username, insertUser.password]
      }
    );
    if (!rows[0]) throw new Error('Failed to create user');
    return rows[0] as User;
  }
  
  // Book methods
  async getBook(id: number): Promise<Book | undefined> {
    const rows = await sequelize.query<Book>(
      `SELECT * FROM books WHERE id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as Book | undefined;
  }
  
  async getAllBooks(): Promise<Book[]> {
    const rows = await sequelize.query<Book>(
      `SELECT * FROM books;`,
      { type: QueryTypes.SELECT }
    );
    return rows as Book[];
  }
  
  // Chapter methods
  async getChaptersByBookId(bookId: number): Promise<Chapter[]> {
    const rows = await sequelize.query<Chapter>(
      `SELECT * FROM chapters WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    return rows as Chapter[];
  }
  
  // KeyEvent methods
  async getKeyEventsByBookId(bookId: number): Promise<KeyEvent[]> {
    const rows = await sequelize.query<KeyEvent>(
      `SELECT * FROM keyEvents WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    return rows as KeyEvent[];
  }
  
  // Theme methods
  async getThemesByBookId(bookId: number): Promise<Theme[]> {
    const rows = await sequelize.query<Theme>(
      `SELECT * FROM themes WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    return rows as Theme[];
  }
  
  async getThemeById(id: number): Promise<Theme | undefined> {
    const rows = await sequelize.query<Theme>(
      `SELECT * FROM themes WHERE id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as Theme | undefined;
  }
  
  // ThemeQuote methods
  async getQuotesByThemeId(themeId: number): Promise<ThemeQuote[]> {
    const rows = await sequelize.query<ThemeQuote>(
      `SELECT * FROM themeQuotes WHERE themeId = ${themeId};`,
      { type: QueryTypes.SELECT }
    );
    return rows as ThemeQuote[];
  }
  
  // ThemeIntensity methods
  async getThemeIntensitiesByBookId(bookId: number): Promise<ThemeIntensity[]> {
    const themeIds = await sequelize.query<{ id: number }>(
      `SELECT id FROM themes WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    
    if (themeIds.length === 0) return [];
    
    const rows = await sequelize.query<ThemeIntensity>(
      `SELECT * FROM themeIntensities WHERE themeId IN (${themeIds.map(t => t.id).join(',')});`,
      { type: QueryTypes.SELECT }
    );
    return rows as ThemeIntensity[];
  }
  
  // Character methods
  async getCharactersByBookId(bookId: number): Promise<Character[]> {
    const rows = await sequelize.query<Character>(
      `SELECT * FROM characters WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    return rows as Character[];
  }
  
  async getCharacterById(id: number): Promise<Character | undefined> {
    const rows = await sequelize.query<Character>(
      `SELECT * FROM characters WHERE id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as Character | undefined;
  }
  
  // Relationship methods
  async getRelationshipsByBookId(bookId: number): Promise<Relationship[]> {
    const rows = await sequelize.query<Relationship>(
      `SELECT * FROM relationships WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    return rows as Relationship[];
  }
  
  // AI Analysis methods
  async getAiAnalysisByBookId(bookId: number): Promise<AiAnalysis[]> {
    const rows = await sequelize.query<AiAnalysis>(
      `SELECT * FROM aiAnalyses WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    return rows as AiAnalysis[];
  }
  
  async getAiAnalysisBySection(bookId: number, section: string): Promise<AiAnalysis | undefined> {
    const analyses = await this.getAiAnalysisByBookId(bookId);
    return analyses.find(a => a.sectionName === section);
  }
  
  // Visualization data methods
  async getCharacterNetworkData(bookId: number): Promise<GraphData> {
    // This requires complex transformation and might depend on book data
    // For now, using mock data as placeholder
    const mockData = characterNetworkData;
    return mockData;
  }
  
  async getNarrativeData(bookId: number): Promise<NarrativeData> {
    // This requires complex transformation and might depend on chapter/event data
    // For now, using mock data as placeholder
    const mockData = narrativeData;
    return mockData;
  }
  
  async getThemeHeatmapData(bookId: number): Promise<ThemeHeatmapData> {
    // This requires complex transformation and might depend on themes/intensity data
    // For now, using mock data as placeholder
    const mockData = themeHeatmapData;
    return mockData;
  }
  
  // Character Persona methods
  async getCharacterPersonas(): Promise<CharacterPersona[]> {
    const rows = await sequelize.query<CharacterPersona>(
      `SELECT * FROM characterPersonas;`,
      { type: QueryTypes.SELECT }
    );
    return rows as CharacterPersona[];
  }
  
  async getCharacterPersonaById(id: number): Promise<CharacterPersona | undefined> {
    const rows = await sequelize.query<CharacterPersona>(
      `SELECT * FROM characterPersonas WHERE id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as CharacterPersona | undefined;
  }
  
  async getCharacterPersonaByCharacterId(characterId: number): Promise<CharacterPersona | undefined> {
    const rows = await sequelize.query<CharacterPersona>(
      `SELECT * FROM characterPersonas WHERE characterId = ${characterId};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as CharacterPersona | undefined;
  }
  
  // Librarian Persona methods
  async getLibrarianPersonas(): Promise<LibrarianPersona[]> {
    const rows = await sequelize.query<LibrarianPersona>(
      `SELECT * FROM librarianPersonas;`,
      { type: QueryTypes.SELECT }
    );
    return rows as LibrarianPersona[];
  }
  
  async getLibrarianPersonaById(id: number): Promise<LibrarianPersona | undefined> {
    const rows = await sequelize.query<LibrarianPersona>(
      `SELECT * FROM librarianPersonas WHERE id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as LibrarianPersona | undefined;
  }
  
  async getLibrarianPersonaByBookId(bookId: number): Promise<LibrarianPersona | undefined> {
    const rows = await sequelize.query<LibrarianPersona>(
      `SELECT * FROM librarianPersonas WHERE bookId = ${bookId};`,
      { type: QueryTypes.SELECT }
    );
    return rows[0] as LibrarianPersona | undefined;
  }
  
  // Conversation methods
  async getConversations(): Promise<Conversation[]> {
    const rows = await sequelize.query<Conversation>(
      `SELECT * FROM conversations;`,
      { type: QueryTypes.SELECT }
    );
    return rows.map(row => ({
      ...row,
      startedAt: new Date(row.startedAt),
      updatedAt: new Date(row.updatedAt)
    })) as Conversation[];
  }
  
  async getConversationById(id: number): Promise<Conversation | undefined> {
    const rows = await sequelize.query<Conversation>(
      `SELECT * FROM conversations WHERE id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    const row = rows[0];
    if (!row) return undefined;
    return {
      ...row,
      startedAt: new Date(row.startedAt),
      updatedAt: new Date(row.updatedAt)
    } as Conversation;
  }
  
  async createConversation(input: InsertConversation): Promise<Conversation> {
    const now = new Date();
    const rows = await sequelize.query<Conversation>(
      `INSERT INTO conversations (
        title, bookId, userId, characterIds, conversationMode, isLibrarianPresent, startedAt, updatedAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      {
        type: QueryTypes.SELECT,
        bind: [
          input.title,
          input.bookId,
          input.userId,
          JSON.stringify(input.characterIds),
          input.conversationMode,
          input.isLibrarianPresent ?? false,
          now.toISOString(),
          now.toISOString()
        ]
      }
    );
    const row = rows[0];
    if (!row) throw new Error('Failed to create conversation');
    return {
      ...row,
      startedAt: new Date(row.startedAt),
      updatedAt: new Date(row.updatedAt)
    } as Conversation;
  }
  
  // Message methods
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    const rows = await sequelize.query<Message>(
      `SELECT * FROM messages WHERE conversationId = ${conversationId} ORDER BY sentAt;`,
      { type: QueryTypes.SELECT }
    );
    return rows.map(row => ({
      ...row,
      sentAt: new Date(row.sentAt)
    })) as Message[];
  }
  
  async createMessage(input: InsertMessage): Promise<Message> {
    const now = new Date();
    const rows = await sequelize.query<Message>(
      `INSERT INTO messages (
        content, conversationId, isUserMessage, sentimentScore, senderId,
        relevantThemeIds, relevantQuoteIds, sentAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      {
        type: QueryTypes.SELECT,
        bind: [
          input.content,
          input.conversationId,
          input.isUserMessage,
          input.sentimentScore ?? null,
          input.senderId ?? null,
          JSON.stringify(input.relevantThemeIds ?? []),
          JSON.stringify(input.relevantQuoteIds ?? []),
          now.toISOString()
        ]
      }
    );
    const row = rows[0];
    if (!row) throw new Error('Failed to create message');
    return {
      ...row,
      sentAt: new Date(row.sentAt)
    } as Message;
  }
}

// Initialize the database and seed with mock data if needed
async function initializeDatabase() {
  try {
    // Check if we have any books in the database
    const existingBooks = await sequelize.query<Book>(
      `SELECT * FROM books;`,
      { type: QueryTypes.SELECT }
    );
    
    if (existingBooks.length === 0) {
      console.log("Seeding database with initial data...");
      
      // Insert mock data
      await sequelize.query(
        `INSERT INTO books (title, author) VALUES ($1, $2);`,
        {
          type: QueryTypes.INSERT,
          bind: [bookData.title, bookData.author]
        }
      );
      
      // Insert chapters
      await sequelize.query(
        `INSERT INTO chapters (bookId, title) VALUES ($1, $2);`,
        {
          type: QueryTypes.INSERT,
          bind: [bookData.id, chapterData[0].title]
        }
      );
      
      // Insert key events
      await sequelize.query(
        `INSERT INTO keyEvents (bookId, title, description) VALUES ($1, $2, $3);`,
        {
          type: QueryTypes.INSERT,
          bind: [bookData.id, keyEventData[0].title, keyEventData[0].description]
        }
      );
      
      // Insert themes
      await sequelize.query(
        `INSERT INTO themes (bookId, name, description) VALUES ($1, $2, $3);`,
        {
          type: QueryTypes.INSERT,
          bind: [bookData.id, themeData[0].name, themeData[0].description]
        }
      );
      
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Initialize database
initializeDatabase().catch(console.error);

// Export an instance of DatabaseStorage
export const storage = new DatabaseStorage();
