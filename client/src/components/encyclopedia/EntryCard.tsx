import React from 'react';
import { EncyclopediaEntry } from '@/contexts/EncyclopediaContext';
import { 
  Building2, Users, Lightbulb, Calendar, 
  Package, FileQuestion, Eye, Lock, LucideIcon 
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EntryCardProps {
  entry: EncyclopediaEntry;
  isUnlocked: boolean;
  onClick: () => void;
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

const EntryCard: React.FC<EntryCardProps> = ({ entry, isUnlocked, onClick }) => {
  const isFullyLocked = !isUnlocked && entry.unlockProgress === 'locked';
  const CategoryIcon = categoryIcons[entry.category] || FileQuestion;
  
  // For locked entries, only show a redacted version
  if (isFullyLocked) {
    return (
      <Card className="overflow-hidden border border-border/50 bg-black/30 backdrop-blur-sm transition-all hover:bg-black/40 cursor-pointer relative" onClick={onClick}>
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Lock className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <div className="filter blur-sm pointer-events-none">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">[REDACTED]</h3>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <CategoryIcon className="h-3 w-3" />
                {entry.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-muted-foreground line-clamp-3">
              ████████ ████ ████████ ████████ ███████ ██████ █████ ███████.
              ████████ ████ ████ ██ █████ ████ ████ ████████ ████████.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <p className="text-xs text-muted-foreground/70 italic">
              Unlock through conversation
            </p>
          </CardFooter>
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      className={`overflow-hidden border border-border/50 transition-all hover:shadow-md hover:bg-black/40 cursor-pointer
        ${isUnlocked ? 'bg-black/25' : 'bg-black/30 backdrop-blur-sm'}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 relative">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{entry.title}</h3>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <CategoryIcon className="h-3 w-3" />
            {entry.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {isUnlocked ? entry.reality : entry.partyDescription}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
        <div>
          {!isUnlocked && (
            <span className="text-xs text-yellow-600 flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Party Version
            </span>
          )}
        </div>
        <Badge 
          variant={isUnlocked ? "default" : "secondary"} 
          className="text-xs rounded-sm"
        >
          {isUnlocked ? "Unlocked" : "Partially Revealed"}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default EntryCard; 