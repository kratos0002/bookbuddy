
import React from 'react';
import { Book, User, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Book />,
      title: "1. Select a Book",
      description: "Choose from our curated selection of literary classics and contemporary works."
    },
    {
      icon: <User />,
      title: "2. Choose a Character",
      description: "Select a character from the book or our literary librarian to guide your exploration."
    },
    {
      icon: <MessageSquare />,
      title: "3. Start Your Conversation",
      description: "Ask questions, explore themes, or simply chat about the story and characters."
    }
  ];
  
  return (
    <section className="bg-muted/30 px-4 py-16 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-book-primary/20 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-center mb-4">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Start a literary conversation in just three simple steps.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-book-primary/20 z-0 -translate-x-1/2"></div>
              )}
              
              <Card className="border-book-primary/20 transition-all duration-300 hover:shadow-md relative z-10">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-book-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
                    {React.cloneElement(step.icon, { className: "h-6 w-6 text-book-primary" })}
                  </div>
                  <h3 className="font-semibold text-xl text-center md:text-left">{step.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center md:text-left">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
