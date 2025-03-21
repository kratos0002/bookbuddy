import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";

interface ThemeHeatmapProps {
  view: "heatmap" | "bar" | "radar";
}

export default function ThemeHeatmap({ view }: ThemeHeatmapProps) {
  const [selectedTheme, setSelectedTheme] = useState("all");
  
  const { data: themeHeatmapData, isLoading } = useQuery({
    queryKey: ['/api/books/1/theme-heatmap'],
  });
  
  const { data: themes } = useQuery({
    queryKey: ['/api/books/1/themes'],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-60" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-40" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Filter data based on the selected theme
  const allThemes = themes || [];
  
  // Create the heatmap cells
  const renderHeatmap = () => {
    if (!themeHeatmapData) return null;
    
    return (
      <div className="h-80 w-full relative">
        <div className="grid" style={{ 
          gridTemplateColumns: `repeat(${themeHeatmapData.chapters.length}, 1fr)`,
          gridTemplateRows: `repeat(${themeHeatmapData.themes.length}, 1fr)`,
          gap: "1px",
          height: "100%",
        }}>
          {themeHeatmapData.intensities.map((themeRow, themeIndex) => (
            themeRow.map((intensity, chapterIndex) => {
              const theme = themeHeatmapData.themes[themeIndex];
              const chapter = themeHeatmapData.chapters[chapterIndex];
              
              // Skip if we're filtering by theme
              if (selectedTheme !== "all" && 
                  theme !== allThemes.find(t => t.id.toString() === selectedTheme)?.name) {
                return null;
              }
              
              // Generate color based on intensity (blue scale)
              const colorIntensity = Math.floor(intensity * 100);
              const bg = `rgba(59, 130, 246, ${intensity})`;
              
              return (
                <div 
                  key={`${themeIndex}-${chapterIndex}`}
                  style={{ backgroundColor: bg }}
                  className="cursor-pointer transition-colors hover:brightness-110"
                  title={`Theme: ${theme}, Chapter: ${chapter}, Intensity: ${Math.floor(intensity * 100)}%`}
                />
              );
            })
          ))}
        </div>
        
        {/* X-axis (chapters) */}
        <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-xs text-muted-foreground">
          <span>Chapter 1</span>
          <span>Chapter {themeHeatmapData.chapters.length}</span>
        </div>
        
        {/* Y-axis (themes) */}
        <div className="absolute top-0 left-[-120px] bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
          {selectedTheme === "all" ? (
            themeHeatmapData.themes.map((theme) => (
              <span key={theme}>{theme}</span>
            ))
          ) : (
            <span>{allThemes.find(t => t.id.toString() === selectedTheme)?.name}</span>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="bg-background rounded-lg shadow-md p-6 mb-6">
      <CardHeader className="p-0 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Thematic Intensity by Chapter</CardTitle>
            <CardDescription>Darker colors indicate stronger thematic presence</CardDescription>
          </div>
          <div className="text-sm">
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-[180px] bg-muted border">
                <SelectValue placeholder="All Themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {allThemes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id.toString()}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 ml-[120px] mt-4">
        {renderHeatmap()}
      </CardContent>
      
      <CardFooter className="p-0 pt-6 justify-center">
        <div className="text-xs text-muted-foreground flex items-center">
          <span>Low Intensity</span>
          <div className="w-48 h-3 mx-2 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-700 rounded"></div>
          <span>High Intensity</span>
        </div>
      </CardFooter>
    </Card>
  );
}
