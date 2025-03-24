import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CombinedCTASection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#1a3a5f] to-[#1a3a5f]/90 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[url('/book-pattern.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#8b2439]/20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#7d8c75]/10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Experience "1984" Like Never Before</h2>
          <p className="text-[#f8f0e3]/90 mb-12 max-w-2xl mx-auto text-lg">
            Step beyond reading into living literary experiences that inspire deeper emotional connections, meaningful insights, and fresh perspectives.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 flex flex-col items-center hover:bg-white/15 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#7d8c75]/20 flex items-center justify-center mb-6">
                <Users size={32} className="text-[#f8f0e3]" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Connect with Characters</h3>
              <p className="text-[#f8f0e3]/80 mb-8 text-center">
                Form emotional bonds with Winston, Julia, and O'Brien as you explore the human elements beneath the dystopian tale.
              </p>
              
              <div className="space-y-4 mb-8 w-full">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#8b2439]/80" />
                  <span className="text-sm">Discover character motivations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#8b2439]/80" />
                  <span className="text-sm">Ask questions you've always wondered</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#8b2439]/80" />
                  <span className="text-sm">Experience emotional story moments</span>
                </div>
              </div>
              
              <Link to="/conversation" className="mt-auto w-full">
                <Button variant="outline" className="w-full border-[#f8f0e3]/30 text-[#f8f0e3] hover:bg-[#f8f0e3]/10 hover:text-white">
                  Start a Character Conversation
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#8b2439]/20 backdrop-blur-sm p-8 rounded-xl border border-[#8b2439]/30 flex flex-col items-center hover:bg-[#8b2439]/25 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-[#8b2439]/20 flex items-center justify-center mb-6">
                <BookOpen size={32} className="text-[#f8f0e3]" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Explore with Alexandria</h3>
              <p className="text-[#f8f0e3]/80 mb-8 text-center">
                Gain intellectual and emotional clarity with our AI Librarian who illuminates literary context, themes, and historical relevance.
              </p>
              
              <div className="space-y-4 mb-8 w-full">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-[#7d8c75]/80" />
                  <span className="text-sm">Understand complex themes effortlessly</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-[#7d8c75]/80" />
                  <span className="text-sm">Explore the historical context</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-[#7d8c75]/80" />
                  <span className="text-sm">Connect ideas across literature</span>
                </div>
              </div>
              
              <div className="relative w-full mt-auto">
                <div className="absolute -top-3 right-0 bg-[#f8f0e3] text-[#8b2439] text-xs px-2 py-1 rounded-full font-medium">
                  New Experience!
                </div>
                <Link to="/librarian">
                  <Button className="w-full bg-[#f8f0e3] hover:bg-[#f8f0e3]/90 text-[#8b2439]">
                    Chat with the AI Librarian
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          <p className="mt-16 text-[#f8f0e3]/60 text-sm max-w-lg mx-auto">
            "Every book lover deserves to move beyond passive reading into active literary relationships that transform how they experience classic works."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CombinedCTASection; 