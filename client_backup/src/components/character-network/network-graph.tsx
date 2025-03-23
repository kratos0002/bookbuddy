import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import * as d3 from "d3";

interface NetworkGraphProps {
  view: "all" | "major" | "affiliation";
  onSelectCharacter: (id: number) => void;
}

export default function NetworkGraph({ view, onSelectCharacter }: NetworkGraphProps) {
  const [selectedPart, setSelectedPart] = useState("all");
  const svgRef = useRef<SVGSVGElement>(null);
  
  const { data: networkData, isLoading } = useQuery({
    queryKey: ['/api/books/1/character-network'],
  });
  
  useEffect(() => {
    if (!networkData || !svgRef.current) return;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Filter data based on view
    let filteredNodes = [...networkData.nodes];
    let filteredLinks = [...networkData.links];
    
    if (view === "major") {
      // Keep only larger nodes (major characters)
      const majorNodes = filteredNodes.filter(node => node.size > 20);
      const majorNodeIds = majorNodes.map(node => node.id);
      
      filteredNodes = majorNodes;
      filteredLinks = filteredLinks.filter(
        link => majorNodeIds.includes(link.source) && majorNodeIds.includes(link.target)
      );
    }
    
    // Get SVG dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    // Define color scale for affiliations
    const affiliationColors = {
      "Outer Party": "#3b82f6", // blue
      "Inner Party": "#ef4444", // red
      "Thought Police": "#ef4444", // red
      "The Party": "#ef4444", // red
      "Brotherhood": "#22c55e", // green
      "Proles": "#eab308" // yellow
    };
    
    // Create simulation
    const simulation = d3.forceSimulation(filteredNodes as any)
      .force("link", d3.forceLink(filteredLinks).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.size / 2));
    
    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value));
    
    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(filteredNodes)
      .enter()
      .append("circle")
      .attr("r", (d: any) => d.size / 3)
      .attr("fill", (d: any) => affiliationColors[d.affiliation] || "#999")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        onSelectCharacter(parseInt(d.id));
      })
      .call(d3.drag<SVGCircleElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);
    
    // Add labels to nodes
    const label = svg.append("g")
      .selectAll("text")
      .data(filteredNodes)
      .enter()
      .append("text")
      .text((d: any) => d.name)
      .attr("font-size", 10)
      .attr("dx", (d: any) => d.size / 2)
      .attr("dy", 4)
      .style("pointer-events", "none");
    
    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node
        .attr("cx", (d: any) => d.x = Math.max(d.size / 2, Math.min(width - d.size / 2, d.x)))
        .attr("cy", (d: any) => d.y = Math.max(d.size / 2, Math.min(height - d.size / 2, d.y)));
      
      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [networkData, view, onSelectCharacter]);
  
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
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-background rounded-lg shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Character Relationship Network</CardTitle>
            <CardDescription>Size indicates importance, colors represent affiliation</CardDescription>
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
      
      <CardContent>
        <div className="h-96 w-full">
          <svg ref={svgRef} width="100%" height="100%" />
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap justify-center">
        <div className="flex items-center mx-2">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
          <span className="text-xs">Party Members</span>
        </div>
        <div className="flex items-center mx-2">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
          <span className="text-xs">Inner Party</span>
        </div>
        <div className="flex items-center mx-2">
          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
          <span className="text-xs">Proles</span>
        </div>
        <div className="flex items-center mx-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          <span className="text-xs">Brotherhood</span>
        </div>
        <div className="flex items-center mx-2">
          <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-1"></span>
          <span className="text-xs">Unknown</span>
        </div>
      </CardFooter>
    </Card>
  );
}
