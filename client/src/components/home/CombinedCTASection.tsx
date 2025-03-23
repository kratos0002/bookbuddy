import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, BookMarked } from 'lucide-react';

const CombinedCTASection: React.FC = () => {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Explore "1984" in New Ways</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover deeper insights into George Orwell's classic dystopian novel with our interactive tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card p-8 rounded-lg shadow-sm border flex flex-col items-center">
              <BookMarked size={48} className="text-book-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chat with Characters</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Have conversations with Winston, Julia, O'Brien and other characters from "1984".
              </p>
              <Link to="/conversation" className="mt-auto">
                <Button variant="outline" className="w-full">Start a Character Chat</Button>
              </Link>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-sm border flex flex-col items-center border-book-primary/50">
              <BookOpen size={48} className="text-book-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chat with Alexandria</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Discuss literary themes, analysis, and historical context with our AI Librarian.
              </p>
              <div className="relative w-full mt-auto">
                <div className="absolute -top-3 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  New!
                </div>
                <Link to="/librarian">
                  <Button className="w-full bg-book-primary hover:bg-book-primary/90">Try the AI Librarian</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CombinedCTASection; 