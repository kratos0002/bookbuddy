import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
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

  // Fetch conversation
  const { data: conversation } = useQuery({
    queryKey: ['/api/conversations', conversationId],
    queryFn: () => apiRequest('GET', `/api/conversations/${conversationId}`),
    enabled: !!conversationId,
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
  const createConversation = async () => {
    if (!selectedCharacter) return null;
    
    setIsCreatingConversation(true);
    try {
      const response = await apiRequest(
        'POST',
        '/api/conversations',
        {
          bookId: 1,
          characterIds: [selectedCharacter],
          isLibrarianPresent: false,
          conversationMode: 'character',
          userId: 1,
          title: `Chat with ${characters?.find(c => c.id === selectedCharacter)?.name || 'Character'}`
        }
      );

      // Navigate to the new conversation
      if (response && response.id) {
        navigate(`/chat/${response.id}`);
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

  // If there's no conversation ID, show character selection to start a new conversation
  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-muted/30 p-4">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Start a new conversation</h1>
          
          {isLoadingCharacters ? (
            <div className="text-center p-4">Loading characters...</div>
          ) : (
            <>
              <p className="text-muted-foreground mb-4 text-center">Select a character to chat with</p>
              
              {/* Debug info */}
              <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded overflow-auto max-h-20">
                Characters: {characters ? characters.length : 0} found
                {characters && characters.length === 0 && " (no characters available)"}
              </div>
              
              <div className="space-y-2 mb-6">
                {Array.isArray(characters) && characters.length > 0 ? (
                  characters.map((char: Character) => (
                    <Button
                      key={char.id}
                      variant={selectedCharacter === char.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCharacter(char.id)}
                    >
                      {char.name || `Character ${char.id}`}
                    </Button>
                  ))
                ) : (
                  <div className="text-center p-4 border rounded">
                    No characters found. Please check API connection.
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                disabled={!selectedCharacter || isCreatingConversation}
                onClick={createConversation}
              >
                {isCreatingConversation ? "Creating..." : "Start Conversation"}
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Character selection sidebar */}
      <div className="w-64 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Characters</h2>
        <div className="space-y-2">
          {characters?.map((char: Character) => (
            <Button
              key={char.id}
              variant={selectedCharacter === char.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedCharacter(char.id)}
            >
              {char.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages?.map((msg: Message) => (
              <Card
                key={msg.id}
                className={`p-4 ${msg.isUserMessage ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto'}`}
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
            ))}
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
    </div>
  );
}