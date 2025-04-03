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
import { cn } from '@/lib/utils';

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

// Static styling maps for categories
const getCategoryColor = (category: string) => {
  switch(category) {
    case 'Locations': return 'amber';
    case 'Organizations': return 'red';
    case 'Concepts': return 'blue';
    case 'Events': return 'purple';
    case 'Objects': return 'green';
    case 'Technology': return 'cyan';
    case 'People': return 'orange';
    default: return 'slate';
  }
};

const EntryDetail: React.FC<EntryDetailProps> = ({ entry }) => {
  const { unlockedEntryIds, getEntryById, selectEntry } = useEncyclopedia();
  const isUnlocked = unlockedEntryIds.includes(entry.id);
  const CategoryIcon = categoryIcons[entry.category] || FileQuestion;
  const colorName = getCategoryColor(entry.category);
  
  // Get related entries that are visible (either unlocked or partially unlocked)
  const relatedEntries = entry.relatedEntries
    .map(id => getEntryById(id))
    .filter(entry => entry && (
      unlockedEntryIds.includes(entry.id) || entry.unlockProgress === 'initial'
    ));
    
  // Category specific colors
  const headerBg = cn("rounded-lg border-2", {
    "bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800": colorName === "amber",
    "bg-red-50/50 dark:bg-red-950/30 border-red-300 dark:border-red-800": colorName === "red",
    "bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800": colorName === "blue",
    "bg-purple-50/50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800": colorName === "purple",
    "bg-green-50/50 dark:bg-green-950/30 border-green-300 dark:border-green-800": colorName === "green",
    "bg-cyan-50/50 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-800": colorName === "cyan",
    "bg-orange-50/50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800": colorName === "orange",
    "bg-slate-50/50 dark:bg-slate-950/30 border-slate-300 dark:border-slate-800": colorName === "slate",
  });

  const titleColor = cn({
    "text-amber-800 dark:text-amber-300": colorName === "amber",
    "text-red-800 dark:text-red-300": colorName === "red", 
    "text-blue-800 dark:text-blue-300": colorName === "blue",
    "text-purple-800 dark:text-purple-300": colorName === "purple",
    "text-green-800 dark:text-green-300": colorName === "green",
    "text-cyan-800 dark:text-cyan-300": colorName === "cyan",
    "text-orange-800 dark:text-orange-300": colorName === "orange",
    "text-slate-800 dark:text-slate-300": colorName === "slate",
  });

  const iconBg = cn("flex items-center justify-center w-16 h-16 rounded-lg shadow-md border-2", {
    "bg-amber-100/80 dark:bg-amber-900/30 border-amber-300 dark:border-amber-800": colorName === "amber",
    "bg-red-100/80 dark:bg-red-900/30 border-red-300 dark:border-red-800": colorName === "red", 
    "bg-blue-100/80 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800": colorName === "blue",
    "bg-purple-100/80 dark:bg-purple-900/30 border-purple-300 dark:border-purple-800": colorName === "purple",
    "bg-green-100/80 dark:bg-green-900/30 border-green-300 dark:border-green-800": colorName === "green",
    "bg-cyan-100/80 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-800": colorName === "cyan",
    "bg-orange-100/80 dark:bg-orange-900/30 border-orange-300 dark:border-orange-800": colorName === "orange",
    "bg-slate-100/80 dark:bg-slate-900/30 border-slate-300 dark:border-slate-800": colorName === "slate",
  });

  const iconColor = cn({
    "text-amber-600 dark:text-amber-400": colorName === "amber",
    "text-red-600 dark:text-red-400": colorName === "red", 
    "text-blue-600 dark:text-blue-400": colorName === "blue",
    "text-purple-600 dark:text-purple-400": colorName === "purple",
    "text-green-600 dark:text-green-400": colorName === "green",
    "text-cyan-600 dark:text-cyan-400": colorName === "cyan",
    "text-orange-600 dark:text-orange-400": colorName === "orange",
    "text-slate-600 dark:text-slate-400": colorName === "slate",
  });
  
  return (
    <div className="space-y-6">
      <div className={cn("p-5 flex items-start gap-4 relative", headerBg)}>
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 -translate-x-0.5 -translate-y-0.5 rounded-tl-sm"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 translate-x-0.5 -translate-y-0.5 rounded-tr-sm"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 -translate-x-0.5 translate-y-0.5 rounded-bl-sm"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 translate-x-0.5 translate-y-0.5 rounded-br-sm"></div>
        
        <div className={iconBg}>
          <CategoryIcon className={cn("h-8 w-8", iconColor)} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className={cn("text-2xl font-bold tracking-tight", titleColor)}>
              {entry.title}
            </h2>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs flex items-center gap-1 border-2 px-2 py-0.5",
                iconColor
              )}
            >
              <CategoryIcon className="h-3 w-3" />
              {entry.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-sm">
            <Badge 
              className={cn(
                "text-xs rounded-sm px-2 py-0.5 flex items-center gap-1",
                isUnlocked 
                  ? "bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
                  : "bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800"
              )}
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
          <TabsTrigger 
            value="party" 
            className="rounded-md data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-900 dark:data-[state=active]:text-amber-100"
          >
            <div className="flex items-center gap-1.5 py-0.5">
              <BookOpen className="h-4 w-4" />
              Party Version
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="reality" 
            disabled={!isUnlocked}
            className="rounded-md data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/50 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-100"
          >
            <div className="flex items-center gap-1.5 py-0.5">
              <FileText className="h-4 w-4" />
              Reality
              {!isUnlocked && <Lock className="h-3 w-3 ml-1" />}
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="party" className="mt-4">
          <Card className="border-2 border-amber-300 dark:border-amber-800 overflow-hidden shadow-md">
            <div className="h-1.5 w-full bg-amber-500/50 dark:bg-amber-600/30"></div>
            <CardHeader className="p-4 pb-2 border-b border-dashed border-amber-300/50 dark:border-amber-800/50">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Eye className="h-4 w-4" />
                <h3 className="font-semibold tracking-tight">Official Party Description</h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <div className="bg-amber-50/30 dark:bg-amber-900/20 p-4 rounded-md border border-dashed border-amber-300/50 dark:border-amber-800/50">
                <p className="text-sm leading-relaxed">{entry.partyDescription}</p>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50/50 dark:bg-amber-900/30 border border-amber-300/50 dark:border-amber-800/50 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <span className="font-semibold">APPROVED VERSION:</span> Authorized by the Ministry of Truth for general consumption. This represents the official Party narrative.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reality" className="mt-4">
          {isUnlocked ? (
            <Card className="border-2 border-emerald-300 dark:border-emerald-800 overflow-hidden shadow-md">
              <div className="h-1.5 w-full bg-emerald-500/50 dark:bg-emerald-600/30"></div>
              <CardHeader className="p-4 pb-2 border-b border-dashed border-emerald-300/50 dark:border-emerald-800/50">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <Unlock className="h-4 w-4" />
                  <h3 className="font-semibold tracking-tight">Actual Reality</h3>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-3">
                <div className="bg-emerald-50/30 dark:bg-emerald-900/20 p-4 rounded-md border border-dashed border-emerald-300/50 dark:border-emerald-800/50">
                  <p className="text-sm leading-relaxed">{entry.reality}</p>
                </div>
                
                <div className="mt-4 p-3 bg-emerald-50/50 dark:bg-emerald-900/30 border border-emerald-300/50 dark:border-emerald-800/50 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-emerald-800 dark:text-emerald-200">
                    <span className="font-semibold">UNALTERED TRUTH:</span> This information contradicts the Party's narrative and would be considered thoughtcrime. You have discovered this through conversations.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-red-300 dark:border-red-800 overflow-hidden bg-red-50/10 dark:bg-red-900/10 shadow-md">
              <div className="h-1.5 w-full bg-red-500/50 dark:bg-red-600/30"></div>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center px-8">
                <div className="w-16 h-16 bg-red-100/30 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 border-2 border-red-300/50 dark:border-red-800/50">
                  <Lock className="h-8 w-8 text-red-800/70 dark:text-red-400/70" />
                </div>
                <h3 className="text-red-800 dark:text-red-300 font-bold mb-2">CLASSIFIED INFORMATION</h3>
                <p className="text-red-700/80 dark:text-red-300/80 text-sm max-w-md">
                  This truth is currently restricted. Continue conversations with characters who mention this topic to unlock the full reality behind the Party's narrative.
                </p>
                
                <Badge 
                  variant="outline" 
                  className="mt-4 border-red-300/50 dark:border-red-800/50 text-red-700 dark:text-red-300"
                >
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
                  className="p-4 bg-black/10 dark:bg-white/5 border rounded-md relative"
                >
                  <Quote className="absolute text-black/5 dark:text-white/5 h-12 w-12 -top-1 -left-1" />
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
                className="justify-start h-auto py-3 px-4 hover:bg-black/5 dark:hover:bg-white/5 border-2 shadow-sm"
                onClick={() => selectEntry(relatedEntry.id)}
              >
                <div className="flex gap-2 items-center">
                  {categoryIcons[relatedEntry.category] && (
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      {
                        "bg-amber-100/50 dark:bg-amber-900/20": getCategoryColor(relatedEntry.category) === "amber",
                        "bg-red-100/50 dark:bg-red-900/20": getCategoryColor(relatedEntry.category) === "red",
                        "bg-blue-100/50 dark:bg-blue-900/20": getCategoryColor(relatedEntry.category) === "blue",
                        "bg-purple-100/50 dark:bg-purple-900/20": getCategoryColor(relatedEntry.category) === "purple",
                        "bg-green-100/50 dark:bg-green-900/20": getCategoryColor(relatedEntry.category) === "green",
                        "bg-cyan-100/50 dark:bg-cyan-900/20": getCategoryColor(relatedEntry.category) === "cyan",
                        "bg-orange-100/50 dark:bg-orange-900/20": getCategoryColor(relatedEntry.category) === "orange",
                        "bg-slate-100/50 dark:bg-slate-900/20": getCategoryColor(relatedEntry.category) === "slate",
                      }
                    )}>
                      {React.createElement(categoryIcons[relatedEntry.category], { 
                        className: cn("h-4 w-4", {
                          "text-amber-600 dark:text-amber-400": getCategoryColor(relatedEntry.category) === "amber",
                          "text-red-600 dark:text-red-400": getCategoryColor(relatedEntry.category) === "red",
                          "text-blue-600 dark:text-blue-400": getCategoryColor(relatedEntry.category) === "blue",
                          "text-purple-600 dark:text-purple-400": getCategoryColor(relatedEntry.category) === "purple",
                          "text-green-600 dark:text-green-400": getCategoryColor(relatedEntry.category) === "green",
                          "text-cyan-600 dark:text-cyan-400": getCategoryColor(relatedEntry.category) === "cyan",
                          "text-orange-600 dark:text-orange-400": getCategoryColor(relatedEntry.category) === "orange",
                          "text-slate-600 dark:text-slate-400": getCategoryColor(relatedEntry.category) === "slate",
                        })
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
                className="py-1.5 px-3 bg-black/10 dark:bg-white/5 hover:bg-black/15 dark:hover:bg-white/10"
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