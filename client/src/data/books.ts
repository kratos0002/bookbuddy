
export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
  coverImage: string;
  description: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  characters: Character[];
  themes: string[];
  keyLocations: string[];
  timeline: TimelineEvent[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
}

interface TimelineEvent {
  year: number;
  event: string;
}

// For now, we only have 1984 as our featured book
export const books: Book[] = [
  {
    id: "1984",
    title: "1984",
    author: "George Orwell",
    publishedYear: 1949,
    coverImage: "/1984-cover.jpg", // We'll replace this with a real image later
    description: "In the totalitarian superstate of Oceania, Winston Smith is a low-ranking member of the ruling Party who is tired of the omnipresent eyes of Big Brother and his own perpetual surveillance. He begins a forbidden love affair with Julia, and challenges the system with their rebellion.",
    themeColors: {
      primary: "#8B1E3F",
      secondary: "#F5F1E3",
      accent: "#4E6E8E",
    },
    characters: [
      {
        id: "librarian",
        name: "Librarian",
        role: "Guide",
        description: "Your literary guide who can provide context, analysis, and insights about the book.",
        avatar: "/librarian-avatar.jpg", // Placeholder
      },
      {
        id: "winston",
        name: "Winston Smith",
        role: "Protagonist",
        description: "A 39-year-old man who works at the Ministry of Truth, rewriting history to match the Party's current narratives. He secretly hates the Party and dreams of rebellion.",
        avatar: "/winston-avatar.jpg", // Placeholder
      },
      {
        id: "julia",
        name: "Julia",
        role: "Love Interest",
        description: "A young woman who works in the Fiction Department at the Ministry of Truth. She secretly rebels against the Party through small acts of pleasure and freedom.",
        avatar: "/julia-avatar.jpg", // Placeholder
      },
      {
        id: "obrien",
        name: "O'Brien",
        role: "Antagonist",
        description: "A high-ranking member of the Inner Party who pretends to be part of the resistance to trap Winston, then tortures him into submission.",
        avatar: "/obrien-avatar.jpg", // Placeholder
      }
    ],
    themes: [
      "Totalitarianism",
      "Surveillance and Privacy",
      "Psychological Manipulation",
      "Resistance and Rebellion",
      "Language as Control",
      "Historical Revisionism"
    ],
    keyLocations: [
      "Oceania",
      "Airstrip One (formerly London)",
      "Ministry of Truth",
      "Room 101",
      "The Chestnut Tree Café"
    ],
    timeline: [
      { year: 1944, event: "Oceania forms from the merger of the Americas with the British Empire" },
      { year: 1950, event: "The Party rises to power and establishes totalitarian rule" },
      { year: 1984, event: "Winston begins his diary (the events of the novel)" }
    ]
  }
];

// Placeholder function for future book addition
export const addBook = (book: Book) => {
  books.push(book);
};
