import React from 'react';
import { Suggestion } from './types';

type SuggestionChipProps = {
  suggestion: Suggestion;
  onClick: (suggestion: Suggestion) => void;
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'experience':
      return 'bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-800';
    case 'relationship':
      return 'bg-pink-100 border-pink-300 hover:bg-pink-200 text-pink-800';
    case 'worldview':
      return 'bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-800';
    case 'theme':
      return 'bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-800';
    case 'emotional':
      return 'bg-red-100 border-red-300 hover:bg-red-200 text-red-800';
    case 'analytical':
      return 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200 text-emerald-800';
    default:
      return 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800';
  }
};

const SuggestionChip: React.FC<SuggestionChipProps> = ({ suggestion, onClick }) => {
  return (
    <button
      className={`px-3 py-2 rounded-full text-sm border ${getCategoryColor(
        suggestion.category
      )} transition-colors duration-200 truncate max-w-[220px] text-left`}
      onClick={() => onClick(suggestion)}
      title={suggestion.text}
    >
      {suggestion.text}
    </button>
  );
};

export default SuggestionChip; 