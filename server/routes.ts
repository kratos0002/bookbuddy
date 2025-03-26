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
import OpenAI from "openai";
import { ChatModes, InsertConversation, InsertMessage, Message, Theme, ThemeQuote, Character } from "@shared/schema";
import path from "path";
import { db } from "./db";
import { getLibrarianResponse } from "./services/simple-librarian";
import { SuggestionCategory } from '../client/src/components/chat/suggestions/types';
import quoteExplorerService from "./services/quote-explorer-service";
import feedbackRoutes from './routes/feedback';
import adminRoutes from './routes/admin';
import healthRoutes from './routes/health';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Add a simple librarian endpoint without complex dependencies
export async function registerRoutes(app: Express): Promise<Server> {
  // Register feedback routes
  app.use('/api/feedback', feedbackRoutes);
  
  // Register admin routes
  app.use('/api/admin', adminRoutes);

  // Register health check route
  app.use('/api/health', healthRoutes);

  // Simple Librarian API
  app.post("/api/simple-librarian", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required field: message" 
        });
      }
      
      console.log(`[simple-librarian] API request received for message: "${message.substring(0, 30)}..."`);
      
      const response = await getLibrarianResponse(message);
      
      return res.json({
        success: true,
        message: message,
        response: response
      });
    } catch (error) {
      console.error("[simple-librarian] API error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to generate librarian response", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

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
  
  // Add endpoint to get all characters
  app.get("/api/characters", async (req, res) => {
    try {
      // Get all books
      const books = await storage.getAllBooks();
      
      // Create an array to store all characters
      let allCharacters: Character[] = [];
      
      // For each book, get its characters and add them to the array
      for (const book of books) {
        const bookCharacters = await storage.getCharactersByBookId(book.id);
        allCharacters = [...allCharacters, ...bookCharacters];
      }
      
      // Return all characters
      res.json(allCharacters);
    } catch (error) {
      console.error("Error fetching all characters:", error);
      res.status(500).json({ message: "Failed to fetch characters" });
    }
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

  // Character Personas routes
  app.get("/api/character-personas", async (req, res) => {
    const personas = await storage.getCharacterPersonas();
    res.json(personas);
  });

  app.get("/api/character-personas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid persona ID" });
    }
    
    const persona = await storage.getCharacterPersonaById(id);
    if (!persona) {
      return res.status(404).json({ message: "Character persona not found" });
    }
    
    res.json(persona);
  });

  app.get("/api/characters/:id/persona", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid character ID" });
    }
    
    const persona = await storage.getCharacterPersonaByCharacterId(id);
    if (!persona) {
      return res.status(404).json({ message: "Character persona not found" });
    }
    
    res.json(persona);
  });

  // Librarian Persona routes
  app.get("/api/librarian-personas", async (req, res) => {
    const personas = await storage.getLibrarianPersonas();
    res.json(personas);
  });

  app.get("/api/librarian-personas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid persona ID" });
    }
    
    const persona = await storage.getLibrarianPersonaById(id);
    if (!persona) {
      return res.status(404).json({ message: "Librarian persona not found" });
    }
    
    res.json(persona);
  });

  app.get("/api/books/:id/librarian", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    
    const persona = await storage.getLibrarianPersonaByBookId(id);
    if (!persona) {
      return res.status(404).json({ message: "Librarian persona not found for this book" });
    }
    
    res.json(persona);
  });

  // Conversation routes
  app.get("/api/conversations", async (req, res) => {
    const conversations = await storage.getConversations();
    res.json(conversations);
  });

  app.get("/api/conversations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }
    
    const conversation = await storage.getConversationById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    
    res.json(conversation);
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const conversationData = req.body as InsertConversation;
      const newConversation = await storage.createConversation(conversationData);
      res.status(201).json(newConversation);
    } catch (err) {
      console.error("Error creating conversation:", err);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Message routes
  app.get("/api/conversations/:id/messages", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }
    
    const messages = await storage.getMessagesByConversationId(id);
    res.json(messages);
  });

  // Process message (user -> AI response)
  app.post("/api/conversations/:id/messages", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }
    
    console.log("Received message request");
    
    try {
      const messageData = req.body as InsertMessage;
      messageData.conversationId = id;
      
      // Log the incoming message
      console.log("Processing message:", messageData);
      
      // For user messages, analyze sentiment and identify relevant themes and quotes
      if (messageData.isUserMessage) {
        try {
          // Calculate sentiment score
          messageData.sentimentScore = await analyzeSentiment(messageData.content);
          
          // Identify relevant themes
          const bookId = 1; // Default to 1984 for now
          const allThemes = await storage.getThemesByBookId(bookId);
          messageData.relevantThemeIds = await identifyRelevantThemes(messageData.content, allThemes);
          
          // Initialize empty array for quote IDs
          messageData.relevantQuoteIds = [];
          
          // Skip quote identification completely to avoid errors
          console.log("Quote identification has been disabled to prevent errors");
          
          /*
          // This code is commented out because it was causing errors
          // Get all quotes for the relevant themes
          let relevantThemeIds = messageData.relevantThemeIds;
          if (relevantThemeIds && Array.isArray(relevantThemeIds) && relevantThemeIds.length > 0) {
            try {
              // Get quotes for each theme
              const allQuotesPromises = relevantThemeIds.map(themeId => 
                storage.getQuotesByThemeId(themeId)
              );
              
              // Wait for all quote retrievals to complete
              const allThemeQuotes = await Promise.all(allQuotesPromises);
              
              // Flatten the array of arrays
              const flattenedQuotes = allThemeQuotes.flat();
              
              // Convert to expected format for identifyRelevantQuotes
              const formattedQuotes = flattenedQuotes.map(quote => ({
                id: quote.id,
                text: quote.quoteText,
                chapterNumber: quote.chapterNumber
              }));
              
              // Get relevant quote IDs
              messageData.relevantQuoteIds = await identifyRelevantQuotes(
                messageData.content, 
                formattedQuotes
              );
              
              console.log(`Number of relevant quotes found: ${messageData.relevantQuoteIds.length}`);
            } catch (quoteError) {
              console.error("Error identifying quotes:", quoteError);
              // If there's an error, just set to empty array
              messageData.relevantQuoteIds = [];
            }
          }
          */
        } catch (analysisError) {
          console.error("Error in message analysis:", analysisError);
          // If analysis fails, continue without these additional properties
        }
      }
      
      // Save the message
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
      
      // If it's a user message, generate an AI response
      if (messageData.isUserMessage) {
        // Start the AI response generation process asynchronously
        generateAIResponse(id, messageData).catch(error => {
          console.error("Error in AI response generation:", error);
        });
      }
    } catch (err) {
      console.error("Error creating message:", err);
      res.status(500).json({ message: "Failed to create message" });
    }
  });
  
  // Helper function to generate AI responses asynchronously
  async function generateAIResponse(conversationId: number, messageData: InsertMessage): Promise<void> {
    try {
      // Get the conversation to determine the mode and characters
      const conversation = await storage.getConversationById(conversationId);
      if (!conversation) {
        console.log("No conversation found for ID:", conversationId);
        return;
      }
      
      const conversationMessages = await storage.getMessagesByConversationId(conversationId);
      
      // Convert messages to conversation history format
      const currentMessageContent = messageData.content;
      const conversationHistory = conversationMessages
        .filter(msg => !(msg.isUserMessage && msg.content === currentMessageContent))
        .map(msg => ({
          role: msg.isUserMessage ? 'user' : 'assistant',
          content: msg.content
        }));
      
      let responseContent = "";
      
      if (conversation.conversationMode === ChatModes.CHARACTER) {
        // Character chat mode logic
        const characterIds = Array.isArray(conversation.characterIds) 
          ? conversation.characterIds 
          : [conversation.characterIds];
        
        if (characterIds.length > 0) {
          const character = await storage.getCharacterById(characterIds[0]);
          const characterPersona = await storage.getCharacterPersonaByCharacterId(characterIds[0]);
          
          if (character && characterPersona) {
            responseContent = await generateCharacterResponse(
              character,
              characterPersona,
              messageData.content,
              conversationHistory
            );
          }
        }
      } else if (conversation.conversationMode === ChatModes.ANALYSIS) {
        // Librarian mode
        console.log("Processing librarian response for conversation:", conversationId);
        const bookId = 1; // Default to 1984 for now
        const librarianPersona = await storage.getLibrarianPersonaByBookId(bookId);
        
        if (librarianPersona) {
          console.log("Found librarian persona:", librarianPersona.name);
          responseContent = await generateLibrarianResponse(
            librarianPersona,
            messageData.content,
            conversationHistory
          );
          console.log("Generated librarian response:", responseContent.substring(0, 100) + "...");
        }
      }
      
      if (!responseContent) {
        responseContent = "I apologize, but I'm unable to provide a response at this time.";
      }
      
      // Create the AI response message
      const responseMessage: InsertMessage = {
        conversationId: conversationId,
        content: responseContent,
        isUserMessage: false,
        senderId: conversation.conversationMode === ChatModes.CHARACTER && 
          Array.isArray(conversation.characterIds) && 
          conversation.characterIds.length > 0 
            ? conversation.characterIds[0] 
            : null
      };
      
      console.log("Creating AI response message:", {
        conversationId: conversationId,
        isUserMessage: false,
        contentLength: responseContent.length,
        senderId: responseMessage.senderId
      });
      
      const createdMessage = await storage.createMessage(responseMessage);
      console.log(`Created AI response with ID: ${createdMessage.id}`);
    } catch (error) {
      console.error("Error generating AI response:", error);
    }
  }

  // OpenAI configuration check
  app.get("/api/openai/status", async (req, res) => {
    const isConfigured = isOpenAIConfigured();
    res.json({ configured: isConfigured });
  });

  // Test OpenAI integration
  app.post("/api/openai/test", async (req, res) => {
    try {
      if (!isOpenAIConfigured()) {
        return res.status(500).json({ 
          success: false, 
          message: "OpenAI is not configured. Check your API key."
        });
      }

      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ 
          success: false, 
          message: "No prompt provided" 
        });
      }

      // Get a test character to use
      const character = await storage.getCharacterById(1); // Winston
      const characterPersona = await storage.getCharacterPersonaByCharacterId(1);
      
      if (!character || !characterPersona) {
        return res.status(404).json({ 
          success: false, 
          message: "Character or persona not found" 
        });
      }

      // Create a test message
      // Using InsertMessage instead of Message since we don't need all properties
      const testMessageInput: InsertMessage = {
        conversationId: 0,
        senderId: null,
        isUserMessage: true,
        content: prompt,
        sentimentScore: null,
        relevantThemeIds: null,
        relevantQuoteIds: null
      };

      // Generate a response
      const response = await generateCharacterResponse(
        character,
        characterPersona,
        prompt,
        [] // Empty conversation history for test
      );

      res.json({ 
        success: true, 
        character: character.name,
        response
      });
    } catch (error: any) {
      console.error("Error testing OpenAI:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate response", 
        error: error.message 
      });
    }
  });
  
  // Test full conversation flow (create + send message) in one endpoint
  app.post("/api/chat/test", async (req, res) => {
    try {
      const { message, characterId = 1, isLibrarian = false } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          message: "No message provided" 
        });
      }
      
      console.log(`Starting test chat with ${isLibrarian ? 'librarian' : `character ${characterId}`}: "${message}"`);
      
      // 1. Create a conversation
      const conversationData: InsertConversation = {
        userId: 1, // Default user
        bookId: 1, // 1984
        title: `Test conversation - ${new Date().toLocaleString()}`,
        characterIds: isLibrarian ? [] : [characterId],
        isLibrarianPresent: isLibrarian,
        conversationMode: isLibrarian ? ChatModes.ANALYSIS : ChatModes.CHARACTER
      };
      
      const conversation = await storage.createConversation(conversationData);
      console.log(`Created conversation with ID: ${conversation.id}`);
      
      // 2. Send the user message
      const messageData: InsertMessage = {
        conversationId: conversation.id,
        content: message,
        isUserMessage: true,
        senderId: null
      };
      
      // For user messages, analyze sentiment and identify relevant themes and quotes
      messageData.sentimentScore = await analyzeSentiment(messageData.content);
        
      // Get relevant themes if possible
      try {
        const allThemes = await storage.getThemesByBookId(1);
        // Convert themes to format expected by identifyRelevantThemes
        const themesForAnalysis = allThemes.map(theme => ({
          id: theme.id,
          name: theme.name,
          description: theme.description || ""
        }));
        const relevantThemeIds = await identifyRelevantThemes(messageData.content, themesForAnalysis);
        messageData.relevantThemeIds = relevantThemeIds;
      } catch (error) {
        console.error("Error identifying themes:", error);
        messageData.relevantThemeIds = [];
      }
      
      // Get relevant quotes
      try {
        // Skip the relevant quotes for now - we'll implement this properly later
        messageData.relevantQuoteIds = [];
        
        // This code had a type error:
        // const allQuotes = await Promise.all(
        //   relevantThemeIds.map(themeId => storage.getQuotesByThemeId(themeId))
        // );
        // const flattenedQuotes = allQuotes.flat();
        // const relevantQuoteIds = await identifyRelevantQuotes(messageData.content, flattenedQuotes);
        // messageData.relevantQuoteIds = relevantQuoteIds;
      } catch (error) {
        console.error("Error processing quotes:", error);
        messageData.relevantQuoteIds = [];
      }
      
      const userMessage = await storage.createMessage(messageData);
      console.log(`Created user message with ID: ${userMessage.id}`);
      
      // 3. Generate AI response
      // Get all messages for this conversation (should be just the one we created)
      const conversationMessages = await storage.getMessagesByConversationId(conversation.id);
      
      let responseContent = "I cannot respond at this moment.";
      
      if (!isLibrarian) {
        // Get character data
        const character = await storage.getCharacterById(characterId);
        const characterPersona = await storage.getCharacterPersonaByCharacterId(characterId);
        
        if (character && characterPersona) {
          // Get relevant themes and quotes for context
          const relevantThemes = messageData.relevantThemeIds && Array.isArray(messageData.relevantThemeIds)
            ? await Promise.all(
                messageData.relevantThemeIds.map(id => storage.getThemeById(id))
              ).then(themes => themes.filter(t => t !== undefined) as Theme[])
            : [];
          
          const relevantQuotes = messageData.relevantQuoteIds && Array.isArray(messageData.relevantQuoteIds)
            ? await Promise.all(
                messageData.relevantQuoteIds.map(async (id) => {
                  for (const themeId of relevantThemes.map(t => t.id)) {
                    const quotes = await storage.getQuotesByThemeId(themeId);
                    const quote = quotes.find(q => q.id === id);
                    if (quote) return quote;
                  }
                  return null;
                })
              ).then(quotes => quotes.filter(q => q !== null) as ThemeQuote[])
            : [];
          
          // Convert the message to the format expected by the OpenAI service
          // For first message, we should have an empty conversation history
          const conversationHistory = conversationMessages
            .filter(msg => msg.id !== userMessage.id) // Exclude the current message that's being responded to
            .map(msg => ({
              role: msg.isUserMessage ? 'user' : 'assistant',
              content: msg.content
            }));
          
          console.log(`Test chat - conversation history: ${JSON.stringify(conversationHistory)}`);
          
          responseContent = await generateCharacterResponse(
            character, 
            characterPersona, 
            userMessage.content,
            conversationHistory
          );
        }
      } else {
        // Librarian mode
        const librarianPersona = await storage.getLibrarianPersonaByBookId(1);
        
        if (librarianPersona) {
          // Get relevant themes and quotes
          const relevantThemes = messageData.relevantThemeIds && Array.isArray(messageData.relevantThemeIds)
            ? await Promise.all(
                messageData.relevantThemeIds.map(id => storage.getThemeById(id))
              ).then(themes => themes.filter(t => t !== undefined) as Theme[])
            : [];
          
          const relevantQuotes = messageData.relevantQuoteIds && Array.isArray(messageData.relevantQuoteIds)
            ? await Promise.all(
                messageData.relevantQuoteIds.map(async (id) => {
                  for (const themeId of relevantThemes.map(t => t.id)) {
                    const quotes = await storage.getQuotesByThemeId(themeId);
                    const quote = quotes.find(q => q.id === id);
                    if (quote) return quote;
                  }
                  return null;
                })
              ).then(quotes => quotes.filter(q => q !== null) as ThemeQuote[])
            : [];
          
          // Convert the message to the format expected by the OpenAI service
          // For first message, we should have an empty conversation history
          const conversationHistory = conversationMessages
            .filter(msg => msg.id !== userMessage.id) // Exclude the current message that's being responded to
            .map(msg => ({
              role: msg.isUserMessage ? 'user' : 'assistant',
              content: msg.content
            }));
          
          console.log(`Test chat - conversation history: ${JSON.stringify(conversationHistory)}`);
          
          responseContent = await generateLibrarianResponse(
            librarianPersona, 
            userMessage.content,
            conversationHistory
          );
        }
      }
      
      // Create the AI response message
      const responseMessage: InsertMessage = {
        conversationId: conversation.id,
        content: responseContent,
        isUserMessage: false,
        senderId: isLibrarian ? null : characterId
      };
      
      const aiMessage = await storage.createMessage(responseMessage);
      console.log(`Created AI response with ID: ${aiMessage.id}`);
      
      // 4. Return the complete conversation data
      const updatedMessages = await storage.getMessagesByConversationId(conversation.id);
      
      res.json({
        success: true,
        conversation,
        messages: updatedMessages,
        relevantThemes: messageData.relevantThemeIds,
        sentimentScore: messageData.sentimentScore
      });
    } catch (error: any) {
      console.error("Error in test chat:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process chat", 
        error: error.message 
      });
    }
  });

  // Add a debug endpoint to test librarian generation directly
  app.post("/api/debug/test-librarian", async (req, res) => {
    try {
      const { message = "What are the main themes in 1984?" } = req.body;
      
      console.log(`[debug] Testing librarian response for message: "${message}"`);
      
      // Get the librarian persona
      const librarianPersona = await storage.getLibrarianPersonaByBookId(1);
      
      if (!librarianPersona) {
        return res.status(404).json({ 
          success: false, 
          message: "Librarian persona not found" 
        });
      }
      
      // Generate the response directly
      console.log(`[debug] Found librarian persona: ${librarianPersona.name}`);
      console.log(`[debug] Calling generateLibrarianResponse directly`);
      
      const response = await generateLibrarianResponse(
        librarianPersona,
        message,
        [] // Empty conversation history for simplicity
      );
      
      console.log(`[debug] Response generated, length: ${response.length} chars`);
      console.log(`[debug] Response preview: ${response.substring(0, 100)}...`);
      
      res.json({
        success: true,
        message: message,
        response: response,
        responseLength: response.length
      });
    } catch (error) {
      console.error("Error in librarian test endpoint:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  });

  // Encyclopedia routes
  app.get('/api/encyclopedia/entries', async (req, res) => {
    try {
      // Use fs to read the file instead of require
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Use __dirname equivalent in ESM
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Use an absolute path to the entries.json file
      const filePath = path.join(__dirname, '../data/encyclopedia/entries.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const entries = JSON.parse(fileContent);
      
      res.json(entries);
    } catch (error) {
      console.error('Error fetching encyclopedia entries:', error);
      res.status(500).json({ error: 'Failed to fetch encyclopedia entries' });
    }
  });

  app.get('/api/encyclopedia/entries/:id', async (req, res) => {
    try {
      // Use fs to read the file instead of require
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Use __dirname equivalent in ESM
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Use an absolute path to the entries.json file
      const filePath = path.join(__dirname, '../data/encyclopedia/entries.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const entries = JSON.parse(fileContent);
      
      const entry = entries.find((entry: any) => entry.id === req.params.id);
      
      if (!entry) {
        return res.status(404).json({ error: 'Encyclopedia entry not found' });
      }
      
      res.json(entry);
    } catch (error) {
      console.error('Error fetching encyclopedia entry:', error);
      res.status(500).json({ error: 'Failed to fetch encyclopedia entry' });
    }
  });

  app.get('/api/encyclopedia/categories', async (req, res) => {
    try {
      // Use fs to read the file instead of require
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Use __dirname equivalent in ESM
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Use an absolute path to the entries.json file
      const filePath = path.join(__dirname, '../data/encyclopedia/entries.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const entries = JSON.parse(fileContent);
      
      const categoriesSet = new Set(entries.map((entry: any) => entry.category));
      const categories = Array.from(categoriesSet);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching encyclopedia categories:', error);
      res.status(500).json({ error: 'Failed to fetch encyclopedia categories' });
    }
  });

  // Update entry unlock status (POST to update a user's unlocked entries)
  app.post('/api/users/:userId/encyclopedia/unlock', async (req, res) => {
    try {
      const { entryId } = req.body;
      const userId = parseInt(req.params.userId);
      
      // In a real app, this would update a database record
      // For now, we'll just return success
      console.log(`Unlocking encyclopedia entry ${entryId} for user ${userId}`);
      
      res.json({ success: true, entryId, userId });
    } catch (error) {
      console.error('Error unlocking encyclopedia entry:', error);
      res.status(500).json({ error: 'Failed to unlock encyclopedia entry' });
    }
  });

  // Get a user's unlocked entries
  app.get('/api/users/:userId/encyclopedia/unlocked', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // In a real app, this would query a database
      // For demo purposes, we'll return ALL entries as unlocked
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Use __dirname equivalent in ESM
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Use an absolute path to the entries.json file
      const filePath = path.join(__dirname, '../data/encyclopedia/entries.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const entries = JSON.parse(fileContent);
      
      // Return ALL entry IDs instead of just initially unlocked ones
      const allEntryIds = entries.map((entry: any) => entry.id);
      
      res.json(allEntryIds);
    } catch (error) {
      console.error('Error fetching unlocked encyclopedia entries:', error);
      res.status(500).json({ error: 'Failed to fetch unlocked encyclopedia entries' });
    }
  });

  // Add a debug endpoint to check API status
  app.get("/api/debug/openai-status", async (req, res) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      const apiKeyStatus = apiKey ? 
        (apiKey.startsWith("sk-") ? "Valid format" : "Invalid format") : 
        "Not configured";
      
      // Try a simple API call if API key exists
      let apiCallStatus = "Not tested";
      if (apiKey) {
        try {
          // Simple completion to test the API
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }] as any,
            max_tokens: 5
          });
          
          apiCallStatus = response?.choices?.[0]?.message?.content ? 
            "Success" : "Failed - Empty Response";
        } catch (error) {
          apiCallStatus = `Failed - ${error instanceof Error ? error.message : "Unknown error"}`;
        }
      }
      
      res.json({
        apiKeyConfigured: !!apiKey,
        apiKeyFormat: apiKeyStatus,
        apiCallStatus,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error in OpenAI debug endpoint:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString() 
      });
    }
  });

  // Add the suggestionTracker object to store usage data
  const suggestionTracker: Record<string, Record<SuggestionCategory, number>> = {};

  // Add endpoint to track suggestion usage
  app.post('/api/suggestions/track', async (req, res) => {
    const { characterId, category, suggestionId } = req.body;
    
    if (!category) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Use 'librarian' as the key for librarian suggestions, otherwise use the character ID
    const charKey = characterId === null ? 'librarian' : characterId.toString();
    
    // Initialize tracking data if not exists
    if (!suggestionTracker[charKey]) {
      suggestionTracker[charKey] = {
        experience: 0,
        relationship: 0,
        worldview: 0,
        theme: 0,
        emotional: 0,
        analytical: 0
      };
    }
    
    // Increment the count for this category
    suggestionTracker[charKey][category as SuggestionCategory]++;
    
    console.log(`Suggestion used - Character: ${charKey}, Category: ${category}, ID: ${suggestionId}`);
    console.log(`Updated tracker:`, suggestionTracker[charKey]);
    
    return res.status(200).json({ 
      success: true,
      stats: suggestionTracker[charKey]
    });
  });

  // Add endpoint to get suggestion usage stats
  app.get('/api/suggestions/stats/:characterId', (req, res) => {
    const { characterId } = req.params;
    const charKey = characterId === 'librarian' ? 'librarian' : characterId;
    
    if (!suggestionTracker[charKey]) {
      return res.status(200).json({
        experience: 0,
        relationship: 0,
        worldview: 0,
        theme: 0,
        emotional: 0,
        analytical: 0
      });
    }
    
    return res.status(200).json(suggestionTracker[charKey]);
  });

  // Create storage for book suggestions
  const bookSuggestions: Array<{
    title: string;
    submittedAt: string;
    votes: number;
  }> = [];

  // Endpoint to submit a book suggestion
  app.post('/api/book-suggestions', (req, res) => {
    const { title } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Valid book title is required' });
    }
    
    // Check if this suggestion already exists
    const existingSuggestion = bookSuggestions.find(
      suggestion => suggestion.title.toLowerCase() === title.toLowerCase()
    );
    
    if (existingSuggestion) {
      // Increment votes if it exists
      existingSuggestion.votes += 1;
      console.log(`Vote added for book suggestion: ${title}`);
      return res.status(200).json({ 
        success: true,
        suggestion: existingSuggestion
      });
    }
    
    // Add new suggestion
    const newSuggestion = {
      title: title.trim(),
      submittedAt: new Date().toISOString(),
      votes: 1
    };
    
    bookSuggestions.push(newSuggestion);
    console.log(`New book suggestion added: ${title}`);
    
    return res.status(201).json({ 
      success: true,
      suggestion: newSuggestion
    });
  });
  
  // Endpoint to get popular book suggestions
  app.get('/api/book-suggestions', (req, res) => {
    // Sort by votes (highest first)
    const sortedSuggestions = [...bookSuggestions].sort((a, b) => b.votes - a.votes);
    
    // Return top 10 or all if less than 10
    const topSuggestions = sortedSuggestions.slice(0, 10);
    
    return res.status(200).json(topSuggestions);
  });

  // Add character chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, characterId } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required field: message" 
        });
      }
      
      if (!characterId) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required field: characterId" 
        });
      }
      
      // Get character
      const character = await storage.getCharacterById(characterId);
      if (!character) {
        return res.status(404).json({ 
          success: false, 
          message: "Invalid character ID" 
        });
      }
      
      console.log(`[character-chat] Request for character ${character.name} with message: "${message.substring(0, 30)}..."`);
      
      // Get character persona if available
      const persona = await storage.getCharacterPersonaByCharacterId(characterId);
      
      // Generate character response
      let response;
      if (isOpenAIConfigured()) {
        // Create a default persona if none exists
        const defaultPersona = persona || {
          id: character.id,
          characterId: character.id,
          voiceDescription: `Speaks in a manner typical of a character from the book`,
          backgroundKnowledge: `Has knowledge of events and concepts from the book they appear in`,
          personalityTraits: character.psychologicalProfile || "No specific personality traits defined",
          biases: "No specific biases defined",
          promptInstructions: "Respond as this character would based on their profile",
          avatarUrl: null
        };
        
        response = await generateCharacterResponse(character, defaultPersona, message, []);
      } else {
        // Fallback response if OpenAI is not configured
        response = `[Character ${character.name}] I'm sorry, I cannot respond properly right now as the AI service is not available.`;
      }
      
      return res.json({
        success: true,
        character: {
          id: character.id,
          name: character.name
        },
        message: message,
        response: response
      });
    } catch (error) {
      console.error("[character-chat] API error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to generate character response", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Add librarian chat endpoint
  app.post("/api/librarian", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required field: message" 
        });
      }
      
      console.log(`[librarian] API request received for message: "${message.substring(0, 30)}..."`);
      
      // Get a generic librarian persona
      const librarianPersonas = await storage.getLibrarianPersonas();
      const persona = librarianPersonas.length > 0 ? librarianPersonas[0] : null;
      
      // Generate librarian response
      let response;
      if (isOpenAIConfigured() && persona) {
        response = await generateLibrarianResponse(persona, message, []);
      } else {
        // Fallback to simple librarian if OpenAI is not configured
        response = await getLibrarianResponse(message);
      }
      
      return res.json({
        success: true,
        message: message,
        response: response
      });
    } catch (error) {
      console.error("[librarian] API error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to generate librarian response", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
