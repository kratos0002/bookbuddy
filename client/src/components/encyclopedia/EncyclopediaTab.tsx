import React, { useState } from 'react';
import { useEncyclopedia, EncyclopediaEntry } from '@/contexts/EncyclopediaContext';
import { BookOpen } from 'lucide-react';
import EncyclopediaPanel from './EncyclopediaPanel';
import EntryUnlockedNotification from './EntryUnlockedNotification';

const EncyclopediaTab = () => {
  const { entries, unlockedEntryIds, selectEntry } = useEncyclopedia();
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<EncyclopediaEntry | null>(null);
  
  // Demo function to simulate unlocking an entry when clicking on the tab
  // In a real implementation, this would happen from character conversations
  const simulateUnlock = () => {
    // Find a locked entry to unlock
    const lockedEntries = entries.filter(entry => 
      !unlockedEntryIds.includes(entry.id) && 
      entry.unlockProgress !== 'initial'
    );
    
    if (lockedEntries.length > 0) {
      const randomIndex = Math.floor(Math.random() * lockedEntries.length);
      const entryToUnlock = lockedEntries[randomIndex];
      setRecentlyUnlocked(entryToUnlock);
    }
  };
  
  return (
    <div className="h-full">
      <EncyclopediaPanel />
      
      {/* Notification when an entry is unlocked */}
      {recentlyUnlocked && (
        <EntryUnlockedNotification 
          entry={recentlyUnlocked}
          onView={() => {
            selectEntry(recentlyUnlocked.id);
            setRecentlyUnlocked(null);
          }}
          onDismiss={() => setRecentlyUnlocked(null)}
        />
      )}
    </div>
  );
};

export default EncyclopediaTab; 