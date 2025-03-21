import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type AnalysisSectionMapping = {
  "plot-summary": string;
  "character-analysis": string;
  "thematic-exploration": string;
  "writing-style": string;
  "historical-context": string;
  "contemporary-relevance": string;
};

// Map frontend section names to backend section names
const sectionMapping: AnalysisSectionMapping = {
  "plot-summary": "Plot Summary",
  "character-analysis": "Character Analysis",
  "thematic-exploration": "Thematic Exploration",
  "writing-style": "Writing Style",
  "historical-context": "Historical Context",
  "contemporary-relevance": "Contemporary Relevance"
};

interface AnalysisContentProps {
  section: keyof AnalysisSectionMapping;
}

export default function AnalysisContent({ section }: AnalysisContentProps) {
  const backendSection = sectionMapping[section];
  
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: [`/api/books/1/ai-analyses/${backendSection}`],
  });
  
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-6 w-60 mb-4" />
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-11/12 mb-2" />
          <Skeleton className="h-4 w-full mb-6" />
          
          <Skeleton className="h-5 w-40 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-11/12 mb-6" />
          
          <Skeleton className="h-16 w-full rounded-md mb-4" />
          
          <Skeleton className="h-5 w-40 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-11/12 mb-6" />
        </div>
      </div>
    );
  }
  
  if (error || !analysis) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Analysis not available</h3>
        <p className="text-muted-foreground mb-4">
          The {backendSection} section is not yet available for this book.
        </p>
        <Button variant="outline">Request Analysis</Button>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="font-serif text-xl font-bold mb-4">{analysis.sectionName}</h3>
      
      <div 
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: analysis.content }}
      />
      
      {section === "plot-summary" && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="text-primary border-primary">
            Continue Reading Full Analysis
          </Button>
        </div>
      )}
      
      {analysis.keyPoints && analysis.keyPoints.length > 0 && (
        <div className="bg-muted p-4 rounded my-4">
          <h5 className="font-medium mb-2">Key Points:</h5>
          <ul className="list-disc list-inside space-y-1">
            {analysis.keyPoints.map((point: string, index: number) => (
              <li key={index} className="text-sm">{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
