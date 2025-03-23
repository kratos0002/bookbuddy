
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BookCover from '../components/BookCover';
import CharacterSelection from '../components/CharacterSelection';
import ChatInterface from '../components/ChatInterface';
import ContextPanel from '../components/ContextPanel';
import { BookText, X, Eye } from 'lucide-react';
import { useBook } from '../contexts/BookContext';

const ConversationPage = () => {
  const [contextOpen, setContextOpen] = useState(false);
  const { selectedCharacter } = useBook();
  const [showEye, setShowEye] = useState(true);
  
  // Close context panel when character is selected on mobile
  useEffect(() => {
    if (selectedCharacter && contextOpen && window.innerWidth < 768) {
      setContextOpen(false);
    }
  }, [selectedCharacter, contextOpen]);
  
  // Hide the watching eye after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEye(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Layout>
      <div className="h-full flex flex-col md:flex-row overflow-hidden relative">
        {/* Big Brother watching overlay effect - appears briefly */}
        {showEye && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-out pointer-events-none">
            <div className="text-book-primary text-center">
              <Eye size={60} className="mx-auto mb-4 animate-pulse-subtle" />
              <p className="text-xl text-book-secondary typewriter">Big Brother is watching you...</p>
            </div>
          </div>
        )}
      
        {/* Left section - Book Cover (visible on mobile, hidden on larger screens) */}
        <div className="md:hidden p-4 bg-gradient-to-b from-background to-muted/30">
          <BookCover />
        </div>
        
        {/* Middle section - Chat interface */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="hidden md:block absolute top-0 left-0 m-6 z-10">
            <BookCover />
          </div>
          
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 mt-12 relative z-0 big-brother-watching">
              <ChatInterface />
            </div>
          </div>
          
          <CharacterSelection />
        </div>
        
        {/* Right section - Context panel (hidden on mobile) */}
        <div className="hidden lg:block w-80 overflow-hidden animate-slide-in">
          <ContextPanel />
        </div>
        
        {/* Toggle for context panel on mobile */}
        <button 
          className="lg:hidden fixed bottom-20 right-4 z-20 w-12 h-12 rounded-full bg-book-primary text-white shadow-lg flex items-center justify-center border border-book-primary/20 hover:bg-book-primary/90 transition-colors"
          onClick={() => setContextOpen(!contextOpen)}
          aria-label={contextOpen ? "Close context panel" : "Open context panel"}
        >
          {contextOpen ? <X size={20} /> : <BookText size={20} />}
        </button>
        
        {/* Mobile context panel */}
        {contextOpen && (
          <div className="lg:hidden fixed inset-0 z-10 bg-background/95 backdrop-blur-sm animate-fade-in overflow-auto">
            <button 
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-book-primary text-white shadow-md flex items-center justify-center"
              onClick={() => setContextOpen(false)}
              aria-label="Close context panel"
            >
              <X size={16} />
            </button>
            <div className="p-4 w-full h-full">
              <ContextPanel />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConversationPage;
