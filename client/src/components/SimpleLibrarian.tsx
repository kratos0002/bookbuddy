import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, RefreshCw } from 'lucide-react';
import SuggestionPanel from './chat/suggestions/SuggestionPanel';
import { useBook } from '../contexts/BookContext';
import { getLibrarianName } from '@/lib/bookHelpers';
import { apiRequest } from '@/lib/queryClient';

// Define a message interface
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const SimpleLibrarian: React.FC = () => {
  const { selectedBook } = useBook();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestionsMinimized, setSuggestionsMinimized] = useState(false);

  // Initial welcome message
  useEffect(() => {
    const librarianName = getLibrarianName(Number(selectedBook.id));
    
    setMessages([
      {
        id: 'welcome',
        content: `Hello! I'm ${librarianName}. How can I help you with '${selectedBook.title}' by ${selectedBook.author} today?`,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, [selectedBook.id, selectedBook.title, selectedBook.author]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if response is HTML (indicating an error)
  const isHtmlResponse = (text: string): boolean => {
    return text.trim().startsWith('<!DOCTYPE html>') || 
           text.trim().startsWith('<html') || 
           (text.includes('<head>') && text.includes('<body>'));
  };

  // Send message to the librarian
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Reset any previous API errors
    setApiError(null);

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
      console.log(`Sending request to /api/simple-librarian with bookId: ${Number(selectedBook.id)}`);
      
      // Use the apiRequest helper instead of direct fetch
      const data = await apiRequest(
        'POST',
        '/api/simple-librarian',
        { 
          message: input,
          bookId: Number(selectedBook.id)
        }
      );

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
      
      // Store the error for display
      setApiError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      // Show error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: "I'm sorry, I couldn't process your request. The server returned an invalid response. Please try again later or use a different character.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Try to reconnect/refresh the API
  const handleRetryConnection = async () => {
    setApiError(null);
    setMessages(prev => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        content: "Attempting to reconnect to the server...",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    
    // Use apiRequest helper for ping
    try {
      const pingResponse = await apiRequest('GET', '/api/ping');
      setMessages(prev => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          content: "Connection restored. You can continue your conversation.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          content: "Still having trouble connecting to the server. Please try again later.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const librarianName = getLibrarianName(Number(selectedBook.id));

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
          {apiError && (
            <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-lg">
              <p className="font-semibold">Connection Error</p>
              <p className="text-sm">{apiError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs"
                onClick={handleRetryConnection}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry Connection
              </Button>
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
            placeholder={`Ask ${librarianName} about '${selectedBook.title}'...`}
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