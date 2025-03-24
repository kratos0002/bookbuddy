import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, User, Bookmark, PenTool } from 'lucide-react';
import { useBook } from '@/contexts/BookContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

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
  <div className="flex flex-col h-full p-4 space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-24" />
    </div>
    
    <div className="space-y-4 mt-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

const QuoteExplorerTab: React.FC = () => {
  const { selectedBook } = useBook();
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  
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

  if (isLoading) {
    return <QuoteExplorerSkeleton />;
  }

  if (error || !quoteData) {
    return (
      <div className="p-6 text-center">
        <div className="text-3xl mb-4 text-red-500">😕</div>
        <h3 className="text-lg font-medium mb-2">Unable to load quotes</h3>
        <p className="text-muted-foreground mb-4">
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
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-bold flex items-center gap-2 text-book-primary">
          <Quote className="h-5 w-5 text-book-primary/70" />
          Quote Explorer: {selectedBook.title}
        </h2>
        <p className="text-xs text-muted-foreground">
          Explore significant quotes, organized by themes and characters
        </p>
      </div>

      <Tabs defaultValue="themes" className="flex-1 flex flex-col">
        <div className="px-4 pt-2 border-b">
          <TabsList className="mb-2">
            <TabsTrigger value="themes" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>By Theme</span>
            </TabsTrigger>
            <TabsTrigger value="characters" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By Character</span>
            </TabsTrigger>
            <TabsTrigger value="significant" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span>Significant</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Quotes by Themes */}
        <TabsContent value="themes" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-2">
            {quoteData.themes.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {quoteData.themes.map((theme) => (
                  <AccordionItem key={theme.id} value={`theme-${theme.id}`}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                      <span className="font-medium text-sm">{theme.name}</span>
                      <Badge variant="outline" className="ml-2 font-normal">
                        {theme.quotes.length}
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 p-2">
                        <p className="text-xs text-muted-foreground mb-3 px-2">
                          {theme.description}
                        </p>
                        {theme.quotes.map((quote) => (
                          <Card 
                            key={quote.id}
                            className="border-book-primary/10 hover:border-book-primary/30 cursor-pointer transition-colors"
                            onClick={() => setCurrentQuote(quote)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2">
                                <Quote className="h-4 w-4 text-book-primary/70 flex-shrink-0 mt-1" />
                                <div>
                                  <p className="text-sm">
                                    {truncateText(quote.text)}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Chapter {quote.chapter}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No theme data available</p>
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
                    <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                      <span className="font-medium text-sm">{character.name}</span>
                      <Badge variant="outline" className="ml-2 font-normal">
                        {character.quotes.length}
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 p-2">
                        {character.quotes.length > 0 ? (
                          character.quotes.map((quote) => (
                            <Card 
                              key={quote.id}
                              className="border-book-primary/10 hover:border-book-primary/30 cursor-pointer transition-colors"
                              onClick={() => setCurrentQuote(quote)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <Quote className="h-4 w-4 text-book-primary/70 flex-shrink-0 mt-1" />
                                  <div>
                                    <p className="text-sm">
                                      {truncateText(quote.text)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Chapter {quote.chapter}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No quotes found for this character
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No character data available</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Significant Quotes */}
        <TabsContent value="significant" className="flex-1">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                These are the most significant quotes from {selectedBook.title}, selected for their thematic importance and impact.
              </p>
              
              {quoteData.mostSignificantQuotes.length > 0 ? (
                quoteData.mostSignificantQuotes.map((quote) => (
                  <Card 
                    key={quote.id}
                    className="border-book-primary/10 hover:border-book-primary/30 cursor-pointer transition-colors"
                    onClick={() => setCurrentQuote(quote)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <PenTool className="h-5 w-5 text-book-primary/70 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {truncateText(quote.text, 300)}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Chapter {quote.chapter}
                            </p>
                            {quote.themes && quote.themes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {quote.themes.slice(0, 2).map((theme, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {theme}
                                  </Badge>
                                ))}
                                {quote.themes.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{quote.themes.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No significant quotes available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Quote Detail Modal */}
      {currentQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Quote className="h-5 w-5 text-book-primary" />
                <span>Quote Detail</span>
              </h3>
            </div>
            <div className="p-6">
              <blockquote className="text-lg italic border-l-4 border-book-primary pl-4 py-2 mb-4">
                "{currentQuote.text}"
              </blockquote>
              
              <div className="text-sm text-muted-foreground mb-4">
                <p>Chapter {currentQuote.chapter}</p>
              </div>
              
              {currentQuote.themes && currentQuote.themes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Related Themes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentQuote.themes.map((theme, index) => (
                      <Badge key={index} variant="secondary">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {currentQuote.significance && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Significance:</h4>
                  <p className="text-sm bg-muted p-3 rounded">
                    {typeof currentQuote.significance === 'number'
                      ? `This quote has a significance rating of ${currentQuote.significance}/5.`
                      : String(currentQuote.significance)}
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-muted/30 flex justify-end">
              <Button variant="outline" onClick={() => setCurrentQuote(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteExplorerTab;