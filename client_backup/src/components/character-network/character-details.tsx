import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CharacterDetailsProps {
  characterId: number;
  onSelectCharacter: (id: number) => void;
}

export default function CharacterDetails({ characterId, onSelectCharacter }: CharacterDetailsProps) {
  const { data: character, isLoading: isLoadingCharacter } = useQuery({
    queryKey: [`/api/characters/${characterId}`],
  });
  
  const { data: characters, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['/api/books/1/characters'],
  });
  
  if (isLoadingCharacter || isLoadingCharacters) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-4 w-full my-2" />
          <Skeleton className="h-4 w-full my-2" />
          <Skeleton className="h-4 w-full my-2" />
          <Skeleton className="h-4 w-full my-2" />
          <Skeleton className="h-4 w-full my-2" />
          <Skeleton className="h-8 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }
  
  const handleCharacterChange = (value: string) => {
    onSelectCharacter(parseInt(value));
  };
  
  // Get the right color for the affiliation badge
  const getAffiliationColor = (affiliation: string) => {
    switch (affiliation) {
      case "Outer Party":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Inner Party":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "Thought Police":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "Brotherhood":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };
  
  return (
    <Card className="bg-background rounded-lg shadow-md h-full">
      <CardHeader>
        <CardTitle>Character Details</CardTitle>
        <CardDescription>Select a character on the network or from the list below</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <Select value={characterId.toString()} onValueChange={handleCharacterChange}>
            <SelectTrigger className="w-full bg-muted border">
              <SelectValue placeholder="Select Character" />
            </SelectTrigger>
            <SelectContent>
              {characters?.map((char) => (
                <SelectItem key={char.id} value={char.id.toString()}>
                  {char.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="border-t border-muted pt-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium">{character.name}</h4>
            <span className={`${getAffiliationColor(character.affiliation)} text-xs px-2 py-1 rounded`}>
              {character.affiliation}
            </span>
          </div>
          
          <div className="space-y-3 text-sm">
            <p><strong>Role:</strong> {character.role}</p>
            <p><strong>Connections:</strong> {character.connectionCount} major relationships</p>
            <p><strong>Character Arc:</strong> {character.characterArc}</p>
            
            <div>
              <p className="font-medium mb-1">Key Relationships:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                {/* For Winston Smith, show his key relationships */}
                {character.id === 1 && (
                  <>
                    <li><span className="font-medium">Julia</span> - Lover and fellow rebel</li>
                    <li><span className="font-medium">O'Brien</span> - Supposed ally, actual antagonist</li>
                    <li><span className="font-medium">Mr. Charrington</span> - Landlord, secret Thought Police</li>
                  </>
                )}
                {/* For Julia, show her key relationships */}
                {character.id === 2 && (
                  <>
                    <li><span className="font-medium">Winston Smith</span> - Lover and fellow rebel</li>
                    <li><span className="font-medium">O'Brien</span> - Betrayer and torturer</li>
                  </>
                )}
                {/* For O'Brien, show his key relationships */}
                {character.id === 3 && (
                  <>
                    <li><span className="font-medium">Winston Smith</span> - Target for manipulation and torture</li>
                    <li><span className="font-medium">Julia</span> - Secondary target</li>
                    <li><span className="font-medium">Big Brother</span> - Devotion and loyalty</li>
                  </>
                )}
                {/* For other characters, show a default message */}
                {character.id > 3 && (
                  <li><span className="italic">Key relationships data available in extended analysis</span></li>
                )}
              </ul>
            </div>
            
            <p><strong>Psychological Profile:</strong> {character.psychologicalProfile}</p>
            
            <Button variant="outline" className="w-full mt-2 text-primary">
              View Full Character Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
