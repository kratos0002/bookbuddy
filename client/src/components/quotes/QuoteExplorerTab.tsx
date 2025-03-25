import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, User, Bookmark, PenTool, X } from 'lucide-react';
import { useBook } from '@/contexts/BookContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

// Types for the Quote Explorer data
interface Quote {
  id: number;
  text: string;
  chapter: number;
  significance?: number | string;
  themes?: string[];
}

interface Theme {
  id: string;
  name: string;
  description?: string;
  quotes: Quote[];
}

interface Character {
  id: string;
  name: string;
  quotes: Quote[];
}

// This matches the actual API response structure
interface ApiResponse {
  quotesByTheme: Record<string, Quote[]>;
  quotesByCharacter: Record<string, Quote[]>;
  mostSignificantQuotes: Quote[];
}

interface QuoteExplorerData {
  themes: Theme[];
  characters: Character[];
  mostSignificantQuotes: Quote[];
}

// Loading skeleton
const QuoteExplorerSkeleton: React.FC = () => (
  <div className="flex flex-col h-full p-3 sm:p-4 space-y-3 sm:space-y-4">
    <Skeleton className="h-7 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    
    <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 sm:pb-0">
      <Skeleton className="h-8 w-20 flex-shrink-0" />
      <Skeleton className="h-8 w-20 flex-shrink-0" />
      <Skeleton className="h-8 w-20 flex-shrink-0" />
    </div>
    
    <div className="space-y-3 sm:space-y-4 mt-4">
      <Skeleton className="h-10 sm:h-12 w-full" />
      <Skeleton className="h-10 sm:h-12 w-full" />
      <Skeleton className="h-10 sm:h-12 w-full" />
      <Skeleton className="h-10 sm:h-12 w-full" />
    </div>
  </div>
);

