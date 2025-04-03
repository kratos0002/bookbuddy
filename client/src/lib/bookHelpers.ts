import { books } from '../data/books';

// Type for book URL slug mapping
interface BookUrlMapping {
  slug: string;    // URL-friendly slug
  id: string;      // Book ID in data
  numericId: number; // Numeric ID for API calls
}

// Centralized mapping between URL slugs and book IDs
// Keep this list in sync with the books array in data/books.ts
export const BOOK_URL_MAPPINGS: BookUrlMapping[] = [
  { slug: '1984', id: '1984', numericId: 1 },
  { slug: 'communist-manifesto', id: 'communist-manifesto', numericId: 2 },
  // Add new books here as they are created
];

/**
 * Convert a URL slug to a numeric book ID for API calls
 * @param urlSlug - The URL slug from the route parameter
 * @returns The numeric book ID, or 1 as a fallback
 */
export function getNumericBookId(urlSlug: string | undefined): number {
  if (!urlSlug) return 1; // Default to 1984
  
  const mapping = BOOK_URL_MAPPINGS.find(m => m.slug === urlSlug);
  return mapping?.numericId || 1; // Default to 1984 if not found
}

/**
 * Get a book object by its URL slug
 * @param urlSlug - The URL slug from the route parameter
 * @returns The book object, or the first book as a fallback
 */
export function getBookBySlug(urlSlug: string | undefined) {
  if (!urlSlug) return books[0]; // Default to first book
  
  const mapping = BOOK_URL_MAPPINGS.find(m => m.slug === urlSlug);
  return books.find(book => book.id === mapping?.id) || books[0];
}

/**
 * Get librarian name based on book ID
 * @param bookId - Numeric book ID
 * @returns The librarian name for the specified book
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
 * Generate a consistent URL path for a book based on its ID
 * @param bookId - The book ID from the data
 * @returns The URL path for the book
 */
export function getBookUrlPath(bookId: string): string {
  const mapping = BOOK_URL_MAPPINGS.find(m => m.id === bookId);
  return mapping ? `/book/${mapping.slug}` : '/book/1984';
}

/**
 * Validate that a numeric book ID exists
 * @param numericId - The numeric book ID
 * @returns true if valid, false if not
 */
export function isValidNumericBookId(numericId: number): boolean {
  return BOOK_URL_MAPPINGS.some(m => m.numericId === numericId);
} 