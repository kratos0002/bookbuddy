
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
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
        <Link to="/" className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight text-book-primary">BookBuddy</h1>
          <p className="text-xs text-muted-foreground">Talk to Your Books</p>
        </Link>
        
        <nav>
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
                to="/conversation" 
                className={`text-sm hover:text-book-primary transition-colors ${!isHomePage ? 'text-book-primary font-medium' : ''}`}
              >
                1984
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
      
      {/* Footer is now handled by the Footer component for the home page */}
      {!isHomePage && (
        <footer className="border-t border-border/50 py-2 px-4 text-xs text-center text-muted-foreground backdrop-blur-sm bg-background/80">
          <span>Exploring "1984" by George Orwell — BookBuddy Literary Companion</span>
        </footer>
      )}
    </div>
  );
};

export default Layout;
