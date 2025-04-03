// Update character data structure to not require affiliation field if it doesn't exist in DB
// Check for field existence before accessing it
export function getCharacterById(id: number) {
  try {
    const character = characters.find(c => c.id === id);
    if (!character) {
      return null;
    }
    
    // Return character data with safe fallbacks
    return {
      ...character,
      // Provide fallback for affiliation if it doesn't exist in DB schema
      affiliation: character.affiliation || "Unknown",
    };
  } catch (error) {
    console.error(`Error fetching character by ID ${id}:`, error);
    return null;
  }
}

// Ensure any other functions that use affiliation have fallbacks
export function getCharacters(bookId: number) {
  try {
    // Filter characters by book ID
    const filteredCharacters = characters.filter(c => c.bookId === bookId)
      .map(character => ({
        ...character,
        // Provide fallback for affiliation if it doesn't exist
        affiliation: character.affiliation || "Unknown",
      }));
    
    return filteredCharacters;
  } catch (error) {
    console.error(`Error fetching characters for book ${bookId}:`, error);
    return [];
  }
} 