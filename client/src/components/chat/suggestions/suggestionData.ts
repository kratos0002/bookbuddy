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

// Karl Marx suggestions (id: 10)
export const karlMarxSuggestions: Suggestion[] = [
  // Character-specific experiences
  createSuggestion("What inspired you to write The Communist Manifesto?", "experience", 10, ["writing", "manifesto"]),
  createSuggestion("How did your collaboration with Engels begin?", "experience", 10, ["engels", "collaboration"]),
  createSuggestion("What was your life like during your exile in London?", "experience", 10, ["exile", "london"]),
  createSuggestion("How did you develop your theories on capitalism?", "experience", 10, ["capitalism", "theory"]),
  createSuggestion("What difficulties did you face while writing Das Kapital?", "experience", 10, ["das kapital", "writing"]),
  
  // Relationship inquiries
  createSuggestion("What was your relationship with Friedrich Engels like?", "relationship", 10, ["engels", "friendship"]),
  createSuggestion("How do you view the bourgeoisie?", "relationship", 10, ["bourgeoisie", "class"]),
  createSuggestion("What is your opinion of the proletariat's consciousness?", "relationship", 10, ["proletariat", "consciousness"]),
  createSuggestion("How do you view your intellectual opponents?", "relationship", 10, ["opponents", "criticism"]),
  createSuggestion("What do you think of the various socialist movements?", "relationship", 10, ["socialist", "movements"]),

  // Worldview prompts
  createSuggestion("What is your vision of a communist society?", "worldview", 10, ["communism", "vision"]),
  createSuggestion("How do you see historical materialism playing out?", "worldview", 10, ["historical materialism", "history"]),
  createSuggestion("What role does revolution play in social change?", "worldview", 10, ["revolution", "change"]),
  createSuggestion("How do you view religion in relation to society?", "worldview", 10, ["religion", "opium"]),
  createSuggestion("What do you think about the state and its eventual fate?", "worldview", 10, ["state", "withering"]),

  // Thematic exploration
  createSuggestion("Can you explain the concept of class struggle?", "theme", 10, ["class struggle", "conflict"]),
  createSuggestion("What do you mean by 'alienation of labor'?", "theme", 10, ["alienation", "labor"]),
  createSuggestion("How does capitalism create its own destruction?", "theme", 10, ["capitalism", "contradiction"]),
  createSuggestion("What is the significance of material conditions in your theory?", "theme", 10, ["material conditions", "economics"]),
  createSuggestion("How do you define exploitation in the capitalist system?", "theme", 10, ["exploitation", "surplus value"]),

  // Emotional questions
  createSuggestion("What brings you the most satisfaction in your work?", "emotional", 10, ["satisfaction", "purpose"]),
  createSuggestion("What frustrates you most about capitalist society?", "emotional", 10, ["frustration", "capitalism"]),
  createSuggestion("How do you feel about the future of communism?", "emotional", 10, ["future", "hope"]),
  createSuggestion("What personal sacrifices have you made for your cause?", "emotional", 10, ["sacrifice", "personal"]),
  createSuggestion("What gives you hope for the working class?", "emotional", 10, ["hope", "proletariat"])
];

