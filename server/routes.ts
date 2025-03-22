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
import { ChatModes, InsertConversation, InsertMessage, Message, Theme, ThemeQuote } from "@shared/schema";

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

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      console.log("Received message request");
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }
      
      const messageData = req.body as InsertMessage;
      messageData.conversationId = id;
      console.log("Processing message:", messageData);
      
      // For user messages, we want to analyze sentiment and identify relevant themes and quotes
      if (messageData.isUserMessage) {
        // Get sentiment score if possible
        messageData.sentimentScore = await analyzeSentiment(messageData.content);
        
        // Get relevant themes if possible
        const bookId = 1; // Default to 1984 for now
        const allThemes = await storage.getThemesByBookId(bookId);
        const relevantThemeIds = await identifyRelevantThemes(messageData.content, allThemes);
        messageData.relevantThemeIds = relevantThemeIds;
        
        // Get relevant quotes if possible
        const allQuotes = await Promise.all(
          relevantThemeIds.map(themeId => storage.getQuotesByThemeId(themeId))
        );
        const flattenedQuotes = allQuotes.flat();
        const relevantQuoteIds = await identifyRelevantQuotes(messageData.content, flattenedQuotes);
        messageData.relevantQuoteIds = relevantQuoteIds;
      }
      
      const newMessage = await storage.createMessage(messageData);
      res.status(201).json(newMessage);
      
      // If it's a user message, generate an AI response
      if (messageData.isUserMessage) {
        // Get the conversation to determine the mode and characters
        const conversation = await storage.getConversationById(id);
        if (!conversation) {
          return;
        }
        
        const messages = await storage.getMessagesByConversationId(id);
        
        let responseContent = "I cannot respond at the moment.";
        
        if (conversation.conversationMode === ChatModes.CHARACTER) {
          // Get relevant character data
          const characterIds = Array.isArray(conversation.characterIds) 
            ? conversation.characterIds 
            : [conversation.characterIds];
          
          if (characterIds.length > 0) {
            const character = await storage.getCharacterById(characterIds[0]);
            const characterPersona = await storage.getCharacterPersonaByCharacterId(characterIds[0]);
            
            if (character && characterPersona) {
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
              
              // Generate AI response from character
              responseContent = await generateCharacterResponse(
                character, 
                characterPersona, 
                messages, 
                relevantThemes,
                relevantQuotes
              );
            }
          }
        } else if (conversation.isLibrarianPresent) {
          // Librarian mode
          console.log("Processing librarian response for conversation:", id);
          const bookId = 1; // Default to 1984 for now
          const librarianPersona = await storage.getLibrarianPersonaByBookId(bookId);
          
          if (librarianPersona) {
            console.log("Found librarian persona:", librarianPersona.name);
            // Get relevant themes and quotes
            const relevantThemes = messageData.relevantThemeIds && Array.isArray(messageData.relevantThemeIds)
              ? await Promise.all(
                  messageData.relevantThemeIds.map(id => storage.getThemeById(id))
                ).then(themes => themes.filter(t => t !== undefined) as Theme[])
              : [];
            
            console.log("Found relevant themes:", relevantThemes.map(t => t.name));
            
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
            
            console.log("Found relevant quotes:", relevantQuotes.length);
            
            // Generate AI response from librarian
            console.log("Generating librarian response...");
            try {
              responseContent = await generateLibrarianResponse(
                librarianPersona, 
                messages, 
                relevantThemes,
                relevantQuotes
              );
              console.log("Librarian response generated successfully");
            } catch (error) {
              console.error("Error generating librarian response:", error);
              responseContent = "I apologize, but I'm having trouble formulating a response at the moment.";
            }
          }
        }
        
        // Create the AI response message
        const responseMessage: InsertMessage = {
          conversationId: id,
          content: responseContent,
          isUserMessage: false,
          // For character chat, set senderId to the character's ID
          senderId: conversation.conversationMode === ChatModes.CHARACTER && 
            Array.isArray(conversation.characterIds) && 
            conversation.characterIds.length > 0 
              ? conversation.characterIds[0] 
              : null
        };
        
        await storage.createMessage(responseMessage);
      }
    } catch (err) {
      console.error("Error processing message:", err);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

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
        [{
          ...testMessageInput,
          id: 0,
          sentAt: new Date()
        } as Message], // Cast to Message with required properties
        [],
        []
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
      const allThemes = await storage.getThemesByBookId(1);
      const relevantThemeIds = await identifyRelevantThemes(messageData.content, allThemes);
      messageData.relevantThemeIds = relevantThemeIds;
      
      // Get relevant quotes if possible
      const allQuotes = await Promise.all(
        relevantThemeIds.map(themeId => storage.getQuotesByThemeId(themeId))
      );
      const flattenedQuotes = allQuotes.flat();
      const relevantQuoteIds = await identifyRelevantQuotes(messageData.content, flattenedQuotes);
      messageData.relevantQuoteIds = relevantQuoteIds;
      
      const userMessage = await storage.createMessage(messageData);
      console.log(`Created user message with ID: ${userMessage.id}`);
      
      // 3. Generate and store AI response
      let responseContent = "I cannot respond at the moment.";
      
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
          
          // Generate response from character
          responseContent = await generateCharacterResponse(
            character, 
            characterPersona, 
            [userMessage], 
            relevantThemes,
            relevantQuotes
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
          
          // Generate response from librarian
          responseContent = await generateLibrarianResponse(
            librarianPersona, 
            [userMessage], 
            relevantThemes,
            relevantQuotes
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
      const messages = await storage.getMessagesByConversationId(conversation.id);
      
      res.json({
        success: true,
        conversation,
        messages,
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

  const httpServer = createServer(app);

  return httpServer;
}
