/**
 * Converts a book slug or ID from URL to a numeric ID for API calls
 */
export function getNumericBookId(slug: string | undefined): number {
  if (!slug) return 1; // Default to 1984
  
  // Handle special cases for The Communist Manifesto
  if (slug === 'communist-manifesto' || slug === '2') {
    return 2;
  }
  
  // Special case for query parameter
  if (slug === 'bookId=communist-manifesto') {
    return 2;
  }
  
  // Try parsing as a number first
  const numId = parseInt(slug);
  if (!isNaN(numId) && numId > 0) {
    return numId;
  }
  
  // Default to 1984
  return 1;
}

/**
 * Returns the librarian name based on the book ID
 */
export function getLibrarianName(bookId: number): string {
  switch (bookId) {
    case 2:
      return 'Marx Scholar';
    case 1:
    default:
      return 'Alexandria';
  }
}

/**
 * Returns the book title based on the book ID
 */
export function getBookTitle(bookId: number): string {
  switch (bookId) {
    case 2:
      return 'The Communist Manifesto';
    case 1:
    default:
      return '1984';
  }
}

/**
 * Returns the book author based on the book ID
 */
export function getBookAuthor(bookId: number): string {
  switch (bookId) {
    case 2:
      return 'Karl Marx and Friedrich Engels';
    case 1:
    default:
      return 'George Orwell';
  }
} 