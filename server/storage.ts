import { User, InsertUser } from './types/auth';
import { 
  Book, 
  Chapter, 
  KeyEvent, 
  Theme, 
  ThemeQuote, 
  ThemeIntensity, 
  Character, 
  Relationship, 
  AiAnalysis,
  GraphData,
  NarrativeData,
  ThemeHeatmapData,
  CharacterPersona,
  LibrarianPersona,
  Conversation,
  Message,
  InsertConversation,
  InsertMessage
} from './types/book';

// Import the new db client
import { db } from "./db";

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
    const rows = await db`SELECT * FROM users WHERE id = ${id}`;
    return rows[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await db`SELECT * FROM users WHERE username = ${username}`;
    return rows[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const rows = await db`
      INSERT INTO users (username, password) 
      VALUES (${insertUser.username}, ${insertUser.password}) 
      RETURNING *
    `;
    if (!rows[0]) throw new Error('Failed to create user');
    return rows[0] as User;
  }
  
  // Book methods
  async getBook(id: number): Promise<Book | undefined> {
    const rows = await db`SELECT * FROM books WHERE id = ${id}`;
    return rows[0] as Book | undefined;
  }
  
  async getAllBooks(): Promise<Book[]> {
    const rows = await db`SELECT * FROM books`;
    return rows as Book[];
  }
  
  // Chapter methods
  async getChaptersByBookId(bookId: number): Promise<Chapter[]> {
    const rows = await db`SELECT * FROM chapters WHERE bookId = ${bookId}`;
    return rows as Chapter[];
  }
  
  // KeyEvent methods
  async getKeyEventsByBookId(bookId: number): Promise<KeyEvent[]> {
    const rows = await db`SELECT * FROM keyEvents WHERE bookId = ${bookId}`;
    return rows as KeyEvent[];
  }
  
  // Theme methods
  async getThemesByBookId(bookId: number): Promise<Theme[]> {
    const rows = await db`SELECT * FROM themes WHERE bookId = ${bookId}`;
    return rows as Theme[];
  }
  
  async getThemeById(id: number): Promise<Theme | undefined> {
    const rows = await db`SELECT * FROM themes WHERE id = ${id}`;
    return rows[0] as Theme | undefined;
  }
  
  // ThemeQuote methods
  async getQuotesByThemeId(themeId: number): Promise<ThemeQuote[]> {
    const rows = await db`SELECT * FROM themeQuotes WHERE themeId = ${themeId}`;
    return rows as ThemeQuote[];
  }
  
  // ThemeIntensity methods
  async getThemeIntensitiesByBookId(bookId: number): Promise<ThemeIntensity[]> {
    const themeIds = await db`SELECT id FROM themes WHERE bookId = ${bookId}`;
    
    if (themeIds.length === 0) return [];
    
    const rows = await db`SELECT * FROM themeIntensities WHERE themeId IN (${themeIds.map(t => t.id).join(',')})`;
    return rows as ThemeIntensity[];
  }
  
  // Character methods
  async getCharactersByBookId(bookId: number): Promise<Character[]> {
    const rows = await db`SELECT * FROM characters WHERE bookId = ${bookId}`;
    return rows as Character[];
  }
  
  async getCharacterById(id: number): Promise<Character | undefined> {
    const rows = await db`SELECT * FROM characters WHERE id = ${id}`;
    return rows[0] as Character | undefined;
  }
  
  // Relationship methods
  async getRelationshipsByBookId(bookId: number): Promise<Relationship[]> {
    const rows = await db`SELECT * FROM relationships WHERE bookId = ${bookId}`;
    return rows as Relationship[];
  }
  
  // AI Analysis methods
  async getAiAnalysisByBookId(bookId: number): Promise<AiAnalysis[]> {
    const rows = await db`SELECT * FROM aiAnalyses WHERE bookId = ${bookId}`;
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
    const rows = await db`SELECT * FROM characterPersonas`;
    return rows as CharacterPersona[];
  }
  
  async getCharacterPersonaById(id: number): Promise<CharacterPersona | undefined> {
    const rows = await db`SELECT * FROM characterPersonas WHERE id = ${id}`;
    return rows[0] as CharacterPersona | undefined;
  }
  
  async getCharacterPersonaByCharacterId(characterId: number): Promise<CharacterPersona | undefined> {
    const rows = await db`SELECT * FROM characterPersonas WHERE characterId = ${characterId}`;
    return rows[0] as CharacterPersona | undefined;
  }
  
  // Librarian Persona methods
  async getLibrarianPersonas(): Promise<LibrarianPersona[]> {
    const rows = await db`SELECT * FROM librarianPersonas`;
    return rows as LibrarianPersona[];
  }
  
  async getLibrarianPersonaById(id: number): Promise<LibrarianPersona | undefined> {
    const rows = await db`SELECT * FROM librarianPersonas WHERE id = ${id}`;
    return rows[0] as LibrarianPersona | undefined;
  }
  
  async getLibrarianPersonaByBookId(bookId: number): Promise<LibrarianPersona | undefined> {
    const rows = await db`SELECT * FROM librarianPersonas WHERE bookId = ${bookId}`;
    return rows[0] as LibrarianPersona | undefined;
  }
  
  // Conversation methods
  async getConversations(): Promise<Conversation[]> {
    const rows = await db`SELECT * FROM conversations`;
    return rows.map(row => ({
      ...row,
      startedAt: new Date(row.startedAt),
      updatedAt: new Date(row.updatedAt)
    })) as Conversation[];
  }
  
  async getConversationById(id: number): Promise<Conversation | undefined> {
    const rows = await db`SELECT * FROM conversations WHERE id = ${id}`;
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
    const rows = await db`
      INSERT INTO conversations (
        title, bookId, userId, characterIds, conversationMode, isLibrarianPresent, startedAt, updatedAt
      ) VALUES (${input.title}, ${input.bookId}, ${input.userId}, ${JSON.stringify(input.characterIds)}, ${input.conversationMode}, ${input.isLibrarianPresent ?? false}, ${now.toISOString()}, ${now.toISOString()})
      RETURNING *
    `;
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
    const rows = await db`SELECT * FROM messages WHERE conversationId = ${conversationId} ORDER BY sentAt`;
    return rows.map(row => ({
      ...row,
      sentAt: new Date(row.sentAt)
    })) as Message[];
  }
  
  async createMessage(input: InsertMessage): Promise<Message> {
    const now = new Date();
    const rows = await db`
      INSERT INTO messages (
        content, conversationId, isUserMessage, sentimentScore, senderId,
        relevantThemeIds, relevantQuoteIds, sentAt
      ) VALUES (${input.content}, ${input.conversationId}, ${input.isUserMessage}, ${input.sentimentScore ?? null}, ${input.senderId ?? null}, ${JSON.stringify(input.relevantThemeIds ?? [])}, ${JSON.stringify(input.relevantQuoteIds ?? [])}, ${now.toISOString()})
      RETURNING *
    `;
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
    const existingBooks = await db`SELECT * FROM books`;
    
    if (existingBooks.length === 0) {
      console.log("Seeding database with initial data...");
      
      // Insert mock data
      await db`
        INSERT INTO books (title, author) 
        VALUES (${bookData.title}, ${bookData.author})
      `;
      
      // Insert chapters
      await db`
        INSERT INTO chapters (bookId, title) 
        VALUES (${bookData.id}, ${chapterData[0].title})
      `;
      
      // Insert key events
      await db`
        INSERT INTO keyEvents (bookId, title, description) 
        VALUES (${bookData.id}, ${keyEventData[0].title}, ${keyEventData[0].description})
      `;
      
      // Insert themes
      await db`
        INSERT INTO themes (bookId, name, description) 
        VALUES (${bookData.id}, ${themeData[0].name}, ${themeData[0].description})
      `;
      
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Initialize database
initializeDatabase().catch(console.error);

// Add mock data for visualization purposes
// These would be replaced with actual data from the database in production
const characterNetworkData: GraphData = { nodes: [], links: [] };
const narrativeData: NarrativeData = { chapters: [] };
const themeHeatmapData: ThemeHeatmapData = { themes: [], chapters: [], intensities: [] };

// Mock data for database initialization
const bookData = { id: 1, title: '1984', author: 'George Orwell' };
const chapterData = [{ id: 1, bookId: 1, title: 'Chapter 1' }];
const keyEventData = [{ id: 1, bookId: 1, title: 'Key Event 1', description: 'Description of key event 1' }];
const themeData = [{ id: 1, bookId: 1, name: 'Theme 1', description: 'Description of theme 1' }];

// Export an instance of DatabaseStorage
export const storage = new DatabaseStorage();
