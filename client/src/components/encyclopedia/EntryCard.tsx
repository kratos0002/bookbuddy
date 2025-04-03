import React from 'react';
import { EncyclopediaEntry } from '@/contexts/EncyclopediaContext';
import { 
  Building2, Users, Lightbulb, Calendar, 
  Package, FileQuestion, Eye, Lock, LucideIcon,
  BookOpen, AlertTriangle
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

// Add thematic color scheme by category
const categoryColors: Record<string, { bg: string, text: string, border: string, icon: string }> = {
  'Locations': { bg: 'bg-amber-950/10', text: 'text-amber-800', border: 'border-amber-900/20', icon: 'text-amber-700' },
  'Organizations': { bg: 'bg-red-950/10', text: 'text-red-800', border: 'border-red-900/20', icon: 'text-red-700' },
  'Concepts': { bg: 'bg-blue-950/10', text: 'text-blue-800', border: 'border-blue-900/20', icon: 'text-blue-700' },
  'Events': { bg: 'bg-purple-950/10', text: 'text-purple-800', border: 'border-purple-900/20', icon: 'text-purple-700' },
  'Objects': { bg: 'bg-green-950/10', text: 'text-green-800', border: 'border-green-900/20', icon: 'text-green-700' },
  'Technology': { bg: 'bg-cyan-950/10', text: 'text-cyan-800', border: 'border-cyan-900/20', icon: 'text-cyan-700' },
  'People': { bg: 'bg-orange-950/10', text: 'text-orange-800', border: 'border-orange-900/20', icon: 'text-orange-700' },
};

const EntryCard: React.FC<EntryCardProps> = ({ entry, isUnlocked, onClick }) => {
  const isFullyLocked = !isUnlocked && entry.unlockProgress === 'locked';
  const CategoryIcon = categoryIcons[entry.category] || FileQuestion;
  
  // Get category-specific styling or default to a neutral style
  const categoryStyle = categoryColors[entry.category] || { 
    bg: 'bg-slate-950/10', 
    text: 'text-slate-800', 
    border: 'border-slate-900/20',
    icon: 'text-slate-700'
  };
  
  // For locked entries, show a redacted version
  if (isFullyLocked) {
    return (
      <Card 
        className={`
          overflow-hidden border-2 ${categoryStyle.border} bg-black/30 backdrop-blur-sm 
          transition-all hover:bg-black/40 cursor-pointer relative
          hover:shadow-md hover:shadow-black/20 group
        `} 
        onClick={onClick}
      >
        {/* Semi-transparent overlay with lock icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 z-10">
          <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-full bg-black/50 transform group-hover:scale-110 transition-transform">
            <Lock className="h-10 w-10 text-red-500/70" />
            <span className="text-xs font-bold uppercase tracking-wide text-red-400/70">Classified</span>
          </div>
        </div>
        
        {/* Red stamp effect */}
        <div className="absolute top-2 right-2 rotate-12 z-20 opacity-80">
          <AlertTriangle className="h-10 w-10 text-red-600/80" />
        </div>
        
        {/* Blurred card content */}
        <div className="filter blur-sm pointer-events-none">
          <CardHeader className="p-5 pb-2 border-b border-dashed border-muted">
            <div className="flex items-center justify-between">
              <h3 className="font-bold tracking-tight">[REDACTED]</h3>
              <Badge variant="outline" className={`text-xs flex items-center gap-1 ${categoryStyle.icon}`}>
                <CategoryIcon className="h-3 w-3" />
                {entry.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            <p className="text-sm text-muted-foreground line-clamp-3">
              ████████ ████ ████████ ████████ ███████ ██████ █████ ███████.
              ████████ ████ ████ ██ █████ ████ ████ ████████ ████████.
            </p>
          </CardContent>
          <CardFooter className="p-5 pt-2">
            <p className="text-xs text-red-400/80 italic flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              Unlock through conversation
            </p>
          </CardFooter>
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      className={`
        overflow-hidden border-2 transition-all group cursor-pointer
        ${isUnlocked 
          ? `${categoryStyle.border} ${categoryStyle.bg} hover:shadow-lg hover:shadow-${categoryStyle.border}/30` 
          : 'border-amber-900/30 bg-amber-50/30 hover:shadow-md hover:shadow-amber-900/20'}
        hover:translate-y-[-2px]
      `}
      onClick={onClick}
    >
      {/* Top decorative banner */}
      <div className={`h-1.5 w-full ${isUnlocked ? categoryStyle.bg.replace('/10', '/40') : 'bg-amber-500/30'}`}></div>
      
      <CardHeader className="p-5 pb-3 relative">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold tracking-tight ${isUnlocked ? categoryStyle.text : 'text-amber-800'}`}>
            {entry.title}
          </h3>
          <Badge 
            variant="outline" 
            className={`
              text-xs flex items-center gap-1 
              ${isUnlocked ? categoryStyle.icon : 'text-amber-700'}
              border-2 px-2 py-0.5
            `}
          >
            <CategoryIcon className="h-3 w-3" />
            {entry.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 group-hover:line-clamp-none transition-all">
          {isUnlocked ? entry.reality : entry.partyDescription}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-2 text-xs text-muted-foreground flex justify-between items-center border-t border-dashed border-muted/50">
        <div>
          {!isUnlocked && (
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
              <BookOpen className="h-3.5 w-3.5" />
              Party Version
            </span>
          )}
          {isUnlocked && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <Eye className="h-3.5 w-3.5" />
              Truth Revealed
            </span>
          )}
        </div>
        <Badge 
          variant={isUnlocked ? "default" : "secondary"} 
          className={`
            text-xs rounded-sm px-2 py-0.5
            ${isUnlocked 
              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300' 
              : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300'}
          `}
        >
          {isUnlocked ? "Unlocked" : "Partially Revealed"}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default EntryCard; 