
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Separator,
} from "@/components/ui/separator";
import { 
  Book, 
  InfoIcon, 
  Mail, 
  MessageSquare,
  Github,
  Twitter
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50 py-10 px-4 text-muted-foreground backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex flex-col mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-book-primary">BookBuddy</h3>
              <p className="text-xs">Talk to Your Books</p>
            </Link>
            <p className="text-sm mb-4">
              An interactive platform where literature comes alive through conversation.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm flex items-center gap-2 hover:text-book-primary transition-colors">
                  <Book className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/conversation" className="text-sm flex items-center gap-2 hover:text-book-primary transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  Start Conversation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-foreground">About</h4>
            <ul className="space-y-2">
              <li className="text-sm flex items-center gap-2">
                <InfoIcon className="h-4 w-4" />
                About BookBuddy
              </li>
              <li className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Us
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-book-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-book-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            Exploring literature through conversation — BookBuddy Literary Companion
          </p>
          <p className="text-xs">
            © 2024 BookBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
