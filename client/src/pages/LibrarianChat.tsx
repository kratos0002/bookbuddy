import React from 'react';
import SimpleLibrarian from '@/components/SimpleLibrarian';

const LibrarianChat: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Chat with Alexandria, the AI Librarian</h1>
      <p className="mb-6 text-muted-foreground">
        Alexandria is an AI literary expert specializing in George Orwell's "1984". 
        Ask her about the book's themes, characters, historical context, or any literary analysis.
      </p>
      
      <div className="h-[600px]">
        <SimpleLibrarian />
      </div>
    </div>
  );
};

export default LibrarianChat; 