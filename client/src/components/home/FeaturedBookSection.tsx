import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, User, MessageCircle } from 'lucide-react';
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
  const { selectedBook } = useBook();
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [message, setMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  
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
  
  return (
    <section id="featured-books-section" className="bg-[#f8f0e3]/30 px-4 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7d8c75]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8b2439]/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-serif font-bold text-center mb-4 text-[#1a3a5f]">Featured Book</h2>
        <div className="h-px w-24 mx-auto bg-[#8b2439]/30 mb-12"></div>
        
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
                src="/lovable-uploads/1984-interactive.jpg"
                alt="1984 Book Cover"
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
                <TabsTrigger value="chat" className="data-[state=active]:bg-[#8b2439] data-[state=active]:text-white w-full">Chat with Characters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="mb-6">
                  <p className="mb-4 text-gray-700 leading-relaxed">
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
                            <div 
                              className="w-10 h-10 rounded-full bg-[#8b2439]/10 flex items-center justify-center hover:bg-[#8b2439]/20 transition-colors cursor-pointer"
                              onClick={() => handleCharacterSelect(Number(character.id))}
                            >
                              <User className="h-5 w-5 text-[#8b2439]" />
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
                    asChild
                    className="gap-2 bg-[#8b2439] hover:bg-[#8b2439]/90 w-full sm:w-auto"
                  >
                    <Link to={`/book/${selectedBook.id}`}>
                      Chat with Characters
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="space-y-4">
                {!conversationId ? (
                  <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h4 className="text-lg font-medium mb-4 text-[#8b2439]">Who would you like to chat with?</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Array.isArray(characters) && characters.length > 0 ? (
                        characters.map((char: Character) => (
                          <Button
                            key={char.id}
                            variant="outline"
                            className="h-auto py-4 px-3 flex flex-col items-center justify-center border-[#8b2439]/20 hover:bg-[#8b2439]/5 hover:border-[#8b2439]/30"
                            disabled={isCreatingConversation}
                            onClick={() => handleCharacterSelect(char.id)}
                          >
                            <div className="w-12 h-12 rounded-full bg-[#8b2439]/10 flex items-center justify-center mb-2">
                              {char.avatarUrl ? (
                                <img 
                                  src={char.avatarUrl} 
                                  alt={char.name} 
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <User className="h-6 w-6 text-[#8b2439]" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-[#8b2439]">{char.name}</span>
                          </Button>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-4 text-[#8b2439]">
                          {isLoadingCharacters ? "Loading characters..." : "No characters available"}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="px-4 py-3 bg-[#8b2439] text-white">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        <span>Chat with {characters?.find(c => c.id === selectedCharacter)?.name || 'Character'}</span>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-52 p-4">
                      {messages?.length > 0 ? (
                        <div className="space-y-4">
                          {messages.map((message: Message) => (
                            <div 
                              key={message.id} 
                              className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[80%] p-3 rounded-lg ${
                                message.isUserMessage 
                                  ? 'bg-[#8b2439]/10 text-[#8b2439]' 
                                  : 'bg-[#8b2439]/10 text-[#8b2439]'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Start your conversation with a message...</p>
                        </div>
                      )}
                    </ScrollArea>
                    
                    <div className="p-3 border-t">
                      <form 
                        className="flex gap-2" 
                        onSubmit={(e) => {
                          e.preventDefault();
                          sendMessage();
                        }}
                      >
                        <Input 
                          value={message} 
                          onChange={(e) => setMessage(e.target.value)} 
                          placeholder="Type your message..." 
                          className="border-[#8b2439]/20 focus-visible:ring-[#8b2439]/30"
                        />
                        <Button 
                          type="submit"
                          size="icon"
                          className="bg-[#8b2439] hover:bg-[#8b2439]/90"
                          disabled={!message.trim()}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Note: This is just a preview, suggest checking full experience */}
                <div className="text-center mt-8">
                  <p className="text-sm text-[#8b2439]/70 mb-3">
                    This is just a preview of the conversation experience.
                  </p>
                  <Link to="/conversation">
                    <Button variant="outline" size="sm" className="gap-2 border-[#8b2439]/20 text-[#8b2439] hover:bg-[#8b2439]/5">
                      Go to full conversation page
                    </Button>
                  </Link>
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
