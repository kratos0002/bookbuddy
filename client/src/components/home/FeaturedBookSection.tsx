
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, User } from 'lucide-react';
import { useBook } from '../../contexts/BookContext';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FeaturedBookSection = () => {
  const { selectedBook } = useBook();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="bg-muted/30 px-4 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-book-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-book-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-serif font-semibold text-center mb-4">Featured Book</h2>
        <div className="h-px w-24 mx-auto bg-book-primary/30 mb-12"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div 
            className="relative w-full md:w-1/3 aspect-[2/3] max-w-xs mx-auto group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* "Available Now" badge */}
            <div className="absolute -top-3 -right-3 z-30">
              <Badge className="bg-green-600 text-white border-0 shadow-lg animate-pulse-subtle px-3 py-1.5">
                Available Now
              </Badge>
            </div>

            {/* Book Cover with 3D effect */}
            <div className={`absolute inset-0 z-10 rounded-lg shadow-xl transform ${isHovered ? 'translate-y-[-5px] scale-[1.02]' : ''} transition-all duration-300`}>
              <div className="absolute inset-0 bg-gradient-to-b from-book-dark/20 via-transparent to-book-dark/70 z-20 rounded-lg"></div>
              <img 
                src="/lovable-uploads/b3da856a-355b-47ce-bb43-78acf487209e.png"
                alt="1984 Book Cover"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-book-dark/40 to-transparent rounded-l-lg"></div>
              
              {/* Bottom book info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <p className="text-book-secondary text-sm flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-book-secondary/50 rounded-full"></span>
                  <span>Published {selectedBook.publishedYear}</span>
                </p>
              </div>
            </div>
            
            {/* Book shadow and 3D effect */}
            <div className="absolute inset-0 z-0 rounded-lg bg-black/30 blur-lg -bottom-2 scale-[0.95] transform translate-y-4"></div>
          </div>
          
          <div className="md:w-2/3">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-book-primary mb-2">{selectedBook.title}</h3>
            <p className="text-xl text-muted-foreground mb-4">{selectedBook.author}</p>
            <div className="mb-6">
              <p className="mb-4">
                In the totalitarian superstate of Oceania, Winston Smith is a low-ranking member of the ruling Party 
                who is tired of the omnipresent eyes of Big Brother and his own perpetual surveillance. He begins 
                a forbidden love affair with Julia, and challenges the system with their rebellion.
              </p>
              
              {/* Character previews */}
              <div className="flex flex-wrap gap-3 mb-6">
                <TooltipProvider>
                  {selectedBook.characters.map((character) => (
                    <Tooltip key={character.id}>
                      <TooltipTrigger asChild>
                        <div className="w-10 h-10 rounded-full bg-book-primary/10 flex items-center justify-center hover:bg-book-primary/20 transition-colors cursor-pointer">
                          <User className="h-5 w-5 text-book-primary" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="font-medium">{character.name}</p>
                        <p className="text-xs text-muted-foreground">{character.role}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
              
              {/* Themes */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedBook.themes.slice(0, 4).map((theme) => (
                  <span key={theme} className="px-3 py-1 bg-book-primary/10 text-book-primary text-sm rounded-full">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <Link to="/conversation">
                  Talk to 1984 Characters
                  <Play className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link to="/conversation">
                  Explore Book Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBookSection;
