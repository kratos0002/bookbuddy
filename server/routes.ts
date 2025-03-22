import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateCharacterResponse, 
  generateLibrarianResponse,
  analyzeSentiment,
  identifyRelevantThemes,
  identifyRelevantQuotes,
  isOpenAIConfigured
} from "./services/openai-service";
import { ChatMode, InsertConversation, InsertMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Book routes
  app.get("/api/books", async (req, res) => {
    const books = await storage.getAllBooks();
    res.json(books);
  });
  
  app.get("/api/books/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const book = await storage.getBook(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(book);
  });
  
  // Chapter routes
  app.get("/api/books/:id/chapters", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const chapters = await storage.getChaptersByBookId(id);
    res.json(chapters);
  });
  
  // Key event routes
  app.get("/api/books/:id/key-events", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const keyEvents = await storage.getKeyEventsByBookId(id);
    res.json(keyEvents);
  });
  
  // Theme routes
  app.get("/api/books/:id/themes", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const themes = await storage.getThemesByBookId(id);
    res.json(themes);
  });
  
  app.get("/api/themes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid theme ID" });
    }
    
    const theme = await storage.getThemeById(id);
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }
    
    res.json(theme);
  });
  
  app.get("/api/themes/:id/quotes", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid theme ID" });
    }
    
    const quotes = await storage.getQuotesByThemeId(id);
    res.json(quotes);
  });
  
  // Theme intensity routes
  app.get("/api/books/:id/theme-intensities", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const themeIntensities = await storage.getThemeIntensitiesByBookId(id);
    res.json(themeIntensities);
  });
  
  // Character routes
  app.get("/api/books/:id/characters", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const characters = await storage.getCharactersByBookId(id);
    res.json(characters);
  });
  
  app.get("/api/characters/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid character ID" });
    }
    
    const character = await storage.getCharacterById(id);
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    
    res.json(character);
  });
  
  // Relationship routes
  app.get("/api/books/:id/relationships", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const relationships = await storage.getRelationshipsByBookId(id);
    res.json(relationships);
  });
  
  // AI Analysis routes
  app.get("/api/books/:id/ai-analyses", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const analyses = await storage.getAiAnalysisByBookId(id);
    res.json(analyses);
  });
  
  app.get("/api/books/:id/ai-analyses/:section", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const section = req.params.section;
    const analysis = await storage.getAiAnalysisBySection(id, section);
    
    if (!analysis) {
      return res.status(404).json({ message: "Analysis section not found" });
    }
    
    res.json(analysis);
  });
  
  // Visualization data routes
  app.get("/api/books/:id/character-network", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const networkData = await storage.getCharacterNetworkData(id);
    res.json(networkData);
  });
  
  app.get("/api/books/:id/narrative-data", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const narrativeData = await storage.getNarrativeData(id);
    res.json(narrativeData);
  });
  
  app.get("/api/books/:id/theme-heatmap", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const heatmapData = await storage.getThemeHeatmapData(id);
    res.json(heatmapData);
  });

  const httpServer = createServer(app);

  return httpServer;
}
