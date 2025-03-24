import React from 'react';
import { Book, Clock, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
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
  color: string;
}

const comingSoonBooks: ComingSoonBook[] = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    estimatedRelease: 'Summer 2024',
    color: '#1a3a5f'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    estimatedRelease: 'Fall 2024',
    color: '#8b2439'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    estimatedRelease: 'Winter 2024',
    color: '#7d8c75'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    estimatedRelease: 'Spring 2025',
    color: '#1a3a5f'
  }
];

const ComingSoonBooksSection = () => {
  return (
    <section className="px-4 py-20 bg-[#f8f0e3]/30 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b2439]/20 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#1a3a5f]">Expanding Our Library</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're bringing more literary worlds to life. Here's a preview of the conversations coming to our digital shelves.
          </p>
        </motion.div>
        
        <div className="relative mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {comingSoonBooks.map((book, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 p-2">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative aspect-[2/3] book-spine group"
                  >
                    <div className="absolute inset-0 bg-white rounded-lg flex flex-col p-4 border border-[#f8f0e3] shadow-md transition-all group-hover:border-[#8b2439]/20 group-hover:shadow-lg">
                      <div className={`absolute top-0 right-0 bg-[${book.color}] text-white text-xs px-2 py-1 rounded-bl rounded-tr flex items-center gap-1`}>
                        <Clock className="h-3 w-3" />
                        <span>Coming Soon</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className={`w-16 h-16 rounded-full bg-[${book.color}]/10 flex items-center justify-center mb-6`}>
                          <Book className={`h-8 w-8 text-[${book.color}]`} />
                        </div>
                        <h3 className="font-medium text-lg mb-1 font-serif text-[#1a3a5f]">{book.title}</h3>
                        <p className="text-sm text-[#8b2439] mb-3">{book.author}</p>
                        <p className={`text-xs px-3 py-1 rounded-full bg-[${book.color}]/10 text-[${book.color}] inline-flex items-center`}>
                          <Clock className="h-3 w-3 mr-1" /> 
                          {book.estimatedRelease}
                        </p>
                      </div>
                      
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full justify-center text-xs gap-1 border-[#8b2439]/20 text-[#8b2439] hover:bg-[#8b2439]/5"
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
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative static translate-y-0 left-0 !mr-2 border-[#1a3a5f]/30 text-[#1a3a5f] hover:bg-[#1a3a5f]/10" />
              <CarouselNext className="relative static translate-y-0 right-0 !ml-2 border-[#1a3a5f]/30 text-[#1a3a5f] hover:bg-[#1a3a5f]/10" />
            </div>
          </Carousel>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm italic">
            "The reader lives a thousand lives before he dies." - George R.R. Martin
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonBooksSection;
