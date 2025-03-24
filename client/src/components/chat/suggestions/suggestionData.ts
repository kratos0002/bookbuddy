import { Suggestion, SuggestionCategory } from './types';

// Utility function to create a suggestion with unique ID
const createSuggestion = (
  text: string,
  category: SuggestionCategory,
  characterId: number | null,
  tags: string[] = [],
  followUpTo?: string
): Suggestion => ({
  id: `${characterId || 'librarian'}-${category}-${Math.random().toString(36).substring(2, 9)}`,
  text,
  category,
  characterId,
  tags,
  followUpTo
});

// Winston Smith suggestions (id: 1)
export const winstonSuggestions: Suggestion[] = [
  // Character-specific experiences
  createSuggestion("What first made you start questioning the Party?", "experience", 1, ["rebellion", "party"]),
  createSuggestion("How do you manage your work at the Ministry of Truth?", "experience", 1, ["work", "ministry"]),
  createSuggestion("Tell me about your memories before the Revolution", "experience", 1, ["memory", "past"]),
  createSuggestion("What do you write in your diary?", "experience", 1, ["diary", "personal"]),
  createSuggestion("What was your childhood like?", "experience", 1, ["childhood", "memory"]),
  
  // Relationship inquiries
  createSuggestion("What do you think of Julia?", "relationship", 1, ["julia", "romance"]),
  createSuggestion("Do you trust O'Brien?", "relationship", 1, ["obrien", "trust"]),
  createSuggestion("How do you feel about your neighbors?", "relationship", 1, ["neighbors", "surveillance"]),
  createSuggestion("Tell me about your mother and sister", "relationship", 1, ["family", "memory"]),
  createSuggestion("What do you think of Mr. Charrington?", "relationship", 1, ["charrington", "antique"]),

  // Worldview prompts
  createSuggestion("What does freedom mean to you?", "worldview", 1, ["freedom", "philosophy"]),
  createSuggestion("Do you believe the Brotherhood is real?", "worldview", 1, ["brotherhood", "resistance"]),
  createSuggestion("What do you think about Big Brother?", "worldview", 1, ["big brother", "authority"]),
  createSuggestion("How do you feel about the constant surveillance?", "worldview", 1, ["surveillance", "privacy"]),
  createSuggestion("What do you think is outside of Oceania?", "worldview", 1, ["geography", "world"]),

  // Thematic exploration
  createSuggestion("Why is the past so important to you?", "theme", 1, ["history", "truth"]),
  createSuggestion("What do you think about the concept of doublethink?", "theme", 1, ["doublethink", "mind"]),
  createSuggestion("How do you feel about the Party's control of language?", "theme", 1, ["newspeak", "language"]),
  createSuggestion("Is there hope for the future?", "theme", 1, ["hope", "future"]),
  createSuggestion("What does 'the place where there is no darkness' mean to you?", "theme", 1, ["symbolism", "dream"]),

  // Emotional questions
  createSuggestion("What gives you hope in this world?", "emotional", 1, ["hope", "emotion"]),
  createSuggestion("What are you most afraid of?", "emotional", 1, ["fear", "emotion"]),
  createSuggestion("Do you feel guilty about your rebellious thoughts?", "emotional", 1, ["guilt", "rebellion"]),
  createSuggestion("What makes you feel alive?", "emotional", 1, ["happiness", "living"]),
  createSuggestion("What do you dream about?", "emotional", 1, ["dreams", "subconscious"])
];

