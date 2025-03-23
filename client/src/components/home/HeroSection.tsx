import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[800px] overflow-hidden bg-gradient-to-b from-[#f8f0e3] to-[#f8f0e3]/70">
      {/* Decorative book pages in background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Book-related textures and patterns */}
        <div className="absolute w-full h-full bg-[url('/paper-texture.png')] opacity-10"></div>
        
        {/* Deep burgundy accent elements */}
        <motion.div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#8b2439]/10"
          initial={{ x: 100, y: -100, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        ></motion.div>
        
        {/* Deep blue accent */}
        <motion.div 
          className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#1a3a5f]/10"
          initial={{ x: -50, y: 50, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        ></motion.div>
        
        {/* Soft sage accent */}
        <motion.div 
          className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full bg-[#7d8c75]/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 pt-16 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-[#1a3a5f]">
              From Reading Books to<br />
              <span className="text-[#8b2439]">Living Their Stories</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-[#333] max-w-xl">
              BookBuddy transforms how you experience literature—have meaningful conversations with characters, explore themes, and discover new perspectives that bring classic works to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-[#8b2439] hover:bg-[#8b2439]/90 text-white px-6 py-6 rounded-md">
                <Link to="/conversation" className="flex items-center gap-2 text-lg">
                  Start a Conversation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#1a3a5f] text-[#1a3a5f] hover:bg-[#1a3a5f]/10">
                <Link to="/book/1" className="flex items-center gap-2">
                  Explore Featured Books
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Visual story showing progression from traditional reading to interactive dialogue */}
            <div className="relative w-full max-w-md">
              {/* Traditional reading visual */}
              <div className="absolute top-0 left-0 w-32 h-48 bg-white rounded-md shadow-lg transform -rotate-12 translate-x-4 translate-y-8 z-10">
                <div className="h-full w-full overflow-hidden rounded-md">
                  <img src="/book-pages.jpg" alt="Book pages" className="h-full w-full object-cover opacity-80" />
                </div>
              </div>
              
              {/* Interactive dialogue - using the 1984 image */}
              <div className="w-72 h-96 bg-white rounded-lg shadow-xl border-4 border-[#f8f0e3] z-30 relative">
                <img 
                  src="/lovable-uploads/1984-interactive.jpg" 
                  alt="Interactive conversation with 1984 characters" 
                  className="h-full w-full object-cover rounded-md"
                />
                
                {/* Chat interface overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a3a5f]/90 to-transparent p-4 rounded-b-md">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#7d8c75] flex-shrink-0"></div>
                    <div className="bg-white/90 rounded-lg p-2 text-sm">
                      "What does freedom mean to you, Winston?"
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="ml-auto bg-[#8b2439]/90 text-white rounded-lg p-2 text-sm">
                      "Freedom is the freedom to say that two plus two equals four."
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#f8f0e3] flex-shrink-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
