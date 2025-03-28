export interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  description?: string;
  publishedYear?: number;
  genres?: string[];
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  content?: string;
  order?: number;
}

export interface KeyEvent {
  id: string;
  bookId: string;
  title: string;
  description: string;
  chapterIndex?: number;
  timestamp?: string;
}

export interface Theme {
  id: string;
  bookId: string;
  name: string;
  description: string;
  color?: string;
}

export interface ThemeQuote {
  id: string;
  themeId: string;
  quote: string;
  context: string;
  chapterIndex?: number;
}

export interface ThemeIntensity {
  id: string;
  themeId: string;
  chapterIndex: number;
  intensity: number;
}

export interface Character {
  id: string;
  bookId: string;
  name: string;
  description?: string;
  characteristics?: string[];
  imageUrl?: string;
}

export interface Relationship {
  id: string;
  bookId: string;
  character1Id: string;
  character2Id: string;
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