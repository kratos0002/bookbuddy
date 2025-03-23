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
    <section className="bg-muted/30 px-4 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-book-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-book-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl font-serif font-semibold text-center mb-4">Featured Book</h2>
        <div className="h-px w-24 mx-auto bg-book-primary/30 mb-12"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Book Details</TabsTrigger>
                <TabsTrigger value="chat">Chat with Characters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
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
                            <div 
                              className="w-10 h-10 rounded-full bg-book-primary/10 flex items-center justify-center hover:bg-book-primary/20 transition-colors cursor-pointer"
                              onClick={() => handleCharacterSelect(Number(character.id))}
                            >
                              <User className="h-5 w-5 text-book-primary" />
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
                      <span key={theme} className="px-3 py-1 bg-book-primary/10 text-book-primary text-sm rounded-full">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="gap-2"
                    onClick={() => setActiveTab("chat")}
                  >
                    Talk to 1984 Characters
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" asChild className="gap-2">
                    <Link to={`/book/${selectedBook.id}`}>
                      View Book Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="space-y-4">
                {!conversationId ? (
                  <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h4 className="text-lg font-medium mb-4">Who would you like to chat with?</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Array.isArray(characters) && characters.length > 0 ? (
                        characters.map((char: Character) => (
                          <Button
                            key={char.id}
                            variant={selectedCharacter === char.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => handleCharacterSelect(char.id)}
                            disabled={isCreatingConversation}
                          >
                            {char.name || `Character ${char.id}`}
                          </Button>
                        ))
                      ) : (
                        <div className="col-span-full text-center p-4 border rounded">
                          {isLoadingCharacters ? "Loading characters..." : "No characters found. Please check API connection."}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat interface */}
                    <div className="flex flex-col border rounded-lg bg-white shadow-sm overflow-hidden">
                      {/* Chat header */}
                      <div className="p-3 bg-muted border-b flex items-center">
                        <h4 className="font-medium">
                          Chatting with {characters?.find(c => c.id === selectedCharacter)?.name || 'Character'}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={() => setConversationId(null)}
                        >
                          New Chat
                        </Button>
                      </div>
                      
                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4 h-[400px] min-h-[400px]">
                        <div className="space-y-4">
                          {messages && messages.length > 0 ? (
                            messages.map((msg: Message) => (
                              <Card
                                key={msg.id}
                                className={`p-4 max-w-[85%] ${msg.isUserMessage ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto'}`}
                              >
                                <div className="flex items-start gap-3">
                                  {!msg.isUserMessage && (
                                    <Avatar className="w-8 h-8">
                                      <img src={characters?.find(c => c.id === msg.senderId)?.avatarUrl} alt="Character" />
                                    </Avatar>
                                  )}
                                  <div>
                                    <p>{msg.content}</p>
                                    <small className="text-xs opacity-70">
                                      {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ''}
                                    </small>
                                  </div>
                                </div>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center text-muted-foreground p-4">
                              Start a conversation with {characters?.find(c => c.id === selectedCharacter)?.name}
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      {/* Message input */}
                      <div className="p-4 border-t">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                          }}
                          className="flex gap-2"
                        >
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1"
                          />
                          <Button type="submit">Send</Button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBookSection;
