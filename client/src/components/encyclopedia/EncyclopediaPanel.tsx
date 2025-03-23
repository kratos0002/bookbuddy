import React, { useState, useEffect } from 'react';
import { useEncyclopedia, EncyclopediaEntry } from '@/contexts/EncyclopediaContext';
import { Search, X, BookOpen, FileQuestion, LucideIcon, Building2, Users, Lightbulb, Calendar, Package, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import EntryCard from './EntryCard';
import EntryDetail from './EntryDetail';

const categoryIcons: Record<string, LucideIcon> = {
  'Locations': Building2,
  'Organizations': Users,
  'Concepts': Lightbulb,
  'Events': Calendar,
  'Objects': Package,
  'Technology': FileQuestion,
  'People': Eye,
};

const EncyclopediaPanel = () => {
  const { 
    entries, 
    unlockedEntryIds, 
    categories, 
    isLoading, 
    error, 
    selectedEntry, 
    selectEntry, 
    filterEntries 
  } = useEncyclopedia();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<EncyclopediaEntry[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [progress, setProgress] = useState(0);

  // Effect to filter entries based on search term and active tab
  useEffect(() => {
    let filtered = filterEntries(searchTerm);
    
    // Filter by category if not on 'all' tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(entry => entry.category === activeTab);
    }
    
    // Only show entries that are unlocked or partially unlocked
    filtered = filtered.filter(entry => 
      unlockedEntryIds.includes(entry.id) || 
      entry.unlockProgress === 'initial'
    );
    
    setFilteredEntries(filtered);
  }, [searchTerm, activeTab, entries, unlockedEntryIds, filterEntries]);

  // Calculate unlock progress
  useEffect(() => {
    if (entries.length === 0) return;
    const progressValue = (unlockedEntryIds.length / entries.length) * 100;
    setProgress(progressValue);
  }, [unlockedEntryIds, entries]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading encyclopedia data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-destructive">
          <p>Error loading encyclopedia: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden bg-black/10 backdrop-blur-sm border rounded-md">
      {/* Header with title and search */}
      <div className="border-b p-4 bg-black/20">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-book-primary" size={20} />
          <h2 className="text-xl font-bold text-book-primary">Forbidden Knowledge</h2>
          
          <div className="ml-auto text-xs text-muted-foreground">
            <span className="font-semibold">{Math.round(progress)}%</span> unlocked
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search entries..."
            className="pl-8 bg-background/70"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0.5 top-0.5 h-8 w-8 p-0"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <div className="mt-2">
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
      
      {/* Tabs for categories */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-1 py-1.5 overflow-x-auto bg-black/10">
          <TabsList className="w-auto">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs flex items-center gap-1">
                {categoryIcons[category] && React.createElement(categoryIcons[category], { size: 12 })}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* If an entry is selected, show the detail view */}
        {selectedEntry ? (
          <div className="flex-1 p-4 overflow-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4" 
              onClick={() => selectEntry(null)}
            >
              ← Back to entries
            </Button>
            <EntryDetail entry={selectedEntry} />
          </div>
        ) : (
          /* Otherwise show the list of entries */
          <TabsContent value={activeTab} className="flex-1 p-4 overflow-hidden" forceMount>
            <ScrollArea className="h-full pr-3">
              {filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEntries.map(entry => (
                    <EntryCard 
                      key={entry.id} 
                      entry={entry} 
                      isUnlocked={unlockedEntryIds.includes(entry.id)} 
                      onClick={() => selectEntry(entry.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    {searchTerm ? 'No matching entries found' : 'No entries available in this category yet'}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" size="sm" onClick={clearSearch}>
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EncyclopediaPanel; 