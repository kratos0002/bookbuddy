import { pgTable, text, serial, integer, boolean, jsonb, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep original user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Book schema
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverUrl: text("cover_url").notNull(),
  publicationYear: integer("publication_year").notNull(),
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  coverUrl: true,
  publicationYear: true,
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

// Chapter schema
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  sentimentScore: real("sentiment_score").notNull(),
  tensionScore: real("tension_score").notNull(),
});

export const insertChapterSchema = createInsertSchema(chapters).pick({
  bookId: true,
  number: true,
  title: true,
  sentimentScore: true,
  tensionScore: true,
});

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;

// Key event schema
export const keyEvents = pgTable("key_events", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  chapterId: integer("chapter_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(),
  tensionLevel: text("tension_level").notNull(),
  sentimentType: text("sentiment_type").notNull(),
});

export const insertKeyEventSchema = createInsertSchema(keyEvents).pick({
  bookId: true,
  chapterId: true,
  title: true,
  description: true,
  eventType: true,
  tensionLevel: true,
  sentimentType: true,
});

export type InsertKeyEvent = z.infer<typeof insertKeyEventSchema>;
export type KeyEvent = typeof keyEvents.$inferSelect;

// Theme schema
export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  prominenceScore: integer("prominence_score").notNull(),
  themeType: text("theme_type").notNull(),
});

export const insertThemeSchema = createInsertSchema(themes).pick({
  bookId: true,
  name: true,
  description: true,
  prominenceScore: true,
  themeType: true,
});

export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type Theme = typeof themes.$inferSelect;

// Theme quote schema
export const themeQuotes = pgTable("theme_quotes", {
  id: serial("id").primaryKey(),
  themeId: integer("theme_id").notNull(),
  quote: text("quote").notNull(),
  chapter: text("chapter").notNull(),
});

export const insertThemeQuoteSchema = createInsertSchema(themeQuotes).pick({
  themeId: true,
  quote: true,
  chapter: true,
});

export type InsertThemeQuote = z.infer<typeof insertThemeQuoteSchema>;
export type ThemeQuote = typeof themeQuotes.$inferSelect;

// Theme intensity schema
export const themeIntensities = pgTable("theme_intensities", {
  id: serial("id").primaryKey(),
  themeId: integer("theme_id").notNull(),
  chapterId: integer("chapter_id").notNull(),
  intensity: real("intensity").notNull(),
});

export const insertThemeIntensitySchema = createInsertSchema(themeIntensities).pick({
  themeId: true,
  chapterId: true,
  intensity: true,
});

export type InsertThemeIntensity = z.infer<typeof insertThemeIntensitySchema>;
export type ThemeIntensity = typeof themeIntensities.$inferSelect;

// Character schema
export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  affiliation: text("affiliation").notNull(),
  characterArc: text("character_arc").notNull(),
  psychologicalProfile: text("psychological_profile").notNull(),
  connectionCount: integer("connection_count").notNull(),
});

export const insertCharacterSchema = createInsertSchema(characters).pick({
  bookId: true,
  name: true,
  role: true,
  affiliation: true,
  characterArc: true,
  psychologicalProfile: true,
  connectionCount: true,
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

// Character relationship schema
export const relationships = pgTable("relationships", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  character1Id: integer("character1_id").notNull(),
  character2Id: integer("character2_id").notNull(),
  relationType: text("relation_type").notNull(),
  interactionFrequency: real("interaction_frequency").notNull(),
  powerDynamic: text("power_dynamic").notNull(),
  narrativeImpact: text("narrative_impact").notNull(),
});

export const insertRelationshipSchema = createInsertSchema(relationships).pick({
  bookId: true,
  character1Id: true,
  character2Id: true,
  relationType: true,
  interactionFrequency: true,
  powerDynamic: true,
  narrativeImpact: true,
});

export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
export type Relationship = typeof relationships.$inferSelect;

// AI Analysis schema
export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  sectionName: text("section_name").notNull(), // e.g., "Plot Summary", "Character Analysis"
  content: text("content").notNull(),
  keyPoints: jsonb("key_points").notNull(),  // Array of key points
});

