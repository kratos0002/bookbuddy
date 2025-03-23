
import React from 'react';
import { Book, Clock, Bell } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';

interface ComingSoonBook {
  title: string;
  author: string;
  estimatedRelease: string;
  coverImage?: string;
}

const comingSoonBooks: ComingSoonBook[] = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    estimatedRelease: 'Summer 2024',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    estimatedRelease: 'Fall 2024',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    estimatedRelease: 'Winter 2024',
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    estimatedRelease: 'Spring 2025',
  }
];

const ComingSoonBooksSection = () => {
  return (
    <section className="px-4 py-16 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-book-primary/20 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-center mb-4">Expanding Our Library</h2>
        <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're working to bring more literary worlds to life. Here's a preview of what's coming to our digital shelves.
        </p>
        
        <div className="relative mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {comingSoonBooks.map((book, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 p-2">
                  <div className="relative aspect-[2/3] book-spine group">
                    <div className="absolute inset-0 bg-muted/50 rounded-lg flex flex-col p-4 border border-muted transition-all group-hover:border-book-primary/20 group-hover:bg-muted/70">
                      <div className="absolute top-0 right-0 bg-book-primary/80 text-white text-xs px-2 py-1 rounded-bl rounded-tr flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Coming Soon</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <Book className="h-12 w-12 text-muted-foreground mb-4 transition-transform group-hover:scale-110 duration-300" />
                        <h3 className="font-medium text-lg mb-1">{book.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                        <p className="text-xs px-3 py-1 rounded-full bg-book-primary/10 text-book-primary inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> 
                          {book.estimatedRelease}
                        </p>
                      </div>
                      
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full justify-center text-xs gap-1"
                              >
                                <Bell className="h-3 w-3" />
                                Get Notified
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Coming soon! We'll add notifications in the future.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="relative static translate-y-0 left-0 !mr-2" />
              <CarouselNext className="relative static translate-y-0 right-0 !ml-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonBooksSection;
