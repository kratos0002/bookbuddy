
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book, Character, books } from '../data/books';

interface BookContextType {
  selectedBook: Book;
  selectedCharacter: Character | null;
  messages: Message[];
  setSelectedBook: (book: Book) => void;
  setSelectedCharacter: (character: Character | null) => void;
  addMessage: (message: Message) => void;
  resetMessages: () => void;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character' | 'librarian';
  timestamp: Date;
  characterId?: string;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const resetMessages = () => {
    setMessages([]);
  };

  return (
    <BookContext.Provider
      value={{
        selectedBook,
        selectedCharacter,
        messages,
        setSelectedBook,
        setSelectedCharacter,
        addMessage,
        resetMessages,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};
