export interface Book {
  id: number;
  title: string;
  author: string;
  coverImageUrl?: string;
  description?: string;
  publishedYear?: number;
  genres?: string[];
}

export interface Chapter {
  id: number;
  bookId: number;
  title: string;
  content?: string;
  chapterNumber?: number;
}

export interface KeyEvent {
  id: number;
  bookId: number;
  title: string;
  description: string;
  chapterId?: number;
  chapter?: string;
  impact?: string;
}

export interface Theme {
  id: number;
  bookId: number;
  name: string;
  description: string;
  color?: string;
}

export interface ThemeQuote {
  id: number;
  themeId: number;
  content: string;
  chapter?: string;
  page?: number;
  context?: string;
}

export interface ThemeIntensity {
  id: number;
  themeId: number;
  chapter: string;
  intensity: number;
}

export interface Character {
  id: number;
  bookId: number;
  name: string;
  description?: string;
  characteristics?: string[];
  imageUrl?: string;
}

export interface Relationship {
  id: number;
  bookId: number;
  character1Id: number;
  character2Id: number;
  type: string;
  description: string;
}

export interface AiAnalysis {
  id: number;
  bookId: number;
  sectionName: string;
  content: string;
}

// Visualization types
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphNode {
  id: string;
  name: string;
  value?: number;
  symbolSize?: number;
  category?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number;
}

export interface NarrativeData {
  chapters: NarrativeChapter[];
}

export interface NarrativeChapter {
  name: string;
  data: NarrativePoint[];
}

export interface NarrativePoint {
  name: string;
  value: [number, number];
}

export interface ThemeHeatmapData {
  themes: string[];
  chapters: string[];
  intensities: number[][];
}

// Character and Librarian Personas
export interface CharacterPersona {
  id: number;
  characterId: number;
  persona: string;
  conversationStyle?: string;
  knowledgeBase?: string;
}

export interface LibrarianPersona {
  id: number;
  bookId: number;
  persona: string;
  conversationStyle: string;
  knowledgeBase: string;
}

// Conversation types
export type ConversationMode = 'character' | 'theme' | 'analysis';

export interface Conversation {
  id: number;
  title: string;
  bookId: number;
  userId: number;
  characterIds: number[];
  conversationMode: ConversationMode;
  isLibrarianPresent: boolean;
  startedAt: Date;
  updatedAt: Date;
}

export interface InsertConversation {
  title: string;
  bookId: number;
  userId: number;
  characterIds: number[];
  conversationMode: ConversationMode;
  isLibrarianPresent?: boolean;
}

export interface Message {
  id: number;
  conversationId: number;
  content: string;
  isUserMessage: boolean;
  sentimentScore: number | null;
  senderId: number | null;
  relevantThemeIds: number[];
  relevantQuoteIds: number[];
  sentAt: Date;
}

export interface InsertMessage {
  conversationId: number;
  content: string;
  isUserMessage: boolean;
  sentimentScore?: number | null;
  senderId?: number | null;
  relevantThemeIds?: number[];
  relevantQuoteIds?: number[];
} 