import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { NarrativeData } from "@shared/schema";

interface NarrativeChartProps {
  view: "sentiment" | "tension" | "combined";
}

export default function NarrativeChart({ view }: NarrativeChartProps) {
  const [selectedPart, setSelectedPart] = useState("all");
  
  const { data: narrativeData, isLoading } = useQuery<NarrativeData>({
    queryKey: ['/api/books/1/narrative-data'],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex">
            <Skeleton className="h-6 w-60" />
          </CardTitle>
          <div className="mt-1">
            <Skeleton className="h-4 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Filter data based on the selected part
  let filteredData = narrativeData?.chapters || [];
  
  if (selectedPart === "part1") {
    filteredData = filteredData.filter((ch: any) => ch.chapter <= 8);
  } else if (selectedPart === "part2") {
    filteredData = filteredData.filter((ch: any) => ch.chapter > 8 && ch.chapter <= 17);
  } else if (selectedPart === "part3") {
    filteredData = filteredData.filter((ch: any) => ch.chapter > 17);
  }
  
  // Find chapters with key events for reference dots
  const chaptersWithEvents = filteredData.filter((ch: any) => ch.keyEvents && ch.keyEvents.length > 0);
  
  return (
    <Card className="bg-background rounded-lg shadow-md p-6 mb-6">
      <CardHeader className="p-0 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Emotional Journey Through "1984"</CardTitle>
            <CardDescription>
              Negative values show darker/oppressive mood. Larger circles mark key plot events.
            </CardDescription>
          </div>
          <div className="text-sm">
            <Select value={selectedPart} onValueChange={setSelectedPart}>
              <SelectTrigger className="w-[130px] bg-muted border">
                <SelectValue placeholder="All Parts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parts</SelectItem>
                <SelectItem value="part1">Part 1</SelectItem>
                <SelectItem value="part2">Part 2</SelectItem>
                <SelectItem value="part3">Part 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="chapter" 
                label={{ value: 'Chapter', position: 'insideBottomRight', offset: -10 }} 
              />
              <YAxis domain={[-1, 1]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  typeof value === 'number' ? value.toFixed(2) : value, 
                  name === "sentiment" ? "Sentiment" : "Tension"
                ]}
                labelFormatter={(chapter: string) => `Chapter ${chapter}`}
              />
              
              {/* Conditionally render lines based on view */}
              {(view === "sentiment" || view === "combined") && (
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="sentiment"
                />
              )}
              
              {(view === "tension" || view === "combined") && (
                <Line 
                  type="monotone" 
                  dataKey="tension" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="tension"
                />
              )}
              
              {/* Add reference dots for key events */}
              {chaptersWithEvents.map((chapter: any) => (
                <ReferenceDot
                  key={`event-${chapter.chapter}`}
                  x={chapter.chapter}
                  y={chapter.sentiment}
                  r={6}
                  fill="hsl(var(--chart-3))"
                  stroke="white"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      
      <CardFooter className="p-0 pt-4 flex justify-between">
        <div className="flex flex-wrap space-x-4">
          {(view === "sentiment" || view === "combined") && (
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-[hsl(var(--chart-1))] rounded-full mr-2"></span>
              <span className="text-sm">Sentiment</span>
            </div>
          )}
          
          {(view === "tension" || view === "combined") && (
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-[hsl(var(--chart-2))] rounded-full mr-2"></span>
              <span className="text-sm">Tension</span>
            </div>
          )}
          
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[hsl(var(--chart-3))] rounded-full mr-2"></span>
            <span className="text-sm">Key Events</span>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Info className="mr-1 h-4 w-4" /> 
            <span>Sentiment ranges from -1 (negative/oppressive) to 1 (positive/hopeful)</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
