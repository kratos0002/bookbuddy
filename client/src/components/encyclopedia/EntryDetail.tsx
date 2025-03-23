import React from 'react';
import { EncyclopediaEntry, useEncyclopedia } from '@/contexts/EncyclopediaContext';
import { 
  Building2, Users, Lightbulb, Calendar, Package, 
  FileQuestion, Eye, Quote, Link as LinkIcon, User, Lock, LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface EntryDetailProps {
  entry: EncyclopediaEntry;
}

const categoryIcons: Record<string, LucideIcon> = {
  'Locations': Building2,
  'Organizations': Users,
  'Concepts': Lightbulb,
  'Events': Calendar,
  'Objects': Package,
  'Technology': FileQuestion,
  'People': Eye,
};

const EntryDetail: React.FC<EntryDetailProps> = ({ entry }) => {
  const { unlockedEntryIds, getEntryById, selectEntry } = useEncyclopedia();
  const isUnlocked = unlockedEntryIds.includes(entry.id);
  const CategoryIcon = categoryIcons[entry.category] || FileQuestion;
  
  // Get related entries that are visible (either unlocked or partially unlocked)
  const relatedEntries = entry.relatedEntries
    .map(id => getEntryById(id))
    .filter(entry => entry && (
      unlockedEntryIds.includes(entry.id) || entry.unlockProgress === 'initial'
    ));
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-black/20 rounded-md border">
          <CategoryIcon className="h-6 w-6 text-book-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{entry.title}</h2>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <CategoryIcon className="h-3 w-3" />
              {entry.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Badge 
              variant={isUnlocked ? "default" : "secondary"} 
              className="text-xs"
            >
              {isUnlocked ? "Fully Unlocked" : "Partially Revealed"}
            </Badge>
            
            {entry.mentionedBy.length > 0 && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Mentioned by {entry.mentionedBy.length} character{entry.mentionedBy.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={isUnlocked ? "reality" : "party"}>
        <TabsList className="w-full">
          <TabsTrigger value="party" className="flex-1">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Party Version
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="reality" 
            className="flex-1" 
            disabled={!isUnlocked}
          >
            <div className="flex items-center gap-1">
              <FileQuestion className="h-4 w-4" />
              Reality
              {!isUnlocked && <Lock className="h-3 w-3 ml-1" />}
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="party" className="mt-4">
          <Card className="bg-black/20 border border-yellow-900/30">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2 text-yellow-600">
                <Eye className="h-4 w-4" />
                <h3 className="font-semibold">Official Party Description</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm">{entry.partyDescription}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reality" className="mt-4">
          {isUnlocked ? (
            <Card className="bg-black/20 border border-blue-900/30">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2 text-blue-500">
                  <FileQuestion className="h-4 w-4" />
                  <h3 className="font-semibold">Actual Reality</h3>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm">{entry.reality}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Lock className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground max-w-md">
                This information is currently locked. Continue conversations with characters to unlock the full entry.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Quotes Section */}
      {entry.quotes.length > 0 && (
        <section className="mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Quote className="h-4 w-4" />
            Relevant Quotes
          </h3>
          <ScrollArea className="h-44">
            <div className="space-y-3">
              {entry.quotes.map((quote, index) => (
                <div key={index} className="p-3 bg-black/20 border border-muted rounded-md">
                  <p className="text-sm italic">"{quote}"</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      )}
      
      {/* Related Entries Section */}
      {relatedEntries.length > 0 && (
        <section className="mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Related Entries
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {relatedEntries.map(relatedEntry => relatedEntry && (
              <Button
                key={relatedEntry.id}
                variant="outline"
                className="justify-start h-auto py-2"
                onClick={() => selectEntry(relatedEntry.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{relatedEntry.title}</span>
                  <span className="text-xs text-muted-foreground">{relatedEntry.category}</span>
                </div>
              </Button>
            ))}
          </div>
        </section>
      )}
      
      {/* Mentioned by section */}
      {entry.mentionedBy.length > 0 && (
        <section className="mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Mentioned By
          </h3>
          <div className="flex flex-wrap gap-2">
            {entry.mentionedBy.map(character => (
              <Badge key={character} variant="secondary">
                {character.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EntryDetail; 