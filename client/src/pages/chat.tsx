import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useParams } from 'react-router-dom';
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
  const [message, setMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch characters
  const { data: characters } = useQuery({
    queryKey: ['/api/books/1/characters'],
    queryFn: () => apiRequest('GET', '/api/books/1/characters'),
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
    const response = await apiRequest(
      'POST',
      '/api/conversations',
      {
        bookId: 1,
        characterIds: selectedCharacter ? [selectedCharacter] : [],
        isLibrarianPresent: !selectedCharacter,
        conversationMode: selectedCharacter ? 'character' : 'analysis',
      }
    );

    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    return response;
  };

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !conversationId) return;

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
  };

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
                      {new Date(msg.sentAt).toLocaleTimeString()}
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
              if (!conversationId) {
                createConversation().then(() => sendMessage());
              } else {
                sendMessage();
              }
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