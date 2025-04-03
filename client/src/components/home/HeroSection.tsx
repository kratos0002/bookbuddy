import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-16 bg-[#f8f0e3]/70">
      {/* Minimal background texture */}
      <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-10"></div>
      
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#1a3a5f]">
            Have Conversations with Book Characters
          </h1>
          
          <p className="text-lg mb-8 text-[#333] max-w-xl">
            Explore classic literature through interactive dialogue with characters. Ask questions, discuss themes, and gain new perspectives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-[#8b2439] hover:bg-[#8b2439]/90 text-white px-6 py-6 rounded-md">
              <Link to="/conversation" className="flex items-center gap-2 text-lg">
                Start a Conversation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-[#1a3a5f] text-[#1a3a5f] hover:bg-[#1a3a5f]/10">
              <Link to="#featured-books" className="flex items-center gap-2">
                See Available Books
                <BookOpen className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2">
          {/* Interactive dialogue visual */}
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl border-4 border-[#f8f0e3] overflow-hidden">
            <img 
              src="/lovable-uploads/1984-interactive.jpg" 
              alt="Interactive conversation with book characters" 
              className="h-72 w-full object-cover"
            />
            
            {/* Chat interface overlay */}
            <div className="bg-white p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#1a3a5f] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">W</div>
                <div className="bg-gray-100 rounded-lg p-3 flex-1">
                  <p className="text-sm">"Freedom is the freedom to say that two plus two equals four."</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f0e3] flex-shrink-0 flex items-center justify-center text-[#1a3a5f] text-xs font-bold">Y</div>
                <div className="bg-[#1a3a5f]/10 rounded-lg p-3 flex-1">
                  <p className="text-sm">"Why is that statement so important in Oceania?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
