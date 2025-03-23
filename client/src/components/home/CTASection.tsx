
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative px-4 py-16 overflow-hidden">
      <div 
        className="absolute inset-0 bg-book-primary/10 z-0"
        aria-hidden="true"
      ></div>
      
      {/* Quote decorations */}
      <div className="absolute top-10 left-10 text-5xl text-book-primary/20 font-serif">"</div>
      <div className="absolute bottom-10 right-10 text-5xl text-book-primary/20 font-serif">"</div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif font-semibold mb-4">Ready to Start Your Literary Journey?</h2>
        <blockquote className="italic text-lg text-book-primary mb-6 font-serif">
          "Who controls the past controls the future. Who controls the present controls the past."
        </blockquote>
        <p className="mb-8 text-muted-foreground max-w-2xl mx-auto">
          Begin with "1984" by George Orwell and experience conversations with Winston, Julia, and other characters from this influential work.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/conversation">
            Start Conversation Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
