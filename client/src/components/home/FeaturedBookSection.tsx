import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBook } from '@/contexts/BookContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  ArrowRight, 
  MessageCircle,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { books } from '@/data/books';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  isUserMessage: boolean;
  timestamp: string;
}

const FeaturedBookSection = () => {
  const { selectedBook, setSelectedBook } = useBook();
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [message, setMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Add state to track the current book index
  const [currentBookIndex, setCurrentBookIndex] = useState(() => {
    // Initialize with the index of the current selectedBook
    return books.findIndex(book => book.id === selectedBook.id);
  });
  
  // Fetch characters
  const { data: characters, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['/api/books/1/characters'],
    queryFn: () => {
      console.log("Fetching characters...");
      return apiRequest('GET', '/api/books/1/characters').then(data => {
        console.log("Characters received:", data);
        return data;
      });
    },
  });

  // Fetch messages with polling
  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    queryFn: () => apiRequest('GET', `/api/conversations/${conversationId}/messages`),
    enabled: !!conversationId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  // Update the selected book when the current book index changes
  useEffect(() => {
    setSelectedBook(books[currentBookIndex]);
  }, [currentBookIndex, setSelectedBook]);

  // Handler for navigating between books
  const navigateBook = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentBookIndex(prev => (prev + 1) % books.length);
    } else {
      setCurrentBookIndex(prev => (prev - 1 + books.length) % books.length);
    }
  };

  // Create new conversation
  const createConversation = async () => {
    if (!message || !conversationId) return;
    
    try {
      await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content: message,
        isUserMessage: true
      });
      
      setMessage('');
      refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Handle character selection
  const handleCharacterSelect = (characterId: number) => {
    setSelectedCharacter(characterId);
    setActiveTab("chat");
  };
  
  // Handle starting a chat
  const handleStartChat = async () => {
    setIsCreatingConversation(true);
    try {
      // Create a conversation with the selected character or librarian
      const characterIds = selectedCharacter !== null ? [selectedCharacter] : [];
      const isLibrarianPresent = selectedCharacter === null || selectedCharacter === 1; // 1 is librarian ID
      
      const conversation = await apiRequest('POST', '/api/conversations', {
        bookId: 1, // Hardcoded for now since we're using book ID 1 on the backend
        title: `Conversation about ${selectedBook.title}`,
        characterIds,
        isLibrarianPresent,
        conversationMode: 'character'
      });
      
      // Navigate to the conversation
      navigate(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsCreatingConversation(false);
    }
  };
  
  return (
    <section className="bg-[#f8f0e3]/30 px-4 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7d8c75]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8b2439]/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-serif font-bold text-center mb-4 text-[#1a3a5f]">Featured Books</h2>
        <div className="h-px w-24 mx-auto bg-[#8b2439]/30 mb-6"></div>
        
        {/* Book navigation controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateBook('prev')}
            className="rounded-full border-[#1a3a5f]/30 hover:bg-[#1a3a5f]/10"
          >
            <ChevronLeft className="h-5 w-5 text-[#1a3a5f]" />
          </Button>
          
          <div className="flex gap-2">
            {books.map((book, index) => (
              <Button
                key={book.id}
                variant="ghost"
                size="sm"
                className={`px-3 py-1 rounded-full transition-all ${
                  index === currentBookIndex 
                    ? `bg-[#1a3a5f] text-white` 
                    : `bg-[#1a3a5f]/10 text-[#1a3a5f] hover:bg-[#1a3a5f]/20`
                }`}
                onClick={() => setCurrentBookIndex(index)}
              >
                {book.title}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateBook('next')}
            className="rounded-full border-[#1a3a5f]/30 hover:bg-[#1a3a5f]/10"
          >
            <ChevronRight className="h-5 w-5 text-[#1a3a5f]" />
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div 
            className="relative w-full md:w-1/3 aspect-[2/3] max-w-xs mx-auto group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* "Available Now" badge */}
            <div className="absolute -top-3 -right-3 z-30">
              <Badge className="bg-[#7d8c75] text-white border-0 shadow-lg animate-pulse-subtle px-3 py-1.5">
                Available Now
              </Badge>
            </div>

            {/* Book Cover with 3D effect */}
            <div className={`absolute inset-0 z-10 rounded-lg shadow-xl transform ${isHovered ? 'translate-y-[-5px] scale-[1.02]' : ''} transition-all duration-300`}>
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a5f]/20 via-transparent to-[#1a3a5f]/70 z-20 rounded-lg"></div>
              <img 
                src={selectedBook.id === "1984" ? "/lovable-uploads/1984-interactive.jpg" : selectedBook.coverImage}
                alt={`${selectedBook.title} Book Cover`}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#1a3a5f]/40 to-transparent rounded-l-lg"></div>
              
              {/* Bottom book info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <p className="text-[#f8f0e3] text-sm flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-[#f8f0e3]/50 rounded-full"></span>
                  <span>Published {selectedBook.publishedYear}</span>
                </p>
              </div>
            </div>
            
            {/* Book shadow and 3D effect */}
            <div className="absolute inset-0 z-0 rounded-lg bg-black/30 blur-lg -bottom-2 scale-[0.95] transform translate-y-4"></div>
          </div>
          
          <div className="md:w-2/3">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1a3a5f] mb-2">{selectedBook.title}</h3>
            <p className="text-xl text-[#8b2439] mb-4">{selectedBook.author}</p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 bg-[#f8f0e3]/50">
                <TabsTrigger value="details" className="data-[state=active]:bg-[#1a3a5f] data-[state=active]:text-white">Book Details</TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-[#1a3a5f] data-[state=active]:text-white">Chat with Characters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="mb-6">
                  <p className="mb-4 text-gray-700 leading-relaxed">
                    {selectedBook.description}
                  </p>
                  
                  {/* Character previews */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <TooltipProvider>
                      {selectedBook.characters.map((character) => (
                        <Tooltip key={character.id}>
                          <TooltipTrigger asChild>
                            <div 
                              className="w-10 h-10 rounded-full bg-[#1a3a5f]/10 flex items-center justify-center hover:bg-[#1a3a5f]/20 transition-colors cursor-pointer"
                              onClick={() => handleCharacterSelect(Number(character.id))}
                            >
                              <User className="h-5 w-5 text-[#1a3a5f]" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="font-medium">{character.name}</p>
                            <p className="text-xs text-muted-foreground">{character.role || 'Click to chat'}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                  
                  {/* Themes */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedBook.themes.slice(0, 4).map((theme) => (
                      <span key={theme} className="px-3 py-1 bg-[#8b2439]/10 text-[#8b2439] text-sm rounded-full">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="gap-2 bg-[#8b2439] hover:bg-[#8b2439]/90"
                    onClick={() => setActiveTab("chat")}
                  >
                    Talk to {selectedBook.title} Characters
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" asChild className="gap-2 border-[#1a3a5f] text-[#1a3a5f] hover:bg-[#1a3a5f]/10">
                    <Link to={`/book/${selectedBook.id}`}>
                      View Book Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Render the librarian first */}
                    <div 
                      className={`border rounded-lg p-3 flex flex-col items-center space-y-2 cursor-pointer transition-colors ${selectedCharacter === 1 ? 'bg-[#1a3a5f]/10 border-[#1a3a5f]' : 'hover:bg-[#f8f0e3]/70 border-transparent'}`}
                      onClick={() => setSelectedCharacter(1)}
                    >
                      <Avatar className="h-12 w-12 rounded-full border border-[#1a3a5f]/20">
                        <User className="h-6 w-6 text-[#1a3a5f]" />
                      </Avatar>
                      <p className="text-sm font-medium text-center">Librarian</p>
                      <p className="text-xs text-center text-muted-foreground">Analysis</p>
                    </div>
                    
                    {/* Render other characters */}
                    {isLoadingCharacters ? (
                      <div className="col-span-4 text-center py-8">
                        <p className="text-muted-foreground">Loading characters...</p>
                      </div>
                    ) : (
                      characters && characters
                        .filter(char => char.id !== 1) // Filter out librarian
                        .map(character => (
                          <div 
                            key={character.id}
                            className={`border rounded-lg p-3 flex flex-col items-center space-y-2 cursor-pointer transition-colors ${selectedCharacter === character.id ? 'bg-[#1a3a5f]/10 border-[#1a3a5f]' : 'hover:bg-[#f8f0e3]/70 border-transparent'}`}
                            onClick={() => setSelectedCharacter(character.id)}
                          >
                            <Avatar className="h-12 w-12 rounded-full border border-[#1a3a5f]/20">
                              <User className="h-6 w-6 text-[#1a3a5f]" />
                            </Avatar>
                            <p className="text-sm font-medium text-center">{character.name}</p>
                            <p className="text-xs text-center text-muted-foreground">{character.role || 'Character'}</p>
                          </div>
                        ))
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedCharacter 
                        ? `Start a conversation with ${selectedCharacter === 1 ? 'the Librarian' : characters?.find(c => c.id === selectedCharacter)?.name || 'this character'}`
                        : 'Select a character to chat with'}
                    </p>
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2 bg-[#8b2439] hover:bg-[#8b2439]/90"
                      onClick={handleStartChat}
                      disabled={isCreatingConversation || selectedCharacter === null}
                    >
                      {isCreatingConversation ? 'Creating...' : 'Start Chat'}
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBookSection;
