import React from 'react';
import { Book, User, MessageSquare } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Book className="h-6 w-6 text-white" />,
      title: "1. Select a Book",
      description: "Choose from our collection of literary classics.",
      color: "#1a3a5f"
    },
    {
      icon: <User className="h-6 w-6 text-white" />,
      title: "2. Choose a Character",
      description: "Select a character or our librarian guide.",
      color: "#8b2439"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      title: "3. Start a Conversation",
      description: "Ask questions and explore the book through dialogue.",
      color: "#7d8c75"
    }
  ];
  
  return (
    <section className="bg-[#f8f0e3]/20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-[#1a3a5f]">How It Works</h2>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch justify-center">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 relative">
              {/* Connector line between steps on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-[#8b2439]/20 z-0 -translate-x-1/2"></div>
              )}
              
              <div className="h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                {/* Step number and title */}
                <div className={`p-6 flex items-center gap-4 bg-[${step.color}]`}>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-xl text-white">{step.title}</h3>
                </div>
                
                {/* Description */}
                <div className="p-6 flex-grow">
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
