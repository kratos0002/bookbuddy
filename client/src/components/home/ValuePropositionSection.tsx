import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Heart, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

type PersonaType = 'students' | 'bookLovers' | 'casualReaders';

interface Persona {
  icon: React.ReactNode;
  title: string;
  description: string;
  transformation: string;
  color: string;
}

const ValuePropositionSection = () => {
  const [activePersona, setActivePersona] = useState<PersonaType>('students');

  const personas: Record<PersonaType, Persona> = {
    students: {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "For Students & Educators",
      description: "Turn passive study into active exploration with in-depth character conversations that illuminate themes, historical context, and literary elements.",
      transformation: "From memorizing facts to meaningful understanding that leads to better essays, deeper analysis, and genuine appreciation of literature.",
      color: "#1a3a5f"
    },
    bookLovers: {
      icon: <Heart className="h-8 w-8" />,
      title: "For Passionate Readers",
      description: "Revisit your favorite books through fresh perspectives. Ask characters questions you've always wondered about and explore unresolved plot points.",
      transformation: "From finishing the last page to continuing the journey with characters who become companions in your literary exploration.",
      color: "#8b2439"
    },
    casualReaders: {
      icon: <Coffee className="h-8 w-8" />,
      title: "For Curious Minds",
      description: "Make classic literature accessible and engaging. Have natural conversations that break down complex themes into relatable discussions.",
      transformation: "From intimidation to inspiration as the world's greatest books become approachable through personal dialogue.",
      color: "#7d8c75"
    }
  };

  return (
    <section className="py-20 px-4 bg-[#f8f0e3]/60 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[url('/paper-texture.png')] opacity-5"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-[#1a3a5f]">
          Why BookBuddy?
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Our interactive platform transforms how different readers experience and engage with literature.
        </p>
        
        {/* Personas tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(Object.keys(personas) as PersonaType[]).map((key) => {
            const persona = personas[key];
            const isActive = activePersona === key;
            
            // Determine button styles based on persona type
            let buttonClasses = "px-6 py-3 rounded-full flex items-center gap-2 transition-all ";
            
            if (key === 'students') {
              buttonClasses += isActive 
                ? "bg-[#1a3a5f] text-white shadow-md font-bold text-base" 
                : "bg-white text-[#1a3a5f] hover:bg-[#1a3a5f]/20 border-2 border-[#1a3a5f]";
            } else if (key === 'bookLovers') {
              buttonClasses += isActive 
                ? "bg-[#8b2439] text-white shadow-md font-bold text-base" 
                : "bg-white text-[#8b2439] hover:bg-[#8b2439]/20 border-2 border-[#8b2439]";
            } else {
              buttonClasses += isActive 
                ? "bg-[#7d8c75] text-white shadow-md font-bold text-base" 
                : "bg-white text-[#7d8c75] hover:bg-[#7d8c75]/20 border-2 border-[#7d8c75]";
            }
            
            return (
              <button
                key={key}
                onClick={() => setActivePersona(key)}
                className={buttonClasses}
              >
                {React.cloneElement(persona.icon as React.ReactElement, { 
                  className: `h-5 w-5 ${
                    isActive ? 'text-white' : 
                    key === 'students' ? 'text-[#1a3a5f]' : 
                    key === 'bookLovers' ? 'text-[#8b2439]' : 
                    'text-[#7d8c75]'
                  }` 
                })}
                <span className="font-medium">{persona.title}</span>
              </button>
            );
          })}
        </div>
        
        {/* Active persona content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            key={activePersona}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-md border border-[#f8f0e3]"
          >
            <div className={`w-16 h-16 rounded-full ${
              activePersona === 'students' 
                ? 'bg-[#1a3a5f]/10' 
                : activePersona === 'bookLovers' 
                  ? 'bg-[#8b2439]/10' 
                  : 'bg-[#7d8c75]/10'
            } flex items-center justify-center mb-6`}>
              {React.cloneElement(personas[activePersona].icon as React.ReactElement, { 
                className: `h-8 w-8 ${
                  activePersona === 'students' 
                    ? 'text-[#1a3a5f]' 
                    : activePersona === 'bookLovers' 
                      ? 'text-[#8b2439]' 
                      : 'text-[#7d8c75]'
                }` 
              })}
            </div>
            
            <h3 className={`text-2xl font-serif font-bold mb-4 ${
              activePersona === 'students' 
                ? 'text-[#1a3a5f]' 
                : activePersona === 'bookLovers' 
                  ? 'text-[#8b2439]' 
                  : 'text-[#7d8c75]'
            }`}>
              {personas[activePersona].title}
            </h3>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              {personas[activePersona].description}
            </p>
            
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-medium mb-2 text-gray-900">The Transformation:</h4>
              <p className="text-gray-700 italic">
                {personas[activePersona].transformation}
              </p>
            </div>
          </motion.div>
          
          {/* Conversation preview */}
          <motion.div
            key={`preview-${activePersona}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-[#f8f0e3]"
          >
            <div className={`px-4 py-3 ${
              activePersona === 'students' 
                ? 'bg-[#1a3a5f]' 
                : activePersona === 'bookLovers' 
                  ? 'bg-[#8b2439]' 
                  : 'bg-[#7d8c75]'
            } text-white flex items-center`}>
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="font-medium">Conversation Preview</span>
            </div>
            
            {/* Conversation previews */}
            {activePersona === 'students' && (
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a5f] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">W</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">The Party controls everything in Oceania - from our actions to our thoughts.</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-[#1a3a5f]/20 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">How does this "thought control" work in practice? What techniques does the Party use?</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#f8f0e3] flex-shrink-0 flex items-center justify-center text-[#1a3a5f] text-xs font-bold">S</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a5f] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">W</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">Through doublethink, thoughtcrime, and newspeak. They eliminate words so you can't even form rebellious thoughts...</p>
                  </div>
                </div>
              </div>
            )}
            
            {activePersona === 'bookLovers' && (
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8b2439] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">J</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">I've always wondered if our relationship was truly doomed from the start, or if in a different world...</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-[#8b2439]/20 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">Did you ever genuinely love Winston, or was your relationship just an act of rebellion?</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#f8f0e3] flex-shrink-0 flex items-center justify-center text-[#8b2439] text-xs font-bold">R</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#8b2439] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">J</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">It began as rebellion, yes. But with him, I felt truly alive for the first time. In that sense, it was love...</p>
                  </div>
                </div>
              </div>
            )}
            
            {activePersona === 'casualReaders' && (
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7d8c75] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">L</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">I'm here to help you understand classic literature in simple, relatable terms.</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-[#7d8c75]/20 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">I find 1984 intimidating. Can you explain what "doublethink" means in modern terms?</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#f8f0e3] flex-shrink-0 flex items-center justify-center text-[#7d8c75] text-xs font-bold">C</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7d8c75] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">L</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">Think of it like cognitive dissonance. It's holding two contradictory beliefs simultaneously...</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
