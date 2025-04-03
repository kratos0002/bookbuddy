import React from 'react';
import { EncyclopediaEntry } from '@/contexts/EncyclopediaContext';
import { 
  Building2, Users, Lightbulb, Calendar, 
  Package, FileQuestion, Eye, Lock, LucideIcon,
  BookOpen, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

const EntryCard: React.FC<EntryCardProps> = ({ entry, isUnlocked, onClick }) => {
  const isFullyLocked = !isUnlocked && entry.unlockProgress === 'locked';
  const CategoryIcon = categoryIcons[entry.category] || FileQuestion;
  const colorName = getCategoryColor(entry.category);
  
  // For locked entries, show a redacted version
  if (isFullyLocked) {
    return (
      <Card 
        className="overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-black/30 backdrop-blur-sm 
          transition-all hover:bg-black/40 cursor-pointer relative shadow-md group"
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
              <Badge variant="outline" className="text-xs flex items-center gap-1">
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
  
  // Custom styling based on color name and unlock status
  const cardBorder = isUnlocked 
    ? cn("border-2", {
        "border-amber-300 dark:border-amber-800": colorName === "amber",
        "border-red-300 dark:border-red-800": colorName === "red",
        "border-blue-300 dark:border-blue-800": colorName === "blue",
        "border-purple-300 dark:border-purple-800": colorName === "purple",
        "border-green-300 dark:border-green-800": colorName === "green",
        "border-cyan-300 dark:border-cyan-800": colorName === "cyan",
        "border-orange-300 dark:border-orange-800": colorName === "orange",
        "border-slate-300 dark:border-slate-800": colorName === "slate",
      })
    : "border-2 border-amber-300 dark:border-amber-800";
  
  const cardBg = isUnlocked 
    ? cn({
        "bg-amber-50/50 dark:bg-amber-950/20": colorName === "amber",
        "bg-red-50/50 dark:bg-red-950/20": colorName === "red",
        "bg-blue-50/50 dark:bg-blue-950/20": colorName === "blue",
        "bg-purple-50/50 dark:bg-purple-950/20": colorName === "purple",
        "bg-green-50/50 dark:bg-green-950/20": colorName === "green",
        "bg-cyan-50/50 dark:bg-cyan-950/20": colorName === "cyan",
        "bg-orange-50/50 dark:bg-orange-950/20": colorName === "orange",
        "bg-slate-50/50 dark:bg-slate-950/20": colorName === "slate",
      })
    : "bg-amber-50/50 dark:bg-amber-950/20";
  
  const titleColor = isUnlocked 
    ? cn({
        "text-amber-800 dark:text-amber-300": colorName === "amber",
        "text-red-800 dark:text-red-300": colorName === "red",
        "text-blue-800 dark:text-blue-300": colorName === "blue",
        "text-purple-800 dark:text-purple-300": colorName === "purple",
        "text-green-800 dark:text-green-300": colorName === "green",
        "text-cyan-800 dark:text-cyan-300": colorName === "cyan",
        "text-orange-800 dark:text-orange-300": colorName === "orange",
        "text-slate-800 dark:text-slate-300": colorName === "slate",
      })
    : "text-amber-800 dark:text-amber-300";
  
  const bannerColor = isUnlocked 
    ? cn("h-1.5 w-full", {
        "bg-amber-500/50 dark:bg-amber-500/30": colorName === "amber",
        "bg-red-500/50 dark:bg-red-500/30": colorName === "red",
        "bg-blue-500/50 dark:bg-blue-500/30": colorName === "blue",
        "bg-purple-500/50 dark:bg-purple-500/30": colorName === "purple",
        "bg-green-500/50 dark:bg-green-500/30": colorName === "green",
        "bg-cyan-500/50 dark:bg-cyan-500/30": colorName === "cyan",
        "bg-orange-500/50 dark:bg-orange-500/30": colorName === "orange",
        "bg-slate-500/50 dark:bg-slate-500/30": colorName === "slate",
      })
    : "h-1.5 w-full bg-amber-500/50 dark:bg-amber-500/30";
  
  const iconColor = isUnlocked 
    ? cn({
        "text-amber-600 dark:text-amber-400": colorName === "amber",
        "text-red-600 dark:text-red-400": colorName === "red",
        "text-blue-600 dark:text-blue-400": colorName === "blue",
        "text-purple-600 dark:text-purple-400": colorName === "purple",
        "text-green-600 dark:text-green-400": colorName === "green",
        "text-cyan-600 dark:text-cyan-400": colorName === "cyan",
        "text-orange-600 dark:text-orange-400": colorName === "orange",
        "text-slate-600 dark:text-slate-400": colorName === "slate",
      })
    : "text-amber-600 dark:text-amber-400";
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all group cursor-pointer hover:shadow-lg shadow-sm hover:-translate-y-1",
        cardBorder,
        cardBg,
      )}
      onClick={onClick}
    >
      {/* Top decorative banner */}
      <div className={bannerColor}></div>
      
      <CardHeader className="p-5 pb-3 relative">
        <div className="flex items-center justify-between">
          <h3 className={cn("font-bold tracking-tight", titleColor)}>
            {entry.title}
          </h3>
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
          className={cn(
            "text-xs rounded-sm px-2 py-0.5",
            isUnlocked 
              ? "bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
              : "bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800"
          )}
        >
          {isUnlocked ? "Unlocked" : "Partially Revealed"}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default EntryCard; 