import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBook } from '../contexts/BookContext';
import FeedbackChatbot from './feedback/FeedbackChatbot';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { selectedBook } = useBook();
  const isHomePage = location.pathname === '/';
  const isChatPage = location.pathname.startsWith('/chat');
  const isBookPage = location.pathname.startsWith('/book/');
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-background"
      style={{
        backgroundImage: "url('/texture-paper.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed"
      }}
    >
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 py-3 px-4 sm:px-6 flex items-center justify-between z-50 sticky top-0">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/images/Book Buddy Logo.svg" 
            alt="Book Buddy Logo" 
            className="h-8 sm:h-10 w-auto" 
          />
          <div className="flex flex-col">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Turn the Page. Start the Conversation</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden sm:block">
          <ul className="flex gap-6">
            <li>
              <Link 
                to="/" 
                className={`text-sm hover:text-book-primary transition-colors ${isHomePage ? 'text-book-primary font-medium' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to={`/book/${selectedBook.id}`} 
                className={`text-sm hover:text-book-primary transition-colors ${isBookPage ? 'text-book-primary font-medium' : ''}`}
              >
                1984
              </Link>
            </li>
            <li>
              <Link 
                to="/chat" 
                className={`text-sm hover:text-book-primary transition-colors ${isChatPage ? 'text-book-primary font-medium' : ''}`}
              >
                Chat GPT-3.5
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="sm:hidden text-book-primary p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-20 px-4">
          <nav className="flex flex-col items-center">
            <ul className="flex flex-col items-center gap-8 py-8">
              <li>
                <Link 
                  to="/" 
                  className={`text-xl hover:text-book-primary transition-colors ${isHomePage ? 'text-book-primary font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to={`/book/${selectedBook.id}`} 
                  className={`text-xl hover:text-book-primary transition-colors ${isBookPage ? 'text-book-primary font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  1984
                </Link>
              </li>
              <li>
                <Link 
                  to="/chat" 
                  className={`text-xl hover:text-book-primary transition-colors ${isChatPage ? 'text-book-primary font-medium' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Chat GPT-3.5
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
      
      {/* Only show footer on home page - remove the duplicate "Exploring 1984" text */}
      {isHomePage && (
        <footer className="border-t border-border/50 py-2 px-4 text-xs text-center text-muted-foreground backdrop-blur-sm bg-background/80">
          <span>© {new Date().getFullYear()} BookBuddy - A Literary Companion</span>
        </footer>
      )}

      {/* Feedback Chatbot */}
      <FeedbackChatbot />
    </div>
  );
};

export default Layout;
