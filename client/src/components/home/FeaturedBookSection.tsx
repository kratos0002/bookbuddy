import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, User, MessageCircle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useBook } from '../../contexts/BookContext';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { books } from '@/data/books';

interface Message {
  id: number;
  content: string;
  isUserMessage: boolean;
  senderId?: number;
  sentAt: string;
}

interface Character {
  id: number;
  name: string;
  avatarUrl?: string;
}

const FeaturedBookSection = () => {
  const { selectedBook, setSelectedBook } = useBook();
  const [currentBookIndex, setCurrentBookIndex] = useState(() => {
    return books.findIndex(book => book.id === selectedBook.id);
  });
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [message, setMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Update the selected book when the current book index changes
  useEffect(() => {
    setSelectedBook(books[currentBookIndex >= 0 ? currentBookIndex : 0]);
  }, [currentBookIndex, setSelectedBook]);

  // Simple book navigation
  const navigateBook = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentBookIndex(prev => (prev + 1) % books.length);
    } else {
      setCurrentBookIndex(prev => (prev - 1 + books.length) % books.length);
    }
  };
  
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

  // Create new conversation
  const createConversation = async (characterId: number) => {
    setIsCreatingConversation(true);
    
    try {
      const response = await apiRequest(
        'POST',
        '/api/conversations',
        {
          bookId: 1,
          characterIds: [characterId],
          isLibrarianPresent: false,
          conversationMode: 'character',
          userId: 1,
          title: `Chat with ${characters?.find(c => c.id === characterId)?.name || 'Character'}`
        }
      );

      // Set the conversation ID
      if (response && response.id) {
        setConversationId(response.id);
      }
      return response;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    try {
      const response = await apiRequest(
        'POST',
        `/api/conversations/${conversationId}/messages`,
        {
          content: message,
          isUserMessage: true,
        }
      );

      setMessage('');
      refetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handler for selecting a character
  const handleCharacterSelect = async (characterId: number) => {
    setSelectedCharacter(characterId);
    if (!conversationId) {
      await createConversation(characterId);
    }
    setActiveTab("chat");
  };
  
  // Handle starting a chat with a specific character
  const startChatWithCharacter = (characterId: string | number) => {
    navigate(`/conversation?bookId=${selectedBook.id}&characterId=${characterId}`);
  };
  
  // Handle starting a chat with the librarian
  const startChatWithLibrarian = () => {
    navigate(`/conversation?bookId=${selectedBook.id}`);
  };
  
  return (
    <section id="featured-books" className="bg-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-8 text-[#1a3a5f]">Available Books</h2>
        
        {/* Book navigation */}
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
        
        {/* Book display and character selection */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Book cover */}
          <div className="w-full md:w-1/3 max-w-[250px]">
            <div className="relative aspect-[2/3] rounded-lg shadow-lg overflow-hidden">
              <img 
                src={selectedBook.coverImage || `/lovable-uploads/1984-interactive.jpg`}
                alt={`${selectedBook.title} Book Cover`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-lg">{selectedBook.title}</h3>
                <p className="text-sm opacity-90">{selectedBook.author}</p>
                <p className="text-xs opacity-75">Published {selectedBook.publishedYear}</p>
              </div>
            </div>
          </div>
          
          {/* Book info and character selection */}
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-3 text-[#1a3a5f]">{selectedBook.title}</h3>
            <p className="text-sm mb-4 max-w-2xl">{selectedBook.description || "Explore this classic work through conversations with its characters or with our literary librarian."}</p>
            
            <div className="space-y-6">
              {/* Librarian chat option */}
              <div className="p-4 bg-[#f8f0e3]/30 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-[#8b2439]" />
                  Chat with the Librarian
                </h4>
                <p className="text-sm mb-3">Get scholarly insights, analysis, and context about the book.</p>
                <Button 
                  onClick={startChatWithLibrarian}
                  className="bg-[#8b2439] hover:bg-[#8b2439]/90 text-white w-full sm:w-auto"
                >
                  Start Librarian Chat
                </Button>
              </div>
              
              {/* Character chat options */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#1a3a5f]" />
                  Chat with Characters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBook.characters.map((character) => (
                    <div 
                      key={character.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => startChatWithCharacter(character.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-[#1a3a5f]/10">
                          <div className="text-xs font-medium text-[#1a3a5f]">
                            {character.name.charAt(0)}
                          </div>
                        </Avatar>
                        <div>
                          <p className="font-medium">{character.name}</p>
                          <p className="text-xs text-gray-500">{character.role || "Character"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Direct book link */}
              <Button 
                variant="outline" 
                className="mt-4 border-[#1a3a5f] text-[#1a3a5f]"
                onClick={() => navigate(`/book/${selectedBook.id}`)}
              >
                <div className="flex items-center gap-2">
                  Explore Full Book Page
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBookSection;