// Julia suggestions (id: 2)
export const juliaSuggestions: Suggestion[] = [
  // Character-specific experiences
  createSuggestion("How do you find ways to rebel against the Party?", "experience", 2, ["rebellion", "party"]),
  createSuggestion("How did you get involved with the Anti-Sex League?", "experience", 2, ["party", "deception"]),
  createSuggestion("How do you obtain forbidden items like real coffee and sugar?", "experience", 2, ["black market", "forbidden"]),
  createSuggestion("Tell me about your work at the Fiction Department", "experience", 2, ["work", "ministry"]),
  createSuggestion("How do you avoid being caught by the Thought Police?", "experience", 2, ["thought police", "caution"]),
  
  // Relationship inquiries
  createSuggestion("What attracted you to Winston?", "relationship", 2, ["winston", "romance"]),
  createSuggestion("Have you had relationships with other Party members?", "relationship", 2, ["romance", "rebellion"]),
  createSuggestion("What do you think of O'Brien?", "relationship", 2, ["obrien", "trust"]),
  createSuggestion("Do you have any real friends in the Party?", "relationship", 2, ["friendship", "party"]),
  createSuggestion("What do you think of the proles?", "relationship", 2, ["proles", "class"]),

  // Worldview prompts
  createSuggestion("How do you view the Brotherhood?", "worldview", 2, ["brotherhood", "resistance"]),
  createSuggestion("Do you believe there's a future beyond Party control?", "worldview", 2, ["future", "freedom"]),
  createSuggestion("What do you think about Big Brother?", "worldview", 2, ["big brother", "authority"]),
  createSuggestion("Do you care about the past like Winston does?", "worldview", 2, ["history", "priorities"]),
  createSuggestion("What do you think about the war with Eastasia or Eurasia?", "worldview", 2, ["war", "propaganda"]),

  // Thematic exploration
  createSuggestion("What do you think of the Party's view on sexuality?", "theme", 2, ["sexuality", "control"]),
  createSuggestion("How important is physical pleasure to rebelling?", "theme", 2, ["pleasure", "rebellion"]),
  createSuggestion("What do freedom and privacy mean to you?", "theme", 2, ["freedom", "privacy"]),
  createSuggestion("Do you believe in personal loyalty over loyalty to the Party?", "theme", 2, ["loyalty", "personal"]),
  createSuggestion("What pleasures do you enjoy that the Party forbids?", "theme", 2, ["pleasure", "forbidden"]),

  // Emotional questions
  createSuggestion("Are you ever truly afraid of being caught?", "emotional", 2, ["fear", "courage"]),
  createSuggestion("What makes you happy in this world?", "emotional", 2, ["happiness", "pleasure"]),
  createSuggestion("Do you ever feel guilty about your deceptions?", "emotional", 2, ["guilt", "deception"]),
  createSuggestion("How do you really feel about Winston?", "emotional", 2, ["love", "winston"]),
  createSuggestion("What would your ideal life look like?", "emotional", 2, ["dreams", "aspirations"])
];

// O'Brien suggestions (id: 3)
export const obrienSuggestions: Suggestion[] = [
  // Character-specific experiences
  createSuggestion("What is your role in the Inner Party?", "experience", 3, ["inner party", "role"]),
  createSuggestion("How long have you been working for the Thought Police?", "experience", 3, ["thought police", "career"]),
  createSuggestion("Tell me about your interactions with other Party members", "experience", 3, ["social", "party"]),
  createSuggestion("What is your daily routine like?", "experience", 3, ["routine", "privilege"]),
  createSuggestion("Have you always been loyal to the Party?", "experience", 3, ["loyalty", "history"]),
  
  // Relationship inquiries
  createSuggestion("What did you really think of Winston?", "relationship", 3, ["winston", "assessment"]),
  createSuggestion("How do you view Julia's rebellion?", "relationship", 3, ["julia", "rebellion"]),
  createSuggestion("What is your relationship with Big Brother?", "relationship", 3, ["big brother", "hierarchy"]),
  createSuggestion("How do you select which Party members to observe?", "relationship", 3, ["thought police", "surveillance"]),
  createSuggestion("What do you think of Emmanuel Goldstein?", "relationship", 3, ["goldstein", "enemy"]),

  // Worldview prompts
  createSuggestion("What is the Party's ultimate goal?", "worldview", 3, ["party", "power"]),
  createSuggestion("Why is control of the past so important?", "worldview", 3, ["history", "control"]),
  createSuggestion("What makes a perfect society in your view?", "worldview", 3, ["society", "perfection"]),
  createSuggestion("How does the Party view human relationships?", "worldview", 3, ["relationships", "control"]),
  createSuggestion("Is war necessary for the Party's survival?", "worldview", 3, ["war", "stability"]),

  // Thematic exploration
  createSuggestion("Explain the concept of doublethink", "theme", 3, ["doublethink", "psychology"]),
  createSuggestion("How does the Party use language to control thought?", "theme", 3, ["newspeak", "control"]),
  createSuggestion("What is the purpose of Room 101?", "theme", 3, ["room 101", "fear"]),
  createSuggestion("Why does the Party care about controlling memory?", "theme", 3, ["memory", "history"]),
  createSuggestion("Is truth objective or subjective?", "theme", 3, ["truth", "philosophy"]),

  // Emotional questions
  createSuggestion("Do you enjoy your work?", "emotional", 3, ["satisfaction", "duty"]),
  createSuggestion("Do you feel any remorse for your actions?", "emotional", 3, ["remorse", "duty"]),
  createSuggestion("What is your greatest fear?", "emotional", 3, ["fear", "vulnerability"]),
  createSuggestion("Do you ever doubt the Party's methods?", "emotional", 3, ["doubt", "loyalty"]),
  createSuggestion("What brings you satisfaction?", "emotional", 3, ["satisfaction", "motivation"])
];

