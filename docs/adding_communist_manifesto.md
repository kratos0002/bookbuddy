# Adding "The Communist Manifesto" to BookBuddy

This guide outlines the steps to add Karl Marx and Friedrich Engels' "The Communist Manifesto" to the BookBuddy application.

## Prerequisites

- A PDF copy of "The Communist Manifesto"
- BookNLP installed in your environment (see [book_processing/README.md](../book_processing/README.md) for details)
- Images for the book cover and character avatars

## Implementation Steps

### 1. Process the PDF with BookNLP

1. Place your PDF copy of "The Communist Manifesto" in the `attached_assets` directory:
   ```
   attached_assets/communist_manifesto.pdf
   ```

2. Run the processing pipeline:
   ```bash
   python book_processing/run_communist_manifesto_pipeline.py
   ```

   This script will:
   - Extract text from the PDF
   - Process the text with BookNLP
   - Extract quotes and create a quote explorer dataset
   - Generate character data and relationships

3. The processing will generate several output files in `book_processing/output/`:
   - `communist_manifesto_characters.json` - Character data
   - `communist_manifesto_themes.json` - Theme data
   - `communist_manifesto_relationships.json` - Relationship data
   - `communist_manifesto_character_profiles.json` - Character profiles
   - `communist_manifesto_quotes.json` - Raw quotes
   - `communist_manifesto_quote_explorer.json` - Organized quotes for the UI

### 2. Add Images

1. Add the following images to the `client/public/` directory:
   - `communist-manifesto-cover.jpg` - Book cover image
   - `karl-marx-avatar.jpg` - Karl Marx's avatar
   - `engels-avatar.jpg` - Friedrich Engels' avatar
   - `bourgeoisie-avatar.jpg` - Image representing the Bourgeoisie
   - `proletariat-avatar.jpg` - Image representing the Proletariat

   (Replace the placeholder .txt files with actual JPG images)

### 3. Update Application Data

1. Update the books data in `client/src/data/books.ts`:
   - The Communist Manifesto entry has already been added
   - Review and adjust any details as needed based on the processed data

2. Add encyclopedia entries in `client/src/data/encyclopedia-communist-manifesto.ts`:
   - Review and refine the entries based on the BookNLP processing results
   - Update the `iconKey` properties for all entries
   - Add any additional entries that might be relevant

3. Update the `client/src/contexts/EncyclopediaContext.tsx` to load the new entries:
   ```typescript
   // Import the new entries
   import communistManifestoEntries from '../data/encyclopedia-communist-manifesto';
   
   // Update the useEncyclopedia context provider to include the new book's entries
   ```

### 4. Update UI Components

1. Update the book selection UI to include The Communist Manifesto
2. Add the new book to the homepage featured books section
3. Update any book-specific styling or theming

### 5. Character Conversations

1. Create character personas for Marx, Engels, and conceptual characters (Bourgeoisie, Proletariat)
2. Update the conversation starters for the new book's characters
3. Ensure the AI service can generate appropriate responses for the new characters

### 6. Testing

1. Test book selection and navigation
2. Test encyclopedia entries and unlocking mechanisms
3. Test character conversations
4. Test quote explorer with the new quotes
5. Test overall theming and visual appearance

## Data Structure Details

### Book Object Structure

```typescript
{
  id: "communist-manifesto",
  title: "The Communist Manifesto",
  author: "Karl Marx and Friedrich Engels",
  publishedYear: 1848,
  coverImage: "/communist-manifesto-cover.jpg",
  description: "A foundational political document that outlines the theory and criticism of capitalism...",
  themeColors: {
    primary: "#B31942",
    secondary: "#F5F1E3",
    accent: "#0A3161",
  },
  characters: [
    // Character objects...
  ],
  themes: [
    // Themes array...
  ],
  keyLocations: [
    // Locations array...
  ],
  timeline: [
    // Timeline events...
  ]
}
```

### Encyclopedia Entry Structure

```typescript
{
  id: "string",
  title: "String",
  category: "Concepts" | "People" | "Events" | "Locations" | "Organizations" | "Objects" | "Technology",
  partyDescription: "String describing official/mainstream view",
  reality: "String describing the actual reality or critical view",
  quotes: ["Quote 1", "Quote 2"],
  relatedEntries: ["id-of-related-entry-1", "id-of-related-entry-2"],
  mentionedBy: ["character-id-1", "character-id-2"],
  iconKey: "concept" | "person" | "event" | "location" | "organization" | "object" | "technology",
  unlockProgress: "initial" | "locked"
}
```

## Additional Resources

- [The Communist Manifesto on Project Gutenberg](https://www.gutenberg.org/ebooks/61)
- [BookNLP Documentation](https://github.com/booknlp/booknlp)
- [BookBuddy Development Guide](./development.md) 