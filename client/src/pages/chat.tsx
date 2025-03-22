import { useState, useEffect, useRef } from "react";
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
import { Send, ArrowLeft, Info } from "lucide-react";

export default function ChatPage() {
  const { id } = useParams();
  const conversationId = id ? parseInt(id) : null;
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  const { data: messages = [], isLoading: isLoadingMessages, error: messagesError } = useQuery<Message[]>({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    enabled: !!conversationId,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
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
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', conversationId, 'messages'] });
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
  
  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
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
        // Return character image if available, or initial letter
        return character.imageUrl || null;
      }
    }
    
    return null;
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
                        {personas.find(p => p.characterId === selectedCharacterId)?.description}
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
            {messages && messages.length > 0 ? (
              messages.map((message: Message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.isUserMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className={`h-8 w-8 ${message.isUserMessage ? 'ml-2' : 'mr-2'}`}>
                      <AvatarImage src={getSenderImage(message.senderId)} />
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
              ))
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
                placeholder="Type your message..."
                className="flex-1"
                disabled={sendMessage.isPending}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!messageInput.trim() || sendMessage.isPending}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}