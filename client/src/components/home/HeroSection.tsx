
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative px-4 py-16 md:py-24 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10 z-0" 
        style={{
          backgroundImage: "url('/lovable-uploads/b3da856a-355b-47ce-bb43-78acf487209e.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)"
        }}
        aria-hidden="true"
      ></div>
      
      {/* Animated book pages/quotes in background */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 right-10 transform rotate-12 opacity-10 animate-float-slow">
          <div className="bg-white p-6 rounded shadow-md w-48 h-64">
            <div className="w-full h-2 bg-book-primary/20 mb-3"></div>
            <div className="w-3/4 h-2 bg-book-primary/20 mb-3"></div>
            <div className="w-full h-2 bg-book-primary/20 mb-3"></div>
            <div className="w-2/3 h-2 bg-book-primary/20"></div>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-10 transform -rotate-6 opacity-10 animate-float">
          <div className="bg-white p-6 rounded shadow-md w-48 h-64">
            <div className="w-full h-2 bg-book-primary/20 mb-3"></div>
            <div className="w-1/2 h-2 bg-book-primary/20 mb-3"></div>
            <div className="w-full h-2 bg-book-primary/20 mb-3"></div>
            <div className="w-3/4 h-2 bg-book-primary/20"></div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-book-primary mb-6 tracking-tight animate-fade-in">
              Have Meaningful Conversations<br />with Your Favorite Books
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 text-muted-foreground">
              BookBuddy lets you talk directly with characters from literature or 
              consult with a knowledgeable librarian about the themes, plot, and context.
            </p>
            <Button asChild size="lg" className="gap-2 text-base animate-pulse-subtle">
              <Link to="/conversation">
                Begin Your Literary Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Hero illustration */}
          <div className="lg:w-1/2 relative">
            <div className="relative flex justify-center">
              <div className="relative z-10 w-full max-w-md">
                <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.01] duration-300">
                  <img 
                    src="/lovable-uploads/b3da856a-355b-47ce-bb43-78acf487209e.png" 
                    alt="Person conversing with book characters" 
                    className="w-full object-cover"
                  />
                  
                  {/* Conversation visualization */}
                  <div className="absolute top-10 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg transform translate-y-0 animate-float-slow">
                    <p className="text-sm font-medium text-book-primary">"What is the significance of the room above the shop?"</p>
                  </div>
                  
                  <div className="absolute top-32 left-6 bg-book-primary/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-white transform translate-y-0 animate-float delay-300">
                    <p className="text-sm">"It represents a false sanctuary from the Party's surveillance..."</p>
                  </div>
                  
                  <div className="absolute bottom-16 right-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg transform translate-y-0 animate-float-slow delay-700">
                    <p className="text-sm font-medium text-book-primary">"Tell me about the significance of the glass paperweight."</p>
                  </div>
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