export const insertAiAnalysisSchema = createInsertSchema(aiAnalyses).pick({
  bookId: true,
  sectionName: true,
  content: true,
  keyPoints: true,
});

export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;
export type AiAnalysis = typeof aiAnalyses.$inferSelect;

// Define GraphData interface for the network visualization
export interface GraphData {
  nodes: Array<{
    id: string;
    name: string;
    affiliation: string;
    size: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
    type: string;
  }>;
}

// Define Narrative data interface
export interface NarrativeData {
  chapters: Array<{
    chapter: number;
    title: string;
    sentiment: number;
    tension: number;
    keyEvents: Array<{
      type: string;
      description: string;
    }>;
  }>;
}

// Define ThemeHeatmap data interface
export interface ThemeHeatmapData {
  themes: string[];
  chapters: number[];
  intensities: Array<Array<number>>;
}

// Character Persona schema - for conversations
export const characterPersonas = pgTable("character_personas", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(), // References the Character model
  voiceDescription: text("voice_description").notNull(), // How the character speaks
  backgroundKnowledge: text("background_knowledge").notNull(), // What the character knows
  personalityTraits: text("personality_traits").notNull(), // Key personality traits
  biases: text("biases").notNull(), // Character's biases and viewpoints
  promptInstructions: text("prompt_instructions").notNull(), // Instructions for AI prompt
  avatarUrl: text("avatar_url"), // Optional avatar image
});

export const insertCharacterPersonaSchema = createInsertSchema(characterPersonas).pick({
  characterId: true,
  voiceDescription: true,
  backgroundKnowledge: true,
  personalityTraits: true,
  biases: true,
  promptInstructions: true,
  avatarUrl: true,
});

export type InsertCharacterPersona = z.infer<typeof insertCharacterPersonaSchema>;
export type CharacterPersona = typeof characterPersonas.$inferSelect;

// Librarian Persona schema - special role as guide
export const librarianPersonas = pgTable("librarian_personas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bookId: integer("book_id").notNull(),
  personalityDescription: text("personality_description").notNull(),
  knowledgeBase: text("knowledge_base").notNull(), // What the librarian knows about the book
  promptInstructions: text("prompt_instructions").notNull(), // Instructions for AI prompt
  avatarUrl: text("avatar_url"), // Optional avatar image
});

export const insertLibrarianPersonaSchema = createInsertSchema(librarianPersonas).pick({
  name: true,
  bookId: true,
  personalityDescription: true,
  knowledgeBase: true,
  promptInstructions: true,
  avatarUrl: true,
});

export type InsertLibrarianPersona = z.infer<typeof insertLibrarianPersonaSchema>;
export type LibrarianPersona = typeof librarianPersonas.$inferSelect;

// Conversation schema
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // User having the conversation
  bookId: integer("book_id").notNull(), // Book being discussed
  title: text("title").notNull(), // Title/summary of the conversation
  startedAt: timestamp("started_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  characterIds: jsonb("character_ids").notNull(), // Array of character IDs involved
  isLibrarianPresent: boolean("is_librarian_present").notNull().default(false), // Whether librarian is involved
  conversationMode: text("conversation_mode").notNull(), // 'character', 'analysis', 'thematic', etc.
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  bookId: true,
  title: true,
  characterIds: true,
  isLibrarianPresent: true,
  conversationMode: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id"), // Character ID or null for user
  isUserMessage: boolean("is_user_message").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  sentimentScore: real("sentiment_score"), // Optional sentiment analysis
  relevantThemeIds: jsonb("relevant_theme_ids"), // Array of theme IDs relevant to this message
  relevantQuoteIds: jsonb("relevant_quote_ids"), // Array of quote IDs referenced
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  senderId: true,
  isUserMessage: true,
  content: true,
  sentimentScore: true,
  relevantThemeIds: true,
  relevantQuoteIds: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Define ChatModes enum for conversation types
export const ChatModes = {
  CHARACTER: 'character',
  ANALYSIS: 'analysis',
  THEMATIC: 'thematic',
  COMPARISON: 'comparison',
  HISTORICAL: 'historical',
  COMPREHENSIVE: 'comprehensive'
} as const;

export type ChatMode = typeof ChatModes[keyof typeof ChatModes];
