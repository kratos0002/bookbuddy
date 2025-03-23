import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define a message interface
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const SimpleLibrarian: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      content: 'Hello! I\'m Alexandria, the AI Librarian. I can answer your questions about George Orwell\'s "1984". What would you like to know?',
      isUser: false,
      timestamp: new Date()
    }]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call the simple librarian API
      const response = await fetch('/api/simple-librarian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add librarian response
      const librarianMessage: Message = {
        id: Date.now().toString(),
        content: data.response || "I apologize, but I'm unable to provide a response at this time.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, librarianMessage]);
    } catch (error) {
      console.error('Error calling librarian API:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-sm bg-card overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b flex items-center bg-muted/30">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/librarian-avatar.png" alt="Alexandria" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <h2 className="font-medium">Alexandria, the AI Librarian</h2>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`p-4 max-w-[80%] ${
                msg.isUser 
                  ? 'ml-auto bg-primary text-primary-foreground' 
                  : 'mr-auto'
              }`}
            >
              <div className="flex items-start gap-3">
                {!msg.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/librarian-avatar.png" alt="Alexandria" />
                    <AvatarFallback><BookOpen size={14} /></AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <small className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </small>
                </div>
              </div>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Alexandria about 1984..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-book-primary text-white hover:bg-book-primary/90 transition-colors"
        >
          {isLoading ? 'Thinking...' : <Send size={16} />}
        </Button>
      </form>
    </div>
  );
};

export default SimpleLibrarian; 