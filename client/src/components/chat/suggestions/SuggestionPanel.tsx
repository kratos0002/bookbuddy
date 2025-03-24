import React, { useState, useEffect } from 'react';
import { Suggestion, SuggestionContext } from './types';
import { getSuggestions, resetSuggestionsForCharacter } from './suggestionService';
import SuggestionChip from './SuggestionChip';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuggestionPanelProps {
  characterId: number | null;
  messageCount: number;
  onSuggestionClick: (text: string) => void;
  className?: string;
  preferredCategories?: string[];
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
  characterId,
  messageCount,
  onSuggestionClick,
  className = '',
  preferredCategories,
  minimized = false,
  onToggleMinimize
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Update suggestions when the character changes
  useEffect(() => {
    if (characterId !== undefined) {
      resetSuggestionsForCharacter(characterId);
      refreshSuggestions();
    }
  }, [characterId]);

  // Refresh suggestions
  const refreshSuggestions = () => {
    const context: SuggestionContext = {
      characterId,
      messageCount,
      preferredCategories: preferredCategories as any
    };

    const newSuggestions = getSuggestions(context);
    setSuggestions(newSuggestions);
  };

  // Handle suggestion click
  const handleSuggestionClick = async (suggestion: Suggestion) => {
    // Call the suggestion tracking API
    try {
      await fetch('/api/suggestions/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: suggestion.characterId,
          category: suggestion.category,
          suggestionId: suggestion.id
        })
      });
    } catch (error) {
      console.error('Error tracking suggestion:', error);
    }

    // Pass the suggestion text to the parent component
    onSuggestionClick(suggestion.text);
    
    // Refresh the suggestions
    refreshSuggestions();
  };

  if (minimized) {
    return (
      <div className={`flex justify-center my-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleMinimize}
          className="text-xs"
        >
          Show Suggestions
        </Button>
      </div>
    );
  }

  return (
    <div className={`mb-4 px-2 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-muted-foreground">Suggested questions:</div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshSuggestions}
            className="h-6 w-6 rounded-full"
            title="Refresh suggestions"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="h-6 text-xs p-1"
            >
              Hide
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <SuggestionChip
            key={suggestion.id}
            suggestion={suggestion}
            onClick={handleSuggestionClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionPanel; 