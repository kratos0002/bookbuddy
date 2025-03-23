import React from 'react';
import { Book, User, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Book />,
      title: "1. Select a Book",
      description: "Choose from our curated selection of literary classics and contemporary works.",
      color: "#1a3a5f"
    },
    {
      icon: <User />,
      title: "2. Choose a Character",
      description: "Select a character from the book or our literary librarian to guide your exploration.",
      color: "#8b2439"
    },
    {
      icon: <MessageSquare />,
      title: "3. Start Your Conversation",
      description: "Ask questions, explore themes, or simply chat about the story and characters.",
      color: "#7d8c75"
    }
  ];
  
  return (
    <section className="bg-white px-4 py-20 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b2439]/20 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#1a3a5f]">How It Works</h2>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Start a literary conversation in just three simple steps and transform how you experience books.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-[#8b2439]/20 z-0 -translate-x-1/2"></div>
              )}
              
              <Card className={`border-[${step.color}]/20 hover:border-[${step.color}]/40 transition-all duration-300 hover:shadow-md relative z-10 overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full bg-[${step.color}]`}></div>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 bg-[${step.color}]/10 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0`}>
                    {React.cloneElement(step.icon, { className: `h-6 w-6 text-[${step.color}]` })}
                  </div>
                  <h3 className={`font-semibold text-xl text-center md:text-left text-[${step.color}]`}>{step.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center md:text-left">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
