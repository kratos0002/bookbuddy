import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { BookOpen, LineChart, Network, Share2, Moon, Sun, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ActiveSection = "narrative-arc" | "thematic-analysis" | "character-network" | "ai-analysis";

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  book: any;
  isLoading: boolean;
}

export default function Sidebar({ activeSection, onSectionChange, book, isLoading }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [expanded, setExpanded] = useState(true);
  
  // Collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const isDarkMode = theme === "dark";
  
  return (
    <aside className={`${expanded ? 'w-64' : 'w-16'} bg-primary text-white flex flex-col transition-all duration-300`}>
      <div className="p-4 flex items-center justify-center md:justify-start space-x-2">
        <BookOpen className="h-6 w-6" />
        {expanded && <h1 className="font-serif font-bold text-xl">LitViz</h1>}
      </div>
      
      <div className="mt-8 flex flex-col flex-1">
        {expanded && (
          <div className="px-4 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-blue-200 font-semibold mb-2">Current Book</h2>
            <div className="flex items-center space-x-3 p-2 bg-primary-700 rounded">
              {isLoading ? (
                <>
                  <Skeleton className="w-10 h-14 rounded bg-primary-600" />
                  <div>
                    <Skeleton className="w-20 h-4 bg-primary-600" />
                    <Skeleton className="w-16 h-3 mt-1 bg-primary-600" />
                  </div>
                </>
              ) : (
                <>
                  <img 
                    src={book?.coverUrl || "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"} 
                    alt="Book Cover" 
                    className="w-10 h-14 rounded" 
                  />
                  <div>
                    <p className="font-bold">{book?.title || "1984"}</p>
                    <p className="text-sm text-blue-200">{book?.author || "George Orwell"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        <nav className="flex-1">
          {expanded && (
            <div className="px-4 mb-2">
              <h2 className="text-sm uppercase tracking-wider text-blue-200 font-semibold">Visualizations</h2>
            </div>
          )}
          
          <button 
            onClick={() => onSectionChange("narrative-arc")}
            className={`flex items-center px-4 py-3 text-blue-100 hover:bg-primary-700 w-full ${activeSection === "narrative-arc" ? "bg-primary-700" : ""}`}
          >
            <LineChart className="h-5 w-5" />
            {expanded && <span className="ml-3">Narrative Arc</span>}
          </button>
          
          <button 
            onClick={() => onSectionChange("thematic-analysis")}
            className={`flex items-center px-4 py-3 text-blue-100 hover:bg-primary-700 w-full ${activeSection === "thematic-analysis" ? "bg-primary-700" : ""}`}
          >
            <Share2 className="h-5 w-5" />
            {expanded && <span className="ml-3">Thematic Analysis</span>}
          </button>
          
          <button 
            onClick={() => onSectionChange("character-network")}
            className={`flex items-center px-4 py-3 text-blue-100 hover:bg-primary-700 w-full ${activeSection === "character-network" ? "bg-primary-700" : ""}`}
          >
            <Network className="h-5 w-5" />
            {expanded && <span className="ml-3">Character Network</span>}
          </button>
          
          <button 
            onClick={() => onSectionChange("ai-analysis")}
            className={`flex items-center px-4 py-3 text-blue-100 hover:bg-primary-700 w-full ${activeSection === "ai-analysis" ? "bg-primary-700" : ""}`}
          >
            <Users className="h-5 w-5" />
            {expanded && <span className="ml-3">AI Analysis</span>}
          </button>
        </nav>
        
        <div className="mt-auto border-t border-primary-700 pt-4 pb-6 px-4">
          <button 
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className="flex items-center justify-center md:justify-start w-full text-sm text-blue-100 hover:text-white py-2"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-5 w-5" />
                {expanded && <span className="ml-3">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                {expanded && <span className="ml-3">Dark Mode</span>}
              </>
            )}
          </button>
          
          {expanded && (
            <button 
              onClick={toggleSidebar}
              className="mt-2 w-full flex items-center justify-center text-xs text-blue-300 hover:text-white"
            >
              Collapse &rarr;
            </button>
          )}
          
          {!expanded && (
            <button 
              onClick={toggleSidebar}
              className="mt-2 w-full flex items-center justify-center text-xs text-blue-300 hover:text-white"
            >
              &rarr;
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
