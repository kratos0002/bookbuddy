import React from 'react';
import { EncyclopediaEntry, useEncyclopedia } from '@/contexts/EncyclopediaContext';
import { 
  Building2, Users, Lightbulb, Calendar, Package, 
  FileQuestion, Eye, Quote, Link as LinkIcon, User, Lock, LucideIcon,
  AlertTriangle, BookOpen, AlertCircle, Unlock, FileText
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

// Add thematic color scheme by category
const categoryColors: Record<string, { bg: string, text: string, border: string, accent: string }> = {
  'Locations': { bg: 'bg-amber-950/10', text: 'text-amber-800', border: 'border-amber-900/20', accent: 'text-amber-600' },
  'Organizations': { bg: 'bg-red-950/10', text: 'text-red-800', border: 'border-red-900/20', accent: 'text-red-600' },
  'Concepts': { bg: 'bg-blue-950/10', text: 'text-blue-800', border: 'border-blue-900/20', accent: 'text-blue-600' },
  'Events': { bg: 'bg-purple-950/10', text: 'text-purple-800', border: 'border-purple-900/20', accent: 'text-purple-600' },
  'Objects': { bg: 'bg-green-950/10', text: 'text-green-800', border: 'border-green-900/20', accent: 'text-green-600' },
  'Technology': { bg: 'bg-cyan-950/10', text: 'text-cyan-800', border: 'border-cyan-900/20', accent: 'text-cyan-600' },
  'People': { bg: 'bg-orange-950/10', text: 'text-orange-800', border: 'border-orange-900/20', accent: 'text-orange-600' },
};

const EntryDetail: React.FC<EntryDetailProps> = ({ entry }) => {
  const { unlockedEntryIds, getEntryById, selectEntry } = useEncyclopedia();
  const isUnlocked = unlockedEntryIds.includes(entry.id);
  const CategoryIcon = categoryIcons[entry.category] || FileQuestion;
  
  // Get category-specific styling or default to a neutral style
  const categoryStyle = categoryColors[entry.category] || { 
    bg: 'bg-slate-950/10', 
    text: 'text-slate-800', 
    border: 'border-slate-900/20',
    accent: 'text-slate-600'
  };
  
  // Get related entries that are visible (either unlocked or partially unlocked)
  const relatedEntries = entry.relatedEntries
    .map(id => getEntryById(id))
    .filter(entry => entry && (
      unlockedEntryIds.includes(entry.id) || entry.unlockProgress === 'initial'
    ));
  
  return (
    <div className="space-y-6">
      <div className={`
        p-5 rounded-lg border-2 ${categoryStyle.border} ${categoryStyle.bg}
        flex items-start gap-4 relative
      `}>
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 -translate-x-0.5 -translate-y-0.5 rounded-tl-sm"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 translate-x-0.5 -translate-y-0.5 rounded-tr-sm"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 -translate-x-0.5 translate-y-0.5 rounded-bl-sm"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 translate-x-0.5 translate-y-0.5 rounded-br-sm"></div>
        
        <div className={`
          flex items-center justify-center w-16 h-16 rounded-lg
          ${categoryStyle.bg.replace('/10', '/30')} border-2 ${categoryStyle.border}
          shadow-md
        `}>
          <CategoryIcon className={`h-8 w-8 ${categoryStyle.accent}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className={`text-2xl font-bold tracking-tight ${categoryStyle.text}`}>
              {entry.title}
            </h2>
            <Badge 
              variant="outline" 
              className={`
                text-xs flex items-center gap-1 ${categoryStyle.accent} 
                border-2 ${categoryStyle.border} px-2 py-0.5
              `}
            >
              <CategoryIcon className="h-3 w-3" />
              {entry.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-sm">
            <Badge 
              variant={isUnlocked ? "default" : "secondary"} 
              className={`
                text-xs rounded-sm px-2 py-0.5 flex items-center gap-1
                ${isUnlocked 
                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300'}
              `}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="h-3 w-3" />
                  Fully Unlocked
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Partially Revealed
                </>
              )}
            </Badge>
            
            {entry.mentionedBy.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Mentioned by {entry.mentionedBy.length} character{entry.mentionedBy.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={isUnlocked ? "reality" : "party"} className="mt-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="party" className="rounded-md data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
            <div className="flex items-center gap-1.5 py-0.5">
              <BookOpen className="h-4 w-4" />
              Party Version
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="reality" 
            disabled={!isUnlocked}
            className="rounded-md data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900"
          >
            <div className="flex items-center gap-1.5 py-0.5">
              <FileText className="h-4 w-4" />
              Reality
              {!isUnlocked && <Lock className="h-3 w-3 ml-1" />}
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="party" className="mt-4">
          <Card className="border-2 border-amber-900/30 overflow-hidden">
            <div className="h-1.5 w-full bg-amber-500/30"></div>
            <CardHeader className="p-4 pb-2 border-b border-dashed border-amber-900/20">
              <div className="flex items-center gap-2 text-amber-800">
                <Eye className="h-4 w-4" />
                <h3 className="font-semibold tracking-tight">Official Party Description</h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <div className="bg-amber-50/30 p-4 rounded-md border border-dashed border-amber-900/20">
                <p className="text-sm leading-relaxed">{entry.partyDescription}</p>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50/50 border border-amber-900/20 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  <span className="font-semibold">APPROVED VERSION:</span> Authorized by the Ministry of Truth for general consumption. This represents the official Party narrative.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reality" className="mt-4">
          {isUnlocked ? (
            <Card className="border-2 border-emerald-900/30 overflow-hidden">
              <div className="h-1.5 w-full bg-emerald-500/30"></div>
              <CardHeader className="p-4 pb-2 border-b border-dashed border-emerald-900/20">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Unlock className="h-4 w-4" />
                  <h3 className="font-semibold tracking-tight">Actual Reality</h3>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-3">
                <div className="bg-emerald-50/30 p-4 rounded-md border border-dashed border-emerald-900/20">
                  <p className="text-sm leading-relaxed">{entry.reality}</p>
                </div>
                
                <div className="mt-4 p-3 bg-emerald-50/50 border border-emerald-900/20 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-800">
                    <span className="font-semibold">UNALTERED TRUTH:</span> This information contradicts the Party's narrative and would be considered thoughtcrime. You have discovered this through conversations.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-red-900/30 overflow-hidden bg-red-50/10">
              <div className="h-1.5 w-full bg-red-500/30"></div>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center px-8">
                <div className="w-16 h-16 bg-red-100/30 rounded-full flex items-center justify-center mb-4 border-2 border-red-900/20">
                  <Lock className="h-8 w-8 text-red-800/70" />
                </div>
                <h3 className="text-red-800 font-bold mb-2">CLASSIFIED INFORMATION</h3>
                <p className="text-red-700/80 text-sm max-w-md">
                  This truth is currently restricted. Continue conversations with characters who mention this topic to unlock the full reality behind the Party's narrative.
                </p>
                
                <Badge variant="outline" className="mt-4 border-red-900/30 text-red-700">
                  THOUGHTCRIME WARNING
                </Badge>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Quotes Section */}
      {entry.quotes.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
            <Quote className="h-4 w-4" />
            Relevant Quotes
          </h3>
          <ScrollArea className="max-h-56 rounded-md border">
            <div className="space-y-3 p-3">
              {entry.quotes.map((quote, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-black/10 border rounded-md relative"
                >
                  <Quote className="absolute text-black/5 h-12 w-12 -top-1 -left-1" />
                  <p className="text-sm italic relative z-10">"{quote}"</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      )}
      
      {/* Related Entries Section */}
      {relatedEntries.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
            <LinkIcon className="h-4 w-4" />
            Related Entries
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {relatedEntries.map(relatedEntry => relatedEntry && (
              <Button
                key={relatedEntry.id}
                variant="outline"
                className="justify-start h-auto py-3 px-4 hover:bg-black/5 border-2"
                onClick={() => selectEntry(relatedEntry.id)}
              >
                <div className="flex gap-2 items-center">
                  {categoryIcons[relatedEntry.category] && (
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${categoryColors[relatedEntry.category]?.bg || 'bg-slate-100'}
                    `}>
                      {React.createElement(categoryIcons[relatedEntry.category], { 
                        className: `h-4 w-4 ${categoryColors[relatedEntry.category]?.accent || 'text-slate-600'}`
                      })}
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{relatedEntry.title}</span>
                    <span className="text-xs text-muted-foreground">{relatedEntry.category}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </section>
      )}
      
      {/* Mentioned by section */}
      {entry.mentionedBy.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
            <User className="h-4 w-4" />
            Mentioned By
          </h3>
          <div className="flex flex-wrap gap-2">
            {entry.mentionedBy.map(character => (
              <Badge 
                key={character} 
                variant="secondary"
                className="py-1.5 px-3 bg-black/10 hover:bg-black/15"
              >
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