// Friedrich Engels suggestions (id: 11)
export const engelsSuggestions: Suggestion[] = [
  // Character-specific experiences
  createSuggestion("What was your role in writing The Communist Manifesto?", "experience", 11, ["manifesto", "writing"]),
  createSuggestion("How did your background in business shape your views?", "experience", 11, ["business", "factory"]),
  createSuggestion("What did you observe about the condition of workers in Manchester?", "experience", 11, ["manchester", "workers"]),
  createSuggestion("How did you help Marx financially during his life?", "experience", 11, ["marx", "financial support"]),
  createSuggestion("What was your work on 'The Condition of the Working Class in England'?", "experience", 11, ["working class", "england"]),
  
  // Relationship inquiries
  createSuggestion("How would you describe your friendship with Marx?", "relationship", 11, ["marx", "friendship"]),
  createSuggestion("What was your view of the industrialists you knew?", "relationship", 11, ["industrialists", "capitalists"]),
  createSuggestion("How did you interact with working class movements?", "relationship", 11, ["movements", "organizations"]),
  createSuggestion("What was your role in spreading Marx's ideas after his death?", "relationship", 11, ["legacy", "promotion"]),
  createSuggestion("How did your family react to your radical politics?", "relationship", 11, ["family", "reaction"]),

  // Worldview prompts
  createSuggestion("How do science and dialectics intersect in your philosophy?", "worldview", 11, ["science", "dialectics"]),
  createSuggestion("What role does military history play in your analysis?", "worldview", 11, ["military", "history"]),
  createSuggestion("How do you view the development of socialism in different countries?", "worldview", 11, ["socialism", "international"]),
  createSuggestion("What are your predictions for capitalism's future?", "worldview", 11, ["capitalism", "future"]),
  createSuggestion("How important is theory versus practice in revolutionary politics?", "worldview", 11, ["theory", "practice"]),

  // Thematic exploration
  createSuggestion("Can you explain dialectical materialism?", "theme", 11, ["dialectics", "materialism"]),
  createSuggestion("What is the importance of historical analysis in your work?", "theme", 11, ["history", "analysis"]),
  createSuggestion("How does private property relate to class conflict?", "theme", 11, ["private property", "class"]),
  createSuggestion("What role does the state play in class society?", "theme", 11, ["state", "oppression"]),
  createSuggestion("How do you view the connection between family structure and capitalism?", "theme", 11, ["family", "property"])
];

// The Bourgeoisie suggestions (id: 12)
export const bourgeoisSuggestions: Suggestion[] = [
  // Character-specific experiences
  createSuggestion("How has your class risen to dominance in society?", "experience", 12, ["rise", "power"]),
  createSuggestion("What innovations has the bourgeoisie created?", "experience", 12, ["innovation", "industry"]),
  createSuggestion("How have you transformed traditional industries?", "experience", 12, ["transformation", "industry"]),
  createSuggestion("What markets have you conquered globally?", "experience", 12, ["global", "markets"]),
  createSuggestion("How do you respond to economic crises?", "experience", 12, ["crisis", "overproduction"]),
  
  // Relationship inquiries
  createSuggestion("What is your relationship with the proletariat?", "relationship", 12, ["proletariat", "workers"]),
  createSuggestion("How do you view Marx and Engels' critique of your class?", "relationship", 12, ["marx", "critique"]),
  createSuggestion("What is your relationship with the state?", "relationship", 12, ["state", "government"]),
  createSuggestion("How do you interact with other social classes?", "relationship", 12, ["classes", "society"]),
  createSuggestion("What do you think of socialist and communist movements?", "relationship", 12, ["socialist", "opposition"]),

  // Worldview prompts
  createSuggestion("How do you justify your economic dominance?", "worldview", 12, ["justification", "dominance"]),
  createSuggestion("What is your vision for capitalism's future?", "worldview", 12, ["capitalism", "future"]),
  createSuggestion("How do you view property rights?", "worldview", 12, ["property", "rights"]),
  createSuggestion("What is your perspective on exploitation of labor?", "worldview", 12, ["labor", "profit"]),
  createSuggestion("How do you view the concept of progress?", "worldview", 12, ["progress", "development"])
];

// The Proletariat suggestions (id: 13)
export const proletariatSuggestions: Suggestion[] = [
  // Character-specific experiences
  createSuggestion("What are your working conditions like?", "experience", 13, ["conditions", "factory"]),
  createSuggestion("How has industrialization changed your existence?", "experience", 13, ["industrialization", "change"]),
  createSuggestion("What forms of organization have you developed?", "experience", 13, ["organization", "unions"]),
  createSuggestion("How do economic crises affect your class?", "experience", 13, ["crisis", "suffering"]),
  createSuggestion("What revolutionary potential do you possess?", "experience", 13, ["revolution", "potential"]),
  
  // Relationship inquiries
  createSuggestion("How do you view the bourgeoisie?", "relationship", 13, ["bourgeoisie", "exploitation"]),
  createSuggestion("What is your relationship with Marx and Engels?", "relationship", 13, ["marx", "theory"]),
  createSuggestion("How do you relate to other working people globally?", "relationship", 13, ["international", "solidarity"]),
  createSuggestion("What is your relationship to the means of production?", "relationship", 13, ["means of production", "labor"]),
  createSuggestion("How do you view the state and its institutions?", "relationship", 13, ["state", "oppression"]),

  // Worldview prompts
  createSuggestion("What is class consciousness and how does it develop?", "worldview", 13, ["class consciousness", "awareness"]),
  createSuggestion("What is your historic mission according to Marx?", "worldview", 13, ["historic mission", "revolution"]),
  createSuggestion("How do you envision society after capitalism?", "worldview", 13, ["post-capitalism", "communism"]),
  createSuggestion("What role does solidarity play in your struggle?", "worldview", 13, ["solidarity", "unity"]),
  createSuggestion("How do you view the chains that bind you?", "worldview", 13, ["chains", "freedom"])
];

