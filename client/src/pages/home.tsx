import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import NarrativeChart from "@/components/narrative-arc/narrative-chart";
import KeyEvents from "@/components/narrative-arc/key-events";
import ThemeHeatmap from "@/components/thematic-analysis/theme-heatmap";
import ThemeCard from "@/components/thematic-analysis/theme-card";
import NetworkGraph from "@/components/character-network/network-graph";
import CharacterDetails from "@/components/character-network/character-details";
import RelationshipTable from "@/components/character-network/relationship-table";
import AnalysisContent from "@/components/ai-analysis/analysis-content";
import { Button } from "@/components/ui/button";
import { Share, Download, MessageCircle } from "lucide-react";

type ActiveSection = "narrative-arc" | "thematic-analysis" | "character-network" | "ai-analysis";
type NarrativeView = "sentiment" | "tension" | "combined";
type ThematicView = "heatmap" | "bar" | "radar";
type CharacterView = "all" | "major" | "affiliation";
type AnalysisSection = "plot-summary" | "character-analysis" | "thematic-exploration" | "writing-style" | "historical-context" | "contemporary-relevance";

export default function Home() {
  // Active section and view states
  const [activeSection, setActiveSection] = useState<ActiveSection>("narrative-arc");
  const [narrativeView, setNarrativeView] = useState<NarrativeView>("sentiment");
  const [thematicView, setThematicView] = useState<ThematicView>("heatmap");
  const [characterView, setCharacterView] = useState<CharacterView>("all");
  const [analysisSection, setAnalysisSection] = useState<AnalysisSection>("plot-summary");
  
  // Active character for character details
  const [selectedCharacterId, setSelectedCharacterId] = useState<number>(1);
  
  // Fetch book data
  const { data: book, isLoading: isLoadingBook } = useQuery({
    queryKey: ['/api/books/1'],
  });
  
  // Helper function to determine if a section is active
  const isSectionActive = (section: ActiveSection) => activeSection === section;
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        book={book}
        isLoading={isLoadingBook}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold">AI-Powered Analysis: "1984"</h1>
              <p className="text-muted-foreground mt-1">
                Interactive visualizations and AI insights into George Orwell's dystopian masterpiece
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" /> Export Analysis
              </Button>
              <Button className="flex items-center">
                <Share className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
          
          {/* Narrative Arc Section */}
          {isSectionActive("narrative-arc") && (
            <section id="narrative-arc" className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Narrative Arc</h2>
                  <p className="text-muted-foreground">Sentiment and tension analysis across chapters</p>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <div className="inline-flex shadow-sm rounded-md">
                    <Button 
                      variant={narrativeView === "sentiment" ? "default" : "outline"}
                      className={narrativeView === "sentiment" ? "" : "text-muted-foreground"}
                      onClick={() => setNarrativeView("sentiment")}
                    >
                      Sentiment
                    </Button>
                    <Button 
                      variant={narrativeView === "tension" ? "default" : "outline"}
                      className={`${narrativeView === "tension" ? "" : "text-muted-foreground"} rounded-none`}
                      onClick={() => setNarrativeView("tension")}
                    >
                      Tension
                    </Button>
                    <Button 
                      variant={narrativeView === "combined" ? "default" : "outline"}
                      className={narrativeView === "combined" ? "" : "text-muted-foreground"}
                      onClick={() => setNarrativeView("combined")}
                    >
                      Combined
                    </Button>
                  </div>
                </div>
              </div>
              
              <NarrativeChart view={narrativeView} />
              <KeyEvents />
            </section>
          )}
          
          {/* Thematic Analysis Section */}
          {isSectionActive("thematic-analysis") && (
            <section id="thematic-analysis" className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Thematic Analysis</h2>
                  <p className="text-muted-foreground">Major themes and their presence throughout the novel</p>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <div className="inline-flex shadow-sm rounded-md">
                    <Button 
                      variant={thematicView === "heatmap" ? "default" : "outline"}
                      className={thematicView === "heatmap" ? "" : "text-muted-foreground"}
                      onClick={() => setThematicView("heatmap")}
                    >
                      Heatmap
                    </Button>
                    <Button 
                      variant={thematicView === "bar" ? "default" : "outline"}
                      className={`${thematicView === "bar" ? "" : "text-muted-foreground"} rounded-none`}
                      onClick={() => setThematicView("bar")}
                    >
                      Bar Chart
                    </Button>
                    <Button 
                      variant={thematicView === "radar" ? "default" : "outline"}
                      className={thematicView === "radar" ? "" : "text-muted-foreground"}
                      onClick={() => setThematicView("radar")}
                    >
                      Radar
                    </Button>
                  </div>
                </div>
              </div>
              
              <ThemeHeatmap view={thematicView} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ThemeCard themeId={1} />
                <ThemeCard themeId={2} />
                <ThemeCard themeId={3} />
                <ThemeCard themeId={4} />
              </div>
            </section>
          )}
          
          {/* Character Network Section */}
          {isSectionActive("character-network") && (
            <section id="character-network" className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold">Character Network</h2>
                  <p className="text-muted-foreground">Relationships and connections between characters</p>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <div className="inline-flex shadow-sm rounded-md">
                    <Button 
                      variant={characterView === "all" ? "default" : "outline"}
                      className={characterView === "all" ? "" : "text-muted-foreground"}
                      onClick={() => setCharacterView("all")}
                    >
                      All Relationships
                    </Button>
                    <Button 
                      variant={characterView === "major" ? "default" : "outline"}
                      className={`${characterView === "major" ? "" : "text-muted-foreground"} rounded-none`}
                      onClick={() => setCharacterView("major")}
                    >
                      Major Characters
                    </Button>
                    <Button 
                      variant={characterView === "affiliation" ? "default" : "outline"}
                      className={characterView === "affiliation" ? "" : "text-muted-foreground"}
                      onClick={() => setCharacterView("affiliation")}
                    >
                      By Affiliation
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="col-span-2">
                  <NetworkGraph 
                    view={characterView} 
                    onSelectCharacter={setSelectedCharacterId} 
                  />
                </div>
                <div>
                  <CharacterDetails 
                    characterId={selectedCharacterId}
                    onSelectCharacter={setSelectedCharacterId}
                  />
                </div>
              </div>
              
              <RelationshipTable />
            </section>
          )}
          
          {/* AI Analysis Section */}
          {isSectionActive("ai-analysis") && (
            <section id="ai-analysis" className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold">AI-Generated Analysis</h2>
                  <p className="text-muted-foreground">Comprehensive breakdown of "1984" by AI</p>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <Button variant="outline" className="flex items-center mr-2">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                  <Button className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" /> Ask AI
                  </Button>
                </div>
              </div>
              
              <div className="bg-background rounded-lg shadow-md p-6 mb-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-xl mb-4">Analysis Navigation</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={analysisSection === "plot-summary" ? "default" : "outline"} 
                      onClick={() => setAnalysisSection("plot-summary")}
                    >
                      Plot Summary
                    </Button>
                    <Button 
                      variant={analysisSection === "character-analysis" ? "default" : "outline"} 
                      onClick={() => setAnalysisSection("character-analysis")}
                    >
                      Character Analysis
                    </Button>
                    <Button 
                      variant={analysisSection === "thematic-exploration" ? "default" : "outline"} 
                      onClick={() => setAnalysisSection("thematic-exploration")}
                    >
                      Thematic Exploration
                    </Button>
                    <Button 
                      variant={analysisSection === "writing-style" ? "default" : "outline"} 
                      onClick={() => setAnalysisSection("writing-style")}
                    >
                      Writing Style
                    </Button>
                    <Button 
                      variant={analysisSection === "historical-context" ? "default" : "outline"} 
                      onClick={() => setAnalysisSection("historical-context")}
                    >
                      Historical Context
                    </Button>
                    <Button 
                      variant={analysisSection === "contemporary-relevance" ? "default" : "outline"} 
                      onClick={() => setAnalysisSection("contemporary-relevance")}
                    >
                      Contemporary Relevance
                    </Button>
                  </div>
                </div>
                
                <AnalysisContent section={analysisSection} />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
