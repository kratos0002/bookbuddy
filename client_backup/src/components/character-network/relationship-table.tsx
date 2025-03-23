import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function RelationshipTable() {
  const { data: relationships, isLoading } = useQuery({
    queryKey: ['/api/books/1/relationships'],
  });
  
  const { data: characters } = useQuery({
    queryKey: ['/api/books/1/characters'],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-60" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get character names for display
  const getCharacterName = (id: number) => {
    const character = characters?.find(c => c.id === id);
    return character ? character.name : `Character ${id}`;
  };
  
  // Get color for narrative impact badges
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Major":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Moderate":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Minor":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };
  
  return (
    <Card className="bg-background rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Key Relationship Dynamics</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-muted">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Characters</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Relationship Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Interaction Frequency</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Power Dynamic</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Narrative Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted text-sm">
              {relationships?.map((relationship) => (
                <tr key={relationship.id}>
                  <td className="px-4 py-3">
                    {getCharacterName(relationship.character1Id)} & {getCharacterName(relationship.character2Id)}
                  </td>
                  <td className="px-4 py-3">{relationship.relationType}</td>
                  <td className="px-4 py-3">
                    <div className="w-24 bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${relationship.interactionFrequency * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{relationship.powerDynamic}</td>
                  <td className="px-4 py-3">
                    <span className={`${getImpactColor(relationship.narrativeImpact)} text-xs px-2 py-0.5 rounded`}>
                      {relationship.narrativeImpact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
