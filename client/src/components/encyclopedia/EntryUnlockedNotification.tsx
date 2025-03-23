import React, { useState, useEffect } from 'react';
import { EncyclopediaEntry } from '@/contexts/EncyclopediaContext';
import { LockOpen, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface EntryUnlockedNotificationProps {
  entry: EncyclopediaEntry;
  onView: () => void;
  onDismiss: () => void;
}

const EntryUnlockedNotification: React.FC<EntryUnlockedNotificationProps> = ({ 
  entry, 
  onView, 
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for exit animation to complete
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);

  // Handle manual dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for exit animation to complete
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <Card className="bg-black/80 backdrop-blur-sm border-book-primary/30 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1 bg-book-primary"></div>
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-book-primary/20 mr-3 flex-shrink-0">
                  <LockOpen className="h-5 w-5 text-book-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-book-primary">Encyclopedia Unlocked</h4>
                      <p className="text-sm font-medium mt-0.5">{entry.title}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full -mt-1 -mr-1"
                      onClick={handleDismiss}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    You've unlocked new information about {entry.title}
                  </p>
                  
                  <div className="mt-3 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="text-xs"
                      onClick={() => {
                        onView();
                        handleDismiss();
                      }}
                    >
                      View Entry
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryUnlockedNotification; 