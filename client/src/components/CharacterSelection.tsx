
import React from 'react';
import { useBook } from '../contexts/BookContext';
import { Character } from '../data/books';
import { BookOpen, User, AlertCircle } from 'lucide-react';

const CharacterSelection: React.FC = () => {
  const { selectedBook, selectedCharacter, setSelectedCharacter } = useBook();

  return (
    <div className="w-full p-4 bg-background/90 border-t border-border backdrop-blur-sm">
      <h2 className="text-sm font-medium text-muted-foreground mb-3 tracking-wide flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-book-primary animate-pulse"></span>
        TALK TO:
      </h2>
      <div className="flex flex-wrap gap-3">
        {selectedBook.characters.map((character) => (
          <CharacterButton
            key={character.id}
            character={character}
            isSelected={selectedCharacter?.id === character.id}
            onClick={() => setSelectedCharacter(character)}
          />
        ))}
      </div>
    </div>
  );
};

interface CharacterButtonProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
}

const CharacterButton: React.FC<CharacterButtonProps> = ({ character, isSelected, onClick }) => {
  // Character-specific styling
  const getCharacterStyles = () => {
    if (character.id === 'librarian') {
      return {
        selectedBg: 'bg-accent text-white',
        defaultBg: 'bg-accent/10 hover:bg-accent/20 text-accent',
        icon: <BookOpen size={14} />
      };
    } else if (character.id === 'winston') {
      return {
        selectedBg: 'bg-book-primary text-white',
        defaultBg: 'bg-book-primary/10 hover:bg-book-primary/20 text-book-primary',
        icon: <User size={14} />
      };
    } else if (character.id === 'julia') {
      return {
        selectedBg: 'bg-[#D4A29C] text-white',
        defaultBg: 'bg-[#D4A29C]/10 hover:bg-[#D4A29C]/20 text-[#D4A29C]',
        icon: <User size={14} />
      };
    } else if (character.id === 'obrien') {
      return {
        selectedBg: 'bg-[#2D2D2D] text-white',
        defaultBg: 'bg-[#2D2D2D]/10 hover:bg-[#2D2D2D]/20 text-[#2D2D2D]',
        icon: <AlertCircle size={14} />
      };
    }
    
    return {
      selectedBg: 'bg-foreground text-background',
      defaultBg: 'bg-secondary hover:bg-secondary/80 text-foreground',
      icon: <User size={14} />
    };
  };

  const styles = getCharacterStyles();

  return (
    <button
      className={`
        px-4 py-2 rounded-full transition-all duration-300 ease-in-out
        text-sm font-medium flex items-center gap-2
        ${isSelected ? styles.selectedBg : styles.defaultBg}
        ${isSelected ? 'shadow-md' : ''}
      `}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        isSelected ? 'bg-white/30' : 'bg-background/50'
      }`}>
        {styles.icon}
      </div>
      {character.name}
    </button>
  );
};

export default CharacterSelection;