// Mobile quote detail view component
const MobileQuoteDetail: React.FC<{
  quote: Quote | null;
  onClose: () => void;
}> = ({ quote, onClose }) => {
  if (!quote) return null;
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card/95 backdrop-blur-sm">
        <h3 className="font-medium text-book-primary flex items-center gap-2">
          <Quote className="h-4 w-4" />
          Quote Details
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <blockquote className="bg-muted/50 p-4 rounded-lg border border-border/50 text-base italic relative">
            "{quote.text}"
            <div className="mt-2 text-right text-sm text-muted-foreground">
              — Chapter {quote.chapter}
            </div>
          </blockquote>
          
          {quote.themes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Related Themes:</h4>
              <div className="flex flex-wrap gap-2">
                {quote.themes.map((theme, idx) => (
                  <Badge key={idx} variant="outline" className="bg-book-primary/10 hover:bg-book-primary/20">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {quote.significance && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Significance:</h4>
              <div className="flex items-center gap-1 text-book-primary">
                {Array.from({ length: Math.min(5, Number(quote.significance)) }).map((_, i) => (
                  <PenTool key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const QuoteExplorerTab: React.FC = () => {
  const { selectedBook } = useBook();
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const isMobile = useIsMobile();
  
  // Helper function for theme descriptions
  const getThemeDescription = (themeName: string): string => {
    const descriptions: Record<string, string> = {
      'Totalitarianism': 'Explores the extreme political system where a single authority exercises absolute control over all aspects of public and private life.',
      'Psychological Manipulation': 'Examines how the Party uses propaganda and conditioning to control people\'s minds and thoughts.',
      'Control of Information': 'Investigates how history and information are manipulated to serve the Party\'s purposes.',
      'Individual vs. Collective': 'Explores the tension between personal freedom and social obligations in an oppressive society.',
      'Surveillance': 'Examines the pervasive monitoring and invasion of privacy by the state.',
      'Identity and Existence': 'Questions what it means to be human and maintain one\'s identity under extreme oppression.'
    };
    
    return descriptions[themeName] || `Quotes related to the theme of ${themeName}`;
  };
  
  // Fetch the Quote Explorer data
  const { data: apiData, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['/api/quotes/explorer-data'],
    queryFn: async () => {
      try {
        console.log('Fetching quotes explorer data from API...');
        const data = await apiRequest('GET', 'http://localhost:3000/api/quotes/explorer-data');
        console.log('Successfully retrieved quotes explorer data:', data);
        return data;
      } catch (err) {
        console.error('Failed to fetch quotes explorer data:', err);
        throw err;
      }
    },
    retry: 1,
  });

  // Transform API data to the format expected by the component
  const quoteData: QuoteExplorerData | undefined = React.useMemo(() => {
    if (!apiData) return undefined;
    
    try {
      console.log('Raw API data:', apiData);
      
      // Transform themes data
      const themes = Object.entries(apiData.quotesByTheme || {}).map(([name, quotes]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: getThemeDescription(name),
        quotes: quotes || []
      }));
      
      // Transform characters data
      const characters = Object.entries(apiData.quotesByCharacter || {}).map(([name, quotes]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        quotes: quotes || []
      }));
      
      return {
        themes,
        characters,
        mostSignificantQuotes: apiData.mostSignificantQuotes || []
      };
    } catch (err) {
      console.error('Error processing quote data:', err);
      return undefined;
    }
  }, [apiData]);

  // Helper function to truncate text for previews
  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Render quote item with proper handling for mobile/desktop
  const renderQuoteItem = (quote: Quote) => {
    return (
      <div 
        key={quote.id} 
        className="mb-3 p-3 border border-border/40 rounded-md hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setCurrentQuote(quote)}
      >
        <p className="text-sm italic line-clamp-2 mb-2">"{truncateText(quote.text, isMobile ? 60 : 100)}"</p>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Chapter {quote.chapter}</span>
          {quote.significance && (
            <div className="flex items-center gap-1 text-book-primary">
              {Array.from({ length: Math.min(3, Number(quote.significance)) }).map((_, i) => (
                <PenTool key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <QuoteExplorerSkeleton />;
  }

  if (error || !quoteData) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="text-3xl mb-4 text-red-500">😕</div>
        <h3 className="text-lg font-medium mb-2">Unable to load quotes</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {error ? (error as Error).message || 'There was an error loading the Quote Explorer data.' : 'Could not process quote data.'}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-book-primary">
          <Quote className="h-4 sm:h-5 w-4 sm:w-5 text-book-primary/70" />
          Quote Explorer: {selectedBook.title}
        </h2>
        <p className="text-xs text-muted-foreground">
          Explore significant quotes, organized by themes and characters
        </p>
      </div>

      <Tabs defaultValue="themes" className="flex-1 flex flex-col">
        <div className="px-2 sm:px-4 pt-2 border-b overflow-x-auto">
          <TabsList className="mb-2">
            <TabsTrigger value="themes" className="flex items-center gap-1 text-xs sm:text-sm">
              <BookOpen className="h-3 sm:h-4 w-3 sm:w-4" />
              <span>By Theme</span>
            </TabsTrigger>
            <TabsTrigger value="characters" className="flex items-center gap-1 text-xs sm:text-sm">
              <User className="h-3 sm:h-4 w-3 sm:w-4" />
              <span>By Character</span>
            </TabsTrigger>
            <TabsTrigger value="significant" className="flex items-center gap-1 text-xs sm:text-sm">
              <Bookmark className="h-3 sm:h-4 w-3 sm:w-4" />
              <span>Significant</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile view for quote details */}
        {isMobile && currentQuote && (
          <MobileQuoteDetail 
            quote={currentQuote} 
            onClose={() => setCurrentQuote(null)} 
          />
        )}

        {/* Quotes by Themes */}
        <TabsContent value="themes" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-2">
            {quoteData.themes.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {quoteData.themes.map((theme) => (
                  <AccordionItem key={theme.id} value={`theme-${theme.id}`}>
                    <AccordionTrigger className="text-sm sm:text-base py-2 sm:py-3 px-2">
                      <div className="text-left">
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                          {theme.quotes.length} quotes
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2 pl-2">
                        {theme.description}
                      </div>
                      <div className="space-y-2 pt-2">
                        {theme.quotes.map(renderQuoteItem)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-muted-foreground">No theme data available.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Quotes by Characters */}
        <TabsContent value="characters" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-2">
            {quoteData.characters.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {quoteData.characters.map((character) => (
                  <AccordionItem key={character.id} value={`character-${character.id}`}>
                    <AccordionTrigger className="text-sm sm:text-base py-2 sm:py-3 px-2">
                      <div className="text-left">
                        <div className="font-medium">{character.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                          {character.quotes.length} quotes
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {character.quotes.map(renderQuoteItem)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-muted-foreground">No character data available.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Most Significant Quotes */}
        <TabsContent value="significant" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-2">
            <h3 className="text-sm font-medium mb-3 px-2">Most Significant Passages</h3>
            
            {quoteData.mostSignificantQuotes.length > 0 ? (
              <div className="space-y-2">
                {quoteData.mostSignificantQuotes.map(renderQuoteItem)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-muted-foreground">No significant quotes available.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Desktop Quote Detail Panel */}
      {!isMobile && currentQuote && (
        <div className="border-t p-4 bg-muted/30">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-book-primary">Selected Quote</h3>
            <Button variant="ghost" size="sm" onClick={() => setCurrentQuote(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <blockquote className="bg-muted/50 p-3 rounded-lg border border-border/50 text-sm italic">
            "{currentQuote.text}"
            <div className="mt-2 text-right text-xs text-muted-foreground">
              — Chapter {currentQuote.chapter}
            </div>
          </blockquote>
          
          {currentQuote.themes && (
            <div className="mt-3">
              <h4 className="text-xs font-medium mb-1">Related Themes:</h4>
              <div className="flex flex-wrap gap-1">
                {currentQuote.themes.map((theme, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-book-primary/10 hover:bg-book-primary/20">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {currentQuote.significance && (
            <div className="mt-3">
              <h4 className="text-xs font-medium mb-1">Significance:</h4>
              <div className="flex items-center gap-1 text-book-primary">
                {Array.from({ length: Math.min(5, Number(currentQuote.significance)) }).map((_, i) => (
                  <PenTool key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuoteExplorerTab;