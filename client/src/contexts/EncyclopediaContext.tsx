import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

export interface EncyclopediaEntry {
  id: string;
  title: string;
  category: string;
  partyDescription: string;
  reality: string;
  quotes: string[];
  relatedEntries: string[];
  mentionedBy: string[];
  iconKey: string;
  unlockProgress: 'locked' | 'initial' | 'discovered' | 'fully-unlocked';
}

interface EncyclopediaContextType {
  entries: EncyclopediaEntry[];
  unlockedEntryIds: string[];
  categories: string[];
  isLoading: boolean;
  error: Error | null;
  selectedEntry: EncyclopediaEntry | null;
  fetchEntries: () => Promise<void>;
  unlockEntry: (entryId: string) => Promise<void>;
  selectEntry: (entryId: string | null) => void;
  getEntryById: (entryId: string) => EncyclopediaEntry | undefined;
  getEntriesByCategory: (category: string) => EncyclopediaEntry[];
  getRelatedEntries: (entryId: string) => EncyclopediaEntry[];
  filterEntries: (searchTerm: string) => EncyclopediaEntry[];
}

const EncyclopediaContext = createContext<EncyclopediaContextType | undefined>(undefined);

export function useEncyclopedia() {
  const context = useContext(EncyclopediaContext);
  if (context === undefined) {
    throw new Error('useEncyclopedia must be used within an EncyclopediaProvider');
  }
  return context;
}

export function EncyclopediaProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<EncyclopediaEntry[]>([]);
  const [unlockedEntryIds, setUnlockedEntryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<EncyclopediaEntry | null>(null);

  // Fetch all encyclopedia entries
  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const fetchedEntries = await apiRequest('GET', '/api/encyclopedia/entries');
      setEntries(fetchedEntries);
      
      const fetchedCategories = await apiRequest('GET', '/api/encyclopedia/categories');
      setCategories(fetchedCategories);
      
      // For demo purposes, we'll use user ID 1
      const userId = 1;
      const fetchedUnlockedEntryIds = await apiRequest('GET', `/api/users/${userId}/encyclopedia/unlocked`);
      setUnlockedEntryIds(fetchedUnlockedEntryIds);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching encyclopedia data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch encyclopedia data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Unlock an entry
  const unlockEntry = async (entryId: string) => {
    try {
      // For demo purposes, we'll use user ID 1
      const userId = 1;
      await apiRequest('POST', `/api/users/${userId}/encyclopedia/unlock`, { entryId });
      
      // Update local state
      if (!unlockedEntryIds.includes(entryId)) {
        setUnlockedEntryIds([...unlockedEntryIds, entryId]);
      }
    } catch (err) {
      console.error('Error unlocking encyclopedia entry:', err);
      throw err;
    }
  };

  // Select an entry for detailed view
  const selectEntry = (entryId: string | null) => {
    if (entryId === null) {
      setSelectedEntry(null);
      return;
    }
    
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setSelectedEntry(entry);
    }
  };

  // Get an entry by ID
  const getEntryById = (entryId: string) => {
    return entries.find(e => e.id === entryId);
  };

  // Get entries by category
  const getEntriesByCategory = (category: string) => {
    return entries.filter(e => e.category === category);
  };

  // Get related entries for an entry
  const getRelatedEntries = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return [];
    
    return entries.filter(e => entry.relatedEntries.includes(e.id));
  };

  // Filter entries by search term
  const filterEntries = (searchTerm: string) => {
    if (!searchTerm.trim()) return entries;
    
    const term = searchTerm.toLowerCase();
    return entries.filter(e => 
      e.title.toLowerCase().includes(term) || 
      e.partyDescription.toLowerCase().includes(term) ||
      e.reality.toLowerCase().includes(term)
    );
  };

  // Load entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const value = {
    entries,
    unlockedEntryIds,
    categories,
    isLoading,
    error,
    selectedEntry,
    fetchEntries,
    unlockEntry,
    selectEntry,
    getEntryById,
    getEntriesByCategory,
    getRelatedEntries,
    filterEntries
  };

  return (
    <EncyclopediaContext.Provider value={value}>
      {children}
    </EncyclopediaContext.Provider>
  );
} 