
import React from 'react';
import { useBook } from '../contexts/BookContext';
import { BookOpen, MapPin, Clock, Tag } from 'lucide-react';

const ContextPanel: React.FC = () => {
  const { selectedBook } = useBook();
  
  return (
    <div 
      className="w-full h-full overflow-y-auto hide-scrollbar p-5 bg-card border-l"
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
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-1 text-book-primary">{selectedBook.title}</h2>
        <p className="text-sm text-muted-foreground mb-6">By {selectedBook.author}, {selectedBook.publishedYear}</p>
        
        <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
          <h3 className="text-xs uppercase tracking-wider text-book-primary font-medium mb-2 flex items-center gap-1">
            <BookOpen size={12} />
            Description
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{selectedBook.description}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-book-primary font-medium mb-2 flex items-center gap-1">
            <Tag size={12} />
            Key Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedBook.themes.map((theme, index) => (
              <span 
                key={index}
                className="inline-block px-3 py-1 text-xs rounded-full bg-book-primary/10 text-book-primary border border-book-primary/20"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-book-primary font-medium mb-2 flex items-center gap-1">
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
          <h3 className="text-xs uppercase tracking-wider text-book-primary font-medium mb-2 flex items-center gap-1">
            <Clock size={12} />
            Timeline
          </h3>
          <div className="space-y-3 relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-book-primary/20"></div>
            {selectedBook.timeline.map((event, index) => (
              <div key={index} className="flex gap-3 relative">
                <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-book-primary mt-1.5 z-10"></div>
                <div className="flex-1 pb-4">
                  <div className="flex-shrink-0 text-book-primary font-bold text-sm mb-1">
                    {event.year}
                  </div>
                  <div className="text-sm bg-secondary/30 rounded-md p-2 border border-border/30">{event.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextPanel;
