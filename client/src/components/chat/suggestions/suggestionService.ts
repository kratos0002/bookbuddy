import { Suggestion, SuggestionContext } from './types';
import { getSuggestionsForCharacter } from './suggestionData';

// How many suggestions to show at once
const MAX_SUGGESTIONS = 4;

// Track which suggestions have been shown to avoid repetition
const usedSuggestionIds = new Set<string>();

// Reset used suggestions for a specific character
export const resetSuggestionsForCharacter = (characterId: number | null) => {
  const allSuggestions = getSuggestionsForCharacter(characterId);
  allSuggestions.forEach(suggestion => {
    usedSuggestionIds.delete(suggestion.id);
  });
};

// Get suggestions based on conversation context
export const getSuggestions = (context: SuggestionContext): Suggestion[] => {
  const { characterId, messageCount, preferredCategories } = context;
  
  // Get all available suggestions for this character
  const allSuggestions = getSuggestionsForCharacter(characterId);
  
  // Filter out already used suggestions
  const availableSuggestions = allSuggestions.filter(
    suggestion => !usedSuggestionIds.has(suggestion.id)
  );
  
  // If we're running low on suggestions, reset used suggestions
  if (availableSuggestions.length < MAX_SUGGESTIONS) {
    resetSuggestionsForCharacter(characterId);
    return getSuggestions(context);
  }
  
  // For initial conversation (1-2 messages), provide introductory suggestions
  if (messageCount <= 2) {
    return selectIntroductorySuggestions(availableSuggestions);
  }
  
  // For ongoing conversations, use preferred categories if available
  if (preferredCategories && preferredCategories.length > 0) {
    return selectCategorySuggestions(availableSuggestions, preferredCategories);
  }
  
  // Default: provide balanced mix of categories
  return selectBalancedSuggestions(availableSuggestions);
};

// Select suggestions suitable for starting a conversation
const selectIntroductorySuggestions = (suggestions: Suggestion[]): Suggestion[] => {
  // Prefer experience and worldview questions for introductions
  const introCategories = ['experience', 'worldview'];
  const introCategorySuggestions = suggestions.filter(
    s => introCategories.includes(s.category)
  );
  
  // Randomly select from these categories first
  const selected = selectRandomSuggestions(introCategorySuggestions, Math.min(3, introCategorySuggestions.length));
  
  // Fill remaining slots with other categories
  const remaining = MAX_SUGGESTIONS - selected.length;
  if (remaining > 0) {
    const otherSuggestions = suggestions.filter(
      s => !introCategories.includes(s.category) && !selected.includes(s)
    );
    selected.push(...selectRandomSuggestions(otherSuggestions, remaining));
  }
  
  markSuggestionsAsUsed(selected);
  return selected;
};

// Select suggestions based on preferred categories
const selectCategorySuggestions = (
  suggestions: Suggestion[],
  preferredCategories: string[]
): Suggestion[] => {
  // Calculate how many suggestions to take from preferred categories (at least 2)
  const preferredCount = Math.max(2, Math.min(MAX_SUGGESTIONS - 1, preferredCategories.length));
  
  // Get suggestions from preferred categories
  const preferredSuggestions = suggestions.filter(
    s => preferredCategories.includes(s.category)
  );
  
  // Randomly select from preferred categories
  const selected = selectRandomSuggestions(preferredSuggestions, preferredCount);
  
  // Fill remaining slots with other categories
  const remaining = MAX_SUGGESTIONS - selected.length;
  if (remaining > 0) {
    const otherSuggestions = suggestions.filter(
      s => !preferredCategories.includes(s.category) && !selected.includes(s)
    );
    selected.push(...selectRandomSuggestions(otherSuggestions, remaining));
  }
  
  markSuggestionsAsUsed(selected);
  return selected;
};

// Select a balanced mix of suggestions across categories
const selectBalancedSuggestions = (suggestions: Suggestion[]): Suggestion[] => {
  const categories = [...new Set(suggestions.map(s => s.category))];
  const selected: Suggestion[] = [];
  
  // Ensure we get at least one from each category if possible
  for (const category of categories) {
    if (selected.length >= MAX_SUGGESTIONS) break;
    
    const categorySuggestions = suggestions.filter(s => s.category === category);
    if (categorySuggestions.length > 0) {
      selected.push(categorySuggestions[Math.floor(Math.random() * categorySuggestions.length)]);
    }
  }
  
  // If we still have slots, fill with random suggestions from any category
  const remaining = MAX_SUGGESTIONS - selected.length;
  if (remaining > 0) {
    const remainingSuggestions = suggestions.filter(s => !selected.includes(s));
    selected.push(...selectRandomSuggestions(remainingSuggestions, remaining));
  }
  
  markSuggestionsAsUsed(selected);
  return selected;
};

// Helper to randomly select N suggestions from an array
const selectRandomSuggestions = (suggestions: Suggestion[], count: number): Suggestion[] => {
  const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Mark suggestions as used
const markSuggestionsAsUsed = (suggestions: Suggestion[]) => {
  suggestions.forEach(suggestion => {
    usedSuggestionIds.add(suggestion.id);
  });
}; 