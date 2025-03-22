import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Conversation, Message, ChatModes, Character, CharacterPersona } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, ArrowLeft, Info, Loader2 } from "lucide-react";

export default function ChatPage() {
  const { id } = useParams();
  const conversationId = id ? parseInt(id) : null;
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Track when we're waiting for an AI response
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<Date | null>(null);
  
  // Directly fetch messages (as a backup to the React Query)
  const [directMessages, setDirectMessages] = useState<Message[]>([]);
  
  // Also trigger fetchMessages when sending a new message
  const [triggerRefetch, setTriggerRefetch] = useState(0);

  // Default to create a new conversation if no ID is provided
  const isNewConversation = !conversationId;
  
  // Character selection for new conversation
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(1); // Default to Winston
  const [conversationMode, setConversationMode] = useState<string>(ChatModes.CHARACTER);
  const [isLibrarianMode, setIsLibrarianMode] = useState<boolean>(false);
  
  // Get available characters
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/books/1/characters'],
    enabled: isNewConversation,
  });
  
  // Get character personas
  const { data: personas = [] } = useQuery<CharacterPersona[]>({
    queryKey: ['/api/character-personas'],
    enabled: isNewConversation,
  });
  
  // Get conversation details if we have an ID
  const { data: conversation, isLoading: isLoadingConversation } = useQuery<Conversation>({
    queryKey: ['/api/conversations', conversationId],
    enabled: !!conversationId,
  });
  
  // Get messages for this conversation
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages, 
    error: messagesError,
    refetch: refetchMessages
  } = useQuery<Message[]>({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    enabled: !!conversationId,
    // Override the default staleTime and refetchInterval for this query
    staleTime: 1000,
    refetchInterval: 2000, // Poll more frequently - every 2 seconds
    refetchIntervalInBackground: true
  });
  
  // Create a new conversation
  const createConversation = useMutation({
    mutationFn: async (newConvo: {
      userId: number;
      bookId: number;
      title: string;
      characterIds: number[] | number;
      isLibrarianPresent: boolean;
      conversationMode: string;
    }) => {
      const response = await apiRequest(
        'POST',
        '/api/conversations',
        newConvo
      );
      return await response.json();
    },
    onSuccess: (data) => {
      // Navigate to the new conversation
      window.history.pushState({}, '', `/chat/${data.id}`);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    }
  });
  
  // Send a message
  const sendMessage = useMutation({
    mutationFn: async (message: {
      content: string;
      isUserMessage: boolean;
      senderId?: number | null;
    }) => {
      if (!conversationId) {
        throw new Error("No conversation ID");
      }
      
      console.log(`Sending message to conversation ${conversationId}:`, message);
      
      const response = await apiRequest(
        'POST',
        `/api/conversations/${conversationId}/messages`,
        message
      );
      
      const responseData = await response.json();
      console.log("Message sent successfully, response:", responseData);
      return responseData;
    },
    onSuccess: (data) => {
      console.log("Message mutation completed successfully:", data);
      // Clear the input
      setMessageInput("");
      
      // Set waiting for response state
      setIsWaitingForResponse(true);
      setLastMessageTimestamp(new Date());
      
      // Immediately refetch to show the user's message
      refetchMessages();
      
      // Also manually fetch messages with our direct fetch approach
      fetchMessages();
      
      // Trigger additional refetches with timer
      setTriggerRefetch(prev => prev + 1);
      
      // Start polling more aggressively for the AI response
      const checkForResponse = async () => {
        try {
          // First try direct fetch
          await fetchMessages();
          
          // Check if we have received an AI response in directMessages
          if (directMessages.length >= 2) {
            const userMessageIndex = directMessages.findIndex(m => m.id === data.id);
            const hasAIResponse = userMessageIndex >= 0 && userMessageIndex < directMessages.length - 1;
            
            if (hasAIResponse) {
              // We got a response, stop waiting
              setIsWaitingForResponse(false);
              return;
            }
          }
          
          // Also check with React Query
          // Use separate try/catch to prevent type errors
          try {
            const result = await refetchMessages();
            if (result && result.data && Array.isArray(result.data)) {
              const newMessages = result.data as Message[];
              if (newMessages.length >= 2) {
                // Find the user message by comparing the content and timestamps
                const userMessage = newMessages.find(m => 
                  m.isUserMessage && m.content === messageInput.trim()
                );
                
                if (userMessage) {
                  // Found matching user message, see if there's a response after it
                  const responseExists = newMessages.some(m => 
                    !m.isUserMessage && 
                    new Date(m.sentAt).getTime() > new Date(userMessage.sentAt).getTime()
                  );
                  
                  if (responseExists) {
                    setIsWaitingForResponse(false);
                    return;
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error processing React Query results:", err);
          }
          
          // If we got here, no response was found
          const waitingTime = new Date().getTime() - (lastMessageTimestamp?.getTime() || 0);
          
          // No response yet, check again if we haven't been waiting too long
          if (waitingTime < 20000) { // Stop checking after 20 seconds to avoid infinite polling
            setTimeout(checkForResponse, 1000);
          } else {
            setIsWaitingForResponse(false);
            toast({
              title: "Response Timeout",
              description: "The AI is taking too long to respond. Try refreshing the page.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error checking for response:", error);
          // Continue polling even if this check failed
          const waitingTime = new Date().getTime() - (lastMessageTimestamp?.getTime() || 0);
          if (waitingTime < 20000) {
            setTimeout(checkForResponse, 1000);
          } else {
            setIsWaitingForResponse(false);
          }
        }
      };
      
      // Start checking for response
      setTimeout(checkForResponse, 1000);
    },
    onError: (error) => {
      console.error("Error in send message mutation:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  });
  
  // Start a new conversation
  const handleStartConversation = () => {
    if (isNewConversation) {
      createConversation.mutate({
        userId: 1, // Default user for now
        bookId: 1, // Default to 1984
        title: `Conversation about 1984 - ${new Date().toLocaleString()}`,
        characterIds: isLibrarianMode ? [] : [selectedCharacterId],
        isLibrarianPresent: isLibrarianMode,
        conversationMode: conversationMode,
      });
    }
  };
  
  // Send a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // If this is a new conversation, start it first
    if (isNewConversation) {
      handleStartConversation();
      return;
    }
    
    sendMessage.mutate({
      content: messageInput,
      isUserMessage: true,
      senderId: null,
    });
  };
  
  // Direct fetch function for messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Directly fetched messages:", data);
      setDirectMessages(data);
    } catch (error) {
      console.error("Error directly fetching messages:", error);
    }
  }, [conversationId]);
  
  // Fetch messages on mount and after sending a message
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      // Set up polling interval
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [conversationId, fetchMessages, triggerRefetch]);
  
  // Scroll to bottom of messages when new ones arrive or waiting state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, directMessages, isWaitingForResponse]);
  
  // Get the character name for display
  const getCharacterName = (senderId: number | null) => {
    if (!senderId) return "You";
    
    if (characters && Array.isArray(characters) && characters.length > 0) {
      const character = characters.find((c: Character) => c.id === senderId);
      return character ? character.name : "Unknown Character";
    }
    
    return "Character";
  };
  
  // Get character or librarian image
  const getSenderImage = (senderId: number | null) => {
    if (!senderId) return "/user-avatar.png"; // Default user avatar
    
    if (characters && Array.isArray(characters) && characters.length > 0) {
      const character = characters.find((c: Character) => c.id === senderId);
      if (character) {
        // Try to find character persona with avatar
        const persona = personas?.find((p: CharacterPersona) => p.characterId === senderId);
        return persona?.avatarUrl || "/default-character.png"; // Use a default image instead of null
      }
    }
    
    return "/default-character.png"; // Default character avatar
  };
  
  // Loading state
  if ((conversationId && (isLoadingConversation || isLoadingMessages)) || createConversation.isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Loading conversation...</h2>
          <p className="text-muted-foreground">Please wait while we retrieve your conversation.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b p-4 bg-background shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold">
              {isNewConversation ? "New Conversation" : (conversation ? conversation.title : "BookBuddy Chat")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isNewConversation 
                ? "Start chatting with a character or the librarian" 
                : (conversation?.isLibrarianPresent 
                  ? "Chatting with Alexandria, the AI Librarian" 
                  : `Chatting with ${getCharacterName(conversation?.characterIds as number)}`)}
            </p>
          </div>
        </div>
        
        <Button variant="outline" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </header>
      
      {isNewConversation ? (
        /* New conversation setup */
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Start a New Conversation</h2>
            
            <Tabs defaultValue="character" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="character" 
                  onClick={() => {
                    setIsLibrarianMode(false);
                    setConversationMode(ChatModes.CHARACTER);
                  }}
                >
                  Chat with Character
                </TabsTrigger>
                <TabsTrigger 
                  value="librarian" 
                  onClick={() => {
                    setIsLibrarianMode(true);
                    setConversationMode(ChatModes.ANALYSIS);
                  }}
                >
                  Chat with Librarian
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="character" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Select a character from 1984:</p>
                    <Select value={selectedCharacterId.toString()} onValueChange={(val) => setSelectedCharacterId(parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a character" />
                      </SelectTrigger>
                      <SelectContent>
                        {characters?.map((character) => (
                          <SelectItem key={character.id} value={character.id.toString()}>
                            {character.name} ({character.affiliation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {personas?.find(p => p.characterId === selectedCharacterId) && (
                    <div className="bg-muted/50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">Character Profile:</h3>
                      <p className="text-sm text-muted-foreground">
                        {personas.find(p => p.characterId === selectedCharacterId)?.personalityTraits || 'No profile available.'}
                      </p>
                    </div>
                  )}
                  
                  <Button className="w-full" onClick={handleStartConversation}>
                    Start Conversation
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="librarian" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/librarian-avatar.png" alt="Alexandria" />
                      <AvatarFallback>AL</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Alexandria</h3>
                      <p className="text-sm text-muted-foreground">AI Literary Guide</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Alexandria is an AI literary expert who can provide insights, analysis, and context
                      about "1984". Ask about themes, characters, historical context, or literary significance.
                    </p>
                  </div>
                  
                  <Button className="w-full" onClick={handleStartConversation}>
                    Chat with Alexandria
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        /* Existing conversation */
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {directMessages.length > 0 ? (
              <>
                {directMessages.map((message: Message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[80%] ${message.isUserMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className={`h-8 w-8 ${message.isUserMessage ? 'ml-2' : 'mr-2'}`}>
                        {getSenderImage(message.senderId) && (
                          <AvatarImage src={getSenderImage(message.senderId) as string} />
                        )}
                        <AvatarFallback>
                          {getCharacterName(message.senderId)?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`px-4 py-2 rounded-lg ${
                          message.isUserMessage 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-xs mb-1">
                          {getCharacterName(message.senderId)}
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show typing indicator when waiting for AI response */}
                {isWaitingForResponse && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] flex-row">
                      <Avatar className="h-8 w-8 mr-2">
                        {conversation?.isLibrarianPresent ? (
                          <AvatarImage src="/librarian-avatar.png" alt="Alexandria" />
                        ) : (
                          <AvatarImage 
                            src={getSenderImage(conversation?.characterIds as number) as string} 
                            alt={getCharacterName(conversation?.characterIds as number)}
                          />
                        )}
                        <AvatarFallback>
                          {conversation?.isLibrarianPresent ? 'A' : 
                            getCharacterName(conversation?.characterIds as number)?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="px-4 py-2 rounded-lg bg-muted">
                        <div className="text-xs mb-1">
                          {conversation?.isLibrarianPresent 
                            ? 'Alexandria' 
                            : getCharacterName(conversation?.characterIds as number)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          <span className="ml-2 text-xs text-muted-foreground">thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <form onSubmit={handleSendMessage} className="border-t p-4 bg-background">
            <div className="flex items-center space-x-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={isWaitingForResponse ? "Waiting for response..." : "Type your message..."}
                className="flex-1"
                disabled={sendMessage.isPending || isWaitingForResponse}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!messageInput.trim() || sendMessage.isPending || isWaitingForResponse}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}