// Alexandria the Librarian suggestions
export const librarianSuggestions: Suggestion[] = [
  // Analytical questions (librarian-specific category)
  createSuggestion("Can you explain the historical context behind '1984'?", "analytical", null, ["history", "context"]),
  createSuggestion("What literary techniques does Orwell use to create the dystopian atmosphere?", "analytical", null, ["literary", "technique"]),
  createSuggestion("How does the concept of doublethink function in the story?", "analytical", null, ["doublethink", "concept"]),
  createSuggestion("What are the parallels between Oceania and real-world totalitarian regimes?", "analytical", null, ["comparison", "history"]),
  createSuggestion("How does the novel's language reflect its themes of control?", "analytical", null, ["language", "themes"]),
  
  // Thematic questions
  createSuggestion("What are the main themes in '1984'?", "theme", null, ["themes", "overview"]),
  createSuggestion("How does surveillance function as a theme in the novel?", "theme", null, ["surveillance", "analysis"]),
  createSuggestion("What does '1984' say about the nature of truth?", "theme", null, ["truth", "philosophy"]),
  createSuggestion("How does Orwell explore the concept of freedom in the novel?", "theme", null, ["freedom", "analysis"]),
  createSuggestion("What is the significance of the ending of '1984'?", "theme", null, ["ending", "interpretation"]),
  
  // Character analysis
  createSuggestion("Can you analyze Winston Smith's character development?", "relationship", null, ["winston", "character"]),
  createSuggestion("What is Julia's role in the narrative?", "relationship", null, ["julia", "character"]),
  createSuggestion("How does O'Brien function as an antagonist?", "relationship", null, ["obrien", "character"]),
  createSuggestion("What do the proles represent in '1984'?", "relationship", null, ["proles", "symbolism"]),
  createSuggestion("How does Big Brother operate as both a character and a symbol?", "relationship", null, ["big brother", "symbolism"]),
  
  // Educational/contextual
  createSuggestion("When was '1984' written and what was happening in the world then?", "experience", null, ["history", "context"]),
  createSuggestion("What was George Orwell's background and how did it influence this novel?", "experience", null, ["orwell", "biography"]),
  createSuggestion("How has '1984' influenced modern literature and culture?", "experience", null, ["influence", "culture"]),
  createSuggestion("What other dystopian novels should I read if I enjoyed '1984'?", "experience", null, ["recommendations", "dystopian"]),
  createSuggestion("How accurate were Orwell's predictions about the future?", "experience", null, ["predictions", "relevance"])
];

// Combined map of all suggestions by character ID
export const allSuggestionsByCharacter: Record<string, Suggestion[]> = {
  "1": winstonSuggestions,
  "2": juliaSuggestions,
  "3": obrienSuggestions,
  "librarian": librarianSuggestions
};

// Get suggestions for a specific character or librarian
export const getSuggestionsForCharacter = (characterId: number | null): Suggestion[] => {
  const key = characterId === null ? 'librarian' : characterId.toString();
  return allSuggestionsByCharacter[key] || [];
}; 