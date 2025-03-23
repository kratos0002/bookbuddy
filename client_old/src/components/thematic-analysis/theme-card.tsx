import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface ThemeCardProps {
  themeId: number;
}

export default function ThemeCard({ themeId }: ThemeCardProps) {
  const { data: theme, isLoading: isLoadingTheme } = useQuery({
    queryKey: [`/api/themes/${themeId}`],
  });
  
  const { data: quotes, isLoading: isLoadingQuotes } = useQuery({
    queryKey: [`/api/themes/${themeId}/quotes`],
  });
  
  if (isLoadingTheme || isLoadingQuotes) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-11/12 mb-4" />
          
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          
          <div className="border-t border-muted pt-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get the correct theme badge color
  const getBadgeColor = (themeType: string) => {
    switch (themeType) {
      case "Primary Theme":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Secondary Theme":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "Major Theme":
        if (theme.name === "Psychological Manipulation") {
          return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
        }
        return "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };
  
  return (
    <Card className="bg-background rounded-lg shadow-md">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium text-lg">{theme.name}</h4>
          <span className={`${getBadgeColor(theme.themeType)} text-xs px-2 py-1 rounded`}>
            {theme.themeType}
          </span>
        </div>
        <p className="text-sm mb-4">{theme.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Prominence Score</span>
            <span>{theme.prominenceScore}%</span>
          </div>
          <Progress value={theme.prominenceScore} className="h-2" />
        </div>
        
        <div className="border-t border-muted pt-4">
          <h5 className="text-sm font-medium mb-2">Key Quotes</h5>
          <div className="text-xs space-y-2">
            {quotes?.slice(0, 2).map((quote) => (
              <blockquote 
                key={quote.id} 
                className="italic pl-3 border-l-2 border-muted"
              >
                "{quote.quote}"
                <div className="text-muted-foreground mt-1 not-italic">{quote.chapter}</div>
              </blockquote>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
