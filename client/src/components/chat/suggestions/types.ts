export type SuggestionCategory = 
  | 'experience' // Character-specific experiences
  | 'relationship' // Relationship inquiries
  | 'worldview' // Character's perspective
  | 'theme' // Thematic exploration
  | 'emotional' // Emotional questions
  | 'analytical'; // Only for librarian

export interface Suggestion {
  id: string;
  text: string;
  category: SuggestionCategory;
  characterId: number | null; // null for librarian
  tags?: string[];
  followUpTo?: string; // Optional ID of suggestion this follows
}

export interface SuggestionContext {
  characterId: number | null; // null for librarian
  messageCount: number;
  recentTopics?: string[];
  preferredCategories?: SuggestionCategory[];
} 