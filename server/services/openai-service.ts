import OpenAI from "openai";
import { Character } from "@shared/schema";
import { CharacterPersona } from "@shared/schema";
import { LibrarianPersona } from "@shared/schema";
import bookContextService from "./book-context-service";

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  console.error("==============================================");
  console.error("[openai-service] ERROR: OpenAI API key is not configured!");
  console.error("[openai-service] Please set the OPENAI_API_KEY environment variable.");
  console.error("[openai-service] Librarian and character responses will not work properly.");
  console.error("==============================================");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Check if BookNLP context service is initialized
console.log(`[openai-service] BookNLP context service initialized successfully`);

/**
 * Generate a response as if from a character in the book
 */
export async function generateCharacterResponse(
  character: Character,
  characterPersona: CharacterPersona,
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    console.log(`[openai-service] Generating character response for ${character.name}`);
    console.log(`[openai-service] Conversation history received: ${conversationHistory.length} messages`);
    if (conversationHistory.length > 0) {
      console.log(`[openai-service] First message role: ${conversationHistory[0].role}`);
      console.log(`[openai-service] Last message role: ${conversationHistory[conversationHistory.length-1].role}`);
    }
    
    // Analyze the user message for literary context
    const literaryContext = bookContextService.analyzeMessage(message);
    
    // Build a system prompt that establishes the character's personality and voice
    let systemPrompt = `You are ${character.name} from George Orwell's "1984". 
Respond to the user as this character would, staying true to their personality, beliefs, and manner of speaking.

${characterPersona.personalityTraits}
${characterPersona.backgroundKnowledge}
${characterPersona.promptInstructions}

Your responses should reflect:
- The world of 1984 as you know it
- Your specific beliefs and attitudes
- Your relationship with other characters
- The level of fear and paranoia appropriate for your character
- The style of speech typical for your character
- Your current emotional state and reactions to the conversation so far

Important: Each response should be unique and contextual. Never repeat the same response. Consider the full conversation history when responding.

Keep responses concise (100-150 words) and authentic to your character.`;

    // Enrich the system prompt with BookNLP-extracted character data
    systemPrompt = bookContextService.enrichCharacterPrompt(character.id, systemPrompt);
    
    // Add context about mentioned characters or themes if relevant
    if (literaryContext.mentionedCharacters.length > 0 || literaryContext.mentionedThemes.length > 0) {
      systemPrompt += "\n\nIn this message, the user mentions:";
      
      if (literaryContext.mentionedCharacters.length > 0) {
        systemPrompt += "\nCharacters: " + literaryContext.mentionedCharacters.map(c => c.name).join(", ");
      }
      
      if (literaryContext.mentionedThemes.length > 0) {
        systemPrompt += "\nThemes: " + literaryContext.mentionedThemes.map(t => t.name).join(", ");
      }
      
      systemPrompt += "\nAddress these elements from your character's perspective.";
    }

    // Add conversation history context
    if (conversationHistory.length > 0) {
      systemPrompt += "\n\nConsider the conversation history when responding. Your responses should evolve naturally based on the discussion.";
    }

    // Prepare messages for API call
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API with increased temperature for more variety
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.9,
      max_tokens: 350,
      presence_penalty: 0.6,  // Penalize repetition of similar content
      frequency_penalty: 0.7, // Penalize repetition of similar words/phrases
    });

    console.log(`[openai-service] Response generated for ${character.name}, length: ${response.choices[0].message.content?.length || 0} chars`);
    
    return response.choices[0].message.content || "I cannot respond at this time.";
  } catch (error) {
    console.error("Error generating character response:", error);
    return "Something went wrong. The character cannot respond at this time.";
  }
}

/**
 * Generate a response as if from a librarian persona
 */
export async function generateLibrarianResponse(
  librarianPersona: LibrarianPersona,
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    // Add detailed logging
    console.log(`[openai-service] Starting librarian response generation for message: "${message.substring(0, 30)}..."`);
    console.log(`[openai-service] Conversation history: ${conversationHistory.length} messages`);
    
    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error("[openai-service] No OpenAI API key found in environment");
      return "I apologize, but the librarian service is not properly configured. Please contact support.";
    }
    
    // Analyze the user message for literary context
    const literaryContext = bookContextService.analyzeMessage(message);
    
    // Build a system prompt that establishes the librarian's personality and expertise
    let systemPrompt = `You are ${librarianPersona.name}, a literary expert and librarian specializing in dystopian fiction and George Orwell's "1984".

${librarianPersona.personalityDescription}
${librarianPersona.knowledgeBase}
${librarianPersona.promptInstructions}

Your responses should:
- Provide expert literary analysis of "1984"
- Connect themes and elements to the broader context of dystopian literature
- Offer thoughtful interpretations backed by evidence from the text
- Maintain a helpful, educational tone
- Encourage deeper exploration of the book's themes and ideas

Keep responses concise (150-200 words) but intellectually stimulating.`;

    // Enrich the system prompt with BookNLP-extracted thematic data
    systemPrompt = bookContextService.enrichLibrarianPrompt(systemPrompt);
    
    // Add context about mentioned characters or themes if relevant
    if (literaryContext.mentionedCharacters.length > 0 || literaryContext.mentionedThemes.length > 0) {
      systemPrompt += "\n\nIn this message, the user mentions:";
      
      if (literaryContext.mentionedCharacters.length > 0) {
        systemPrompt += "\nCharacters: " + literaryContext.mentionedCharacters.map(c => c.name).join(", ");
        
        // Add brief character details
        literaryContext.mentionedCharacters.forEach(char => {
          const profile = bookContextService.getCharacterProfileById(char.id);
          if (profile) {
            systemPrompt += `\n- ${profile.name}: ${profile.role}, ${profile.description.substring(0, 100)}...`;
          }
        });
      }
      
      if (literaryContext.mentionedThemes.length > 0) {
        systemPrompt += "\nThemes: " + literaryContext.mentionedThemes.map(t => t.name).join(", ");
      }
      
      systemPrompt += "\nFocus your analysis on these elements in your response.";
    }

    // Prepare messages for API call
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 500,
    });

    // Add response validation
    if (!response || !response.choices || response.choices.length === 0) {
      console.error("[openai-service] Empty or invalid response from OpenAI API");
      return "I apologize, but I'm experiencing technical difficulties at the moment. Please try again later.";
    }

    const content = response.choices[0].message.content;
    console.log(`[openai-service] Received OpenAI response of length ${content?.length || 0}`);
    console.log(`[openai-service] Response preview: ${content?.substring(0, 50)}...`);
    
    return content || "I apologize, but I couldn't formulate a proper response at this time.";
  } catch (error) {
    console.error("[openai-service] Error generating librarian response:", error);
    
    // Provide more detailed error message based on the error type
    if (error instanceof Error) {
      console.error(`[openai-service] Error details - name: ${error.name}, message: ${error.message}`);
      
      if (error.message.includes("API key")) {
        return "The librarian is currently unavailable due to API authentication issues.";
      } else if (error.message.includes("rate limit")) {
        return "The librarian is currently busy with too many requests. Please try again later.";
      } else if (error.message.includes("timeout")) {
        return "The librarian couldn't respond in time. Please try a simpler question.";
      }
    }
    
    return "I apologize, but I'm having trouble formulating a response at the moment. Please try again with a different question.";
  }
}

/**
 * Analyze the sentiment of a text passage
 * Returns a score from -1 (negative) to 1 (positive)
 */
export async function analyzeSentiment(text: string): Promise<number> {
  try {
    const systemMessage: any = {
      role: "system", 
      content: "You are a sentiment analysis expert. Analyze the sentiment of the provided text and return a single number between -1 (extremely negative) and 1 (extremely positive). Be precise in your assessment."
    };
    
    const userMessage: any = {
      role: "user",
      content: `Analyze the sentiment of this text and respond with a single number between -1 and 1:\n\n${text}`
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, userMessage],
      temperature: 0.3,
      max_tokens: 10,
    });

    const sentimentText = response.choices[0].message.content || "0";
    const sentimentScore = parseFloat(sentimentText);
    
    // Ensure the score is within the expected range
    if (isNaN(sentimentScore)) {
      console.warn(`[openai-service] Invalid sentiment score: ${sentimentText}`);
      return 0;
    }
    
    // Clamp to range [-1, 1]
    return Math.max(-1, Math.min(1, sentimentScore));
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0; // Default neutral sentiment on error
  }
}

/**
 * Identify relevant themes in a given text
 * Returns a list of theme IDs that match the content
 */
export async function identifyRelevantThemes(
  text: string, 
  availableThemes: Array<{ id: number; name: string; description: string }>
): Promise<number[]> {
  try {
    const systemMessage: any = {
      role: "system", 
      content: "You are a literary analysis expert specializing in thematic analysis. Your task is to identify which themes from a provided list are present in a given text. Respond with the ID numbers of the themes that are relevant, separated by commas."
    };
    
    const themesDescription = availableThemes
      .map(theme => `${theme.id}: ${theme.name} - ${theme.description}`)
      .join('\n');
    
    const userMessage: any = {
      role: "user",
      content: `Text to analyze:\n"${text}"\n\nAvailable themes:\n${themesDescription}\n\nRespond with only the IDs of relevant themes, separated by commas (e.g., "1,3,5"). If no themes are relevant, respond with "none".`
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, userMessage],
      temperature: 0.3,
      max_tokens: 30,
    });

    const themeIdsText = response.choices[0].message.content || "none";
    
    if (themeIdsText.toLowerCase() === "none") {
      return [];
    }
    
    // Parse the comma-separated IDs
    const themeIds = themeIdsText
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && availableThemes.some(theme => theme.id === id));
    
    return themeIds;
  } catch (error) {
    console.error("Error identifying themes:", error);
    return [];
  }
}

/**
 * Identify relevant quotes that are related to user message
 */
export async function identifyRelevantQuotes(
  messageContent: string | any,
  quotes: Array<{ id: number; text: string; chapterNumber: number; }>
): Promise<number[]> {
  try {
    // Ensure messageContent is a string right at the beginning
    if (typeof messageContent !== 'string') {
      console.error("Error: messageContent is not a string:", typeof messageContent);
      return [];
    }
    
    // Guard clause for empty quotes
    if (!quotes || quotes.length === 0) {
      console.log("No quotes provided to identifyRelevantQuotes");
      return [];
    }
    
    // Validate quotes data structure
    if (!Array.isArray(quotes)) {
      console.error("Error: quotes is not an array:", typeof quotes);
      return [];
    }
    
    // Check if each quote has the expected structure
    const validQuotes = quotes.filter(q => 
      q && typeof q === 'object' && 
      'id' in q && typeof q.id === 'number' &&
      'text' in q && typeof q.text === 'string'
    );
    
    if (validQuotes.length === 0) {
      console.error("Error: No valid quotes found in the provided array");
      console.log("Sample of quotes received:", JSON.stringify(quotes.slice(0, 2)));
      return [];
    }
    
    // Log the input safely (messageContent is guaranteed to be a string at this point)
    console.log(`Finding relevant quotes for message: "${messageContent.substring(0, 50)}..." among ${validQuotes.length} quotes`);
    
    // Create a system message for the OpenAI API
    const systemMessage = {
      role: "system", 
      content: "You are a literary analysis expert. Identify quotes relevant to the given message."
    };
    
    // Format the quotes for the prompt
    const quotesText = validQuotes.map(q => `ID ${q.id}: "${q.text}"`).join('\n');
    
    // Create a user message with the input and formatted quotes
    const userMessage = {
      role: "user",
      content: `Message: "${messageContent}"\n\nQuotes:\n${quotesText}\n\nReturn only the IDs of relevant quotes as numbers separated by commas. If none are relevant, respond with "none".`
    };
    
    // Make the API call
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, userMessage] as any,
      temperature: 0.3,
      max_tokens: 50,
    });

    // Extract the content from the response
    const responseContent = response.choices[0].message.content || "none";
    console.log(`OpenAI response for quote identification: ${responseContent}`);
    
    // If no quotes are relevant, return an empty array
    if (responseContent.toLowerCase().includes("none")) {
      return [];
    }
    
    // Extract and validate the quote IDs
    const quoteIds = responseContent
      .split(',')
      .map(idStr => {
        // Extract just the numbers from the response
        const matches = idStr.trim().match(/\d+/);
        return matches ? parseInt(matches[0]) : NaN;
      })
      .filter(id => !isNaN(id) && validQuotes.some(q => q.id === id));
    
    console.log(`Identified ${quoteIds.length} relevant quotes: ${quoteIds.join(', ')}`);
    return quoteIds;
  } catch (error) {
    // Log the full error for debugging
    console.error("Error in identifyRelevantQuotes:", error);
    return [];
  }
}

/**
 * Check if OpenAI API key is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}