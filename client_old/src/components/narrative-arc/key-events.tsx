import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function KeyEvents() {
  const { data: keyEvents, isLoading } = useQuery({
    queryKey: ['/api/books/1/key-events'],
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-l-4 border-[hsl(var(--chart-3))]">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-3 w-16 my-1" />
                  <Skeleton className="h-5 w-48 mt-2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-3" />
              <Skeleton className="h-4 w-11/12 mt-1" />
              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {keyEvents?.map((event) => (
        <Card key={event.id} className="bg-background rounded-lg shadow-md border-l-4 border-[hsl(var(--chart-3))]">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Chapter {event.chapterId}</span>
                <h4 className="font-medium mt-1">{event.title}</h4>
              </div>
              <span className="bg-muted text-foreground text-xs px-2 py-1 rounded">{event.eventType}</span>
            </div>
            <p className="mt-3 text-sm">{event.description}</p>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 
                    ${event.tensionLevel === "High" || event.tensionLevel === "Extreme" ? "bg-red-500" : 
                      event.tensionLevel === "Medium" ? "bg-yellow-500" : "bg-blue-500"}`}>
                  </span>
                  <span className="text-xs">Tension: {event.tensionLevel}</span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1
                    ${event.sentimentType === "Negative" || event.sentimentType === "Very Negative" ? "bg-blue-500" : 
                      event.sentimentType === "Mixed" ? "bg-green-500" : "bg-blue-500"}`}>
                  </span>
                  <span className="text-xs">Sentiment: {event.sentimentType}</span>
                </div>
              </div>
              <Button variant="link" size="sm" className="text-xs text-primary p-0 h-auto">See analysis →</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
