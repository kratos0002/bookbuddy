
import React from 'react';
import { Message } from '../contexts/BookContext';
import { useBook } from '../contexts/BookContext';
import { AlertCircle, User, Users, BookOpen } from 'lucide-react';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const { selectedBook } = useBook();
  
  // Find character information if this is a character message
  const character = message.characterId ? 
    selectedBook.characters.find(c => c.id === message.characterId) : null;
  
  const isUser = message.sender === 'user';
  const isLibrarian = message.sender === 'librarian';
  
  // Style based on sender
  const containerClasses = `max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'} message-appear`;
  
  // Custom styling for different senders
  const getBubbleClasses = () => {
    if (isUser) {
      return 'bg-book-primary text-white rounded-2xl rounded-tr-sm p-3 shadow-sm border border-book-primary/20';
    } else if (isLibrarian) {
      return 'bg-accent text-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-accent/20';
    } else if (character?.id === 'winston') {
      return 'bg-secondary text-foreground rounded-2xl rounded-tl-sm p-3 shadow-sm border border-muted/50';
    } else if (character?.id === 'julia') {
      return 'bg-[#D4A29C]/20 text-foreground rounded-2xl rounded-tl-sm p-3 shadow-sm border border-[#D4A29C]/30';
    } else if (character?.id === 'obrien') {
      return 'bg-[#2D2D2D] text-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-[#2D2D2D]/50';
    } else {
      return 'bg-secondary text-foreground rounded-2xl rounded-tl-sm p-3 shadow-sm border';
    }
  };

  // Character-specific icons
  const getCharacterIcon = () => {
    if (isLibrarian) return <BookOpen size={14} />;
    if (character?.id === 'winston') return <User size={14} />;
    if (character?.id === 'julia') return <User size={14} />;
    if (character?.id === 'obrien') return <AlertCircle size={14} />;
    return <Users size={14} />;
  };
  
  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex items-center gap-2 mb-1 ml-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            isLibrarian 
              ? 'bg-accent/20 text-accent' 
              : character?.id === 'winston'
                ? 'bg-secondary text-foreground'
                : character?.id === 'julia'
                  ? 'bg-[#D4A29C]/20 text-[#D4A29C]'
                  : character?.id === 'obrien'
                    ? 'bg-[#2D2D2D]/90 text-white'
                    : 'bg-muted text-muted-foreground'
          }`}>
            {getCharacterIcon()}
          </div>
          <span className={`text-xs font-medium ${
            isLibrarian 
              ? 'text-accent' 
              : character?.id === 'winston'
                ? 'text-foreground'
                : character?.id === 'julia'
                  ? 'text-[#D4A29C]'
                  : character?.id === 'obrien'
                    ? 'text-[#2D2D2D]'
                    : 'text-muted-foreground'
          }`}>
            {isLibrarian ? 'Librarian' : character?.name}
          </span>
        </div>
      )}
      
      <div className={getBubbleClasses()}>
        <div className={`whitespace-pre-wrap text-sm ${
          character?.id === 'winston' 
            ? 'font-serif' 
            : character?.id === 'obrien' 
              ? 'font-medium tracking-tight' 
              : ''
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
