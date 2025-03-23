
import React from 'react';
import { useBook } from '../contexts/BookContext';
import { CalendarDays, BookOpen, MapPin } from 'lucide-react';

const BookCover: React.FC = () => {
  const { selectedBook } = useBook();

  return (
    <div className="relative w-full md:w-auto flex-shrink-0">
      <div className="relative w-full aspect-[2/3] max-w-xs mx-auto overflow-hidden rounded-lg shadow-xl animate-fade-in">
        {/* 1984 image as book cover */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-book-dark/20 via-transparent to-book-dark/70 z-10"
          aria-hidden="true"
        />
        
        {/* Static effect for dystopian feel */}
        <div 
          className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay animate-subtle-noise z-10"
          aria-hidden="true"
        />
        
        {/* Styled background with 1984 cover */}
        <div 
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{
            backgroundImage: `url('/lovable-uploads/b3da856a-355b-47ce-bb43-78acf487209e.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="relative z-20 text-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50 p-4 rounded-md backdrop-blur-sm">
            <h2 className="text-3xl font-bold tracking-tight text-book-secondary mb-2 text-shadow-sm">{selectedBook.title}</h2>
            <p className="text-xl text-book-secondary/80 mb-4">{selectedBook.author}</p>
          </div>
        </div>
        
        {/* Book information overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-book-dark to-transparent z-20">
          <p className="text-book-secondary text-sm flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-book-secondary/50 rounded-full"></span>
            <span>Published {selectedBook.publishedYear}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCover;
