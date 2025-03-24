import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import SuggestionPanel from './chat/suggestions/SuggestionPanel';

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
  const [suggestionsMinimized, setSuggestionsMinimized] = useState(false);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        content: "Hello! I'm Alexandria, the AI Librarian. How can I help you with '1984' by George Orwell today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to the librarian
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to the simple librarian API
      const response = await fetch('/api/simple-librarian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      if (data.success) {
        // Add librarian response
        const librarianMessage: Message = {
          id: `librarian-${Date.now()}`,
          content: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, librarianMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error getting librarian response:', error);
      // Show error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: "I'm sorry, I couldn't process your request. Please try again later.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-full border rounded-md bg-background shadow">
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-amber-100 text-amber-900 p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center">
                  <div className="dot-flashing"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Panel for Librarian */}
        <SuggestionPanel
          characterId={null} // null for librarian
          messageCount={messages.length}
          onSuggestionClick={handleSuggestionClick}
          minimized={suggestionsMinimized}
          onToggleMinimize={() => setSuggestionsMinimized(!suggestionsMinimized)}
          className="mt-auto"
        />
        
        <form onSubmit={handleSendMessage} className="mt-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Alexandria about '1984'..."
            className="w-full"
            disabled={isLoading}
          />
          <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SimpleLibrarian; 