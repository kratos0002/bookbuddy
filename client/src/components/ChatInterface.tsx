import React, { useState, useRef, useEffect } from 'react';
import { useBook, Message } from '../contexts/BookContext';
import MessageComponent from './Message';
import { Send, HelpCircle, BookText, ArrowRight } from 'lucide-react';

const CONVERSATION_STARTERS = [
  "What was life like in Oceania?",
  "Tell me about the Party and Big Brother",
  "What's your perspective on doublethink?",
  "How does the telescreen surveillance work?"
];

const ChatInterface: React.FC = () => {
  const { selectedBook, selectedCharacter, messages, addMessage } = useBook();
  const [input, setInput] = useState('');
  const [showStarters, setShowStarters] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Simulate response from selected character or librarian
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getSimulatedResponse(input, selectedCharacter?.id || 'librarian'),
        sender: selectedCharacter?.id === 'librarian' ? 'librarian' : 'character',
        timestamp: new Date(),
        characterId: selectedCharacter?.id
      };
      addMessage(responseMessage);
    }, 1000);

    setInput('');
    setShowStarters(false);
  };

  const selectStarterQuestion = (question: string) => {
    setInput(question);
    setShowStarters(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm relative">
      <div className="p-3 border-b bg-muted/30 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-book-primary animate-pulse-subtle"></div>
          <h2 className="text-sm font-medium">
            {selectedCharacter ? `Chatting with ${selectedCharacter.name}` : 'Select a character to begin'}
          </h2>
        </div>
        <button 
          onClick={() => setShowStarters(!showStarters)}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
          title="Conversation starters"
        >
          <HelpCircle size={16} />
        </button>
      </div>
      
      {/* Conversation starters dropdown */}
      {showStarters && selectedCharacter && (
        <div className="absolute top-12 right-3 z-10 w-72 rounded-md border bg-card shadow-lg py-2 px-1 animate-scale-in">
          <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Conversation Starters</p>
          <div className="mt-1 space-y-1">
            {CONVERSATION_STARTERS.map((starter, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-md flex items-center justify-between transition-colors"
                onClick={() => selectStarterQuestion(starter)}
              >
                <span>{starter}</span>
                <ArrowRight size={12} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar"
        style={{
          backgroundImage: `
            url('/texture-paper.jpg'), 
            linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), 
            url('/lovable-uploads/7e031689-7e0f-4fdd-8171-d84ee50a4577.png')
          `,
          backgroundBlendMode: "overlay, normal, normal",
          backgroundSize: "cover, cover, contain",
          backgroundPosition: "center, center, center",
          backgroundAttachment: "fixed, fixed, fixed",
          backgroundRepeat: "repeat, no-repeat, no-repeat"
        }}
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <div className="w-16 h-16 mb-4 opacity-20">
              <BookText size={64} strokeWidth={1} />
            </div>
            <p className="mb-4 text-lg font-medium tracking-tight">Welcome to BookBuddy</p>
            <p className="text-sm max-w-md">
              Select a character and start a conversation about "{selectedBook.title}" by {selectedBook.author}.
              {!selectedCharacter && <span className="block mt-2 text-book-primary">↓ Choose a character below to begin ↓</span>}
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2 bg-card">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedCharacter ? `Ask ${selectedCharacter.name} about ${selectedBook.title}...` : "Select a character to begin..."}
          className="flex-1 px-4 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-book-primary"
          disabled={!selectedCharacter}
        />
        <button
          type="submit"
          disabled={!selectedCharacter || !input.trim()}
          className="px-4 py-2 rounded-md bg-book-primary text-white font-medium hover:bg-book-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <span className="hidden sm:inline">Send</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

// Helper function to simulate responses
function getSimulatedResponse(question: string, characterId: string): string {
  if (characterId === 'librarian') {
    return `As a literary guide, I can tell you that this question about "${question}" touches on important themes in 1984. The novel explores totalitarianism, surveillance, and the manipulation of truth. Would you like to explore any of these themes further?`;
  } else if (characterId === 'winston') {
    return `${question}? Well, I must be careful what I say. The telescreen might be watching. But between us, I've been thinking a lot about history lately, and how the Party controls it. Sometimes I wonder if anything they tell us is true at all.`;
  } else if (characterId === 'julia') {
    return `I don't care much about ${question} or any of that political nonsense. The Party can't control everything - they can't stop us from living, from finding small pleasures. That's my rebellion.`;
  } else if (characterId === 'obrien') {
    return `An interesting question about ${question}. The Party is interested in your thoughts on this matter. Perhaps we should discuss this further at the Ministry. Remember, Big Brother is watching.`;
  }
  return "I'm not sure how to respond to that.";
}

export default ChatInterface;
