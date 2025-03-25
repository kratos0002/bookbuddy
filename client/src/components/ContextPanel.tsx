import React, { useState } from 'react';
import { useBook } from '../contexts/BookContext';
import { BookOpen, MapPin, Clock, Tag, FileText, BookOpenCheck, Quote } from 'lucide-react';
import { EncyclopediaProvider } from '@/contexts/EncyclopediaContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EncyclopediaTab from './encyclopedia/EncyclopediaTab';
import QuoteExplorerTab from './quotes/QuoteExplorerTab';

const ContextPanel: React.FC = () => {
  const { selectedBook } = useBook();
  
  return (
    <div 
      className="w-full h-full overflow-hidden flex flex-col bg-card border-l"
      style={{
        backgroundImage: `
          url('/texture-paper.jpg'), 
          linear-gradient(rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.97)), 
          url('/lovable-uploads/8dbc9127-f3f5-43e0-b310-a374f7d44356.png')
        `,
        backgroundBlendMode: "overlay, normal, normal",
        backgroundSize: "cover, cover, 20%",
        backgroundPosition: "center, center, right bottom",
        backgroundAttachment: "fixed, fixed, fixed",
        backgroundRepeat: "repeat, no-repeat, no-repeat"
      }}
    >
      <div className="p-4 border-b bg-card/50">
        <h2 className="text-xl font-bold tracking-tight mb-1 text-[#8b2439]">{selectedBook.title}</h2>
        <p className="text-xs text-muted-foreground">By {selectedBook.author}, {selectedBook.publishedYear}</p>
      </div>
      
      <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 border-b bg-muted/20">
          <TabsList className="w-full justify-start mt-1">
            <TabsTrigger value="details" className="flex items-center gap-1 data-[state=active]:bg-[#8b2439] data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              <span>Book</span>
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" className="flex items-center gap-1 data-[state=active]:bg-[#8b2439] data-[state=active]:text-white">
              <BookOpenCheck className="h-4 w-4" />
              <span>Encyclopedia</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-1 data-[state=active]:bg-[#8b2439] data-[state=active]:text-white">
              <Quote className="h-4 w-4" />
              <span>Quotes</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="details" className="flex-1 overflow-y-auto p-5">
          <div className="max-w-md mx-auto">
            <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
              <h3 className="text-xs uppercase tracking-wider text-[#8b2439] font-medium mb-2 flex items-center gap-1">
                <BookOpen size={12} />
                Description
              </h3>
              <p className="text-sm text-foreground leading-relaxed">{selectedBook.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-[#8b2439] font-medium mb-2 flex items-center gap-1">
                <Tag size={12} />
                Key Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedBook.themes.map((theme, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 text-xs rounded-full bg-[#8b2439]/10 text-[#8b2439] border border-[#8b2439]/20"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-[#8b2439] font-medium mb-2 flex items-center gap-1">
                <MapPin size={12} />
                Key Locations
              </h3>
              <ul className="text-sm space-y-1 bg-secondary/30 rounded-lg border border-border/50 overflow-hidden">
                {selectedBook.keyLocations.map((location, index) => (
                  <li key={index} className="py-2 px-3 border-b border-border/30 last:border-0 hover:bg-secondary/50 transition-colors">
                    {location}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-[#8b2439] font-medium mb-2 flex items-center gap-1">
                <Clock size={12} />
                Timeline
              </h3>
              <div className="space-y-3 relative">
                <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-[#8b2439]/20"></div>
                {selectedBook.timeline.map((event, index) => (
                  <div key={index} className="flex gap-3 relative">
                    <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-[#8b2439] mt-1.5 z-10"></div>
                    <div className="flex-1 pb-4">
                      <div className="flex-shrink-0 text-[#8b2439] font-bold text-sm mb-1">
                        {event.year}
                      </div>
                      <div className="text-sm bg-secondary/30 rounded-md p-2 border border-border/30">{event.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="encyclopedia" className="flex-1 overflow-hidden p-2">
          <EncyclopediaProvider>
            <EncyclopediaTab />
          </EncyclopediaProvider>
        </TabsContent>

        <TabsContent value="quotes" className="flex-1 overflow-hidden">
          <QuoteExplorerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContextPanel;