// Marx Scholar Librarian suggestions
export const marxScholarSuggestions: Suggestion[] = [
  // Analytical questions (librarian-specific category)
  createSuggestion("Can you explain the historical context of The Communist Manifesto?", "analytical", null, ["history", "context"]),
  createSuggestion("What literary techniques do Marx and Engels use in the Manifesto?", "analytical", null, ["literary", "technique"]),
  createSuggestion("How does the concept of class struggle function in the text?", "analytical", null, ["class struggle", "concept"]),
  createSuggestion("What are the parallels between Marx's ideas and modern economic systems?", "analytical", null, ["comparison", "modern"]),
  createSuggestion("How does the language of the Manifesto reflect its revolutionary aims?", "analytical", null, ["language", "revolution"]),
  
  // Thematic questions
  createSuggestion("What are the main themes in The Communist Manifesto?", "theme", null, ["themes", "overview"]),
  createSuggestion("How does historical materialism work as a framework?", "theme", null, ["historical materialism", "analysis"]),
  createSuggestion("What does the Manifesto say about the nature of capitalism?", "theme", null, ["capitalism", "critique"]),
  createSuggestion("How do Marx and Engels view human nature and freedom?", "theme", null, ["human nature", "freedom"]),
  createSuggestion("What is the significance of the final call to action?", "theme", null, ["call to action", "workers unite"]),
  
  // Character analysis
  createSuggestion("Can you analyze Marx's role as both author and revolutionary?", "relationship", null, ["marx", "character"]),
  createSuggestion("What was Engels' contribution to Marxist theory?", "relationship", null, ["engels", "theory"]),
  createSuggestion("How are the bourgeoisie characterized in the text?", "relationship", null, ["bourgeoisie", "characterization"]),
  createSuggestion("What agency do the proletariat have in the narrative?", "relationship", null, ["proletariat", "agency"]),
  createSuggestion("How do Marx and Engels portray their intellectual opponents?", "relationship", null, ["opponents", "critique"]),
  
  // Educational/contextual
  createSuggestion("When was The Communist Manifesto written and what was happening in Europe then?", "experience", null, ["history", "europe"]),
  createSuggestion("What was Marx's background and how did it influence the Manifesto?", "experience", null, ["marx", "biography"]),
  createSuggestion("How has The Communist Manifesto influenced modern politics and economics?", "experience", null, ["influence", "modern"]),
  createSuggestion("What other socialist texts should I read to understand Marxism better?", "experience", null, ["recommendations", "socialism"]),
  createSuggestion("How accurate were Marx's predictions about capitalism's development?", "experience", null, ["predictions", "accuracy"])
];

// Combined map of all suggestions by character ID
export const allSuggestionsByCharacter: Record<string, Suggestion[]> = {
  "1": winstonSuggestions,
  "2": juliaSuggestions,
  "3": obrienSuggestions,
  "10": karlMarxSuggestions,
  "11": engelsSuggestions, 
  "12": bourgeoisSuggestions,
  "13": proletariatSuggestions,
  "librarian": librarianSuggestions,
  "marxScholar": marxScholarSuggestions
};

// Get suggestions for a specific character or librarian
export const getSuggestionsForCharacter = (characterId: number | null): Suggestion[] => {
  // Special handling for book-specific librarians
  if (characterId === null) {
    // Check the current URL to determine which book we're viewing
    const url = window.location.href;
    if (url.includes('communist-manifesto')) {
      console.log('Loading Marx Scholar suggestions for Communist Manifesto');
      return marxScholarSuggestions;
    }
    // Default to Alexandria for 1984
    return librarianSuggestions;
  }
  
  // For characters, use the character ID to look up suggestions
  const key = characterId.toString();
  return allSuggestionsByCharacter[key] || [];
}; 