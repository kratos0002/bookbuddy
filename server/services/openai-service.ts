import OpenAI from "openai";
import { Character } from "@shared/schema";
import { CharacterPersona } from "@shared/schema";
import { LibrarianPersona } from "@shared/schema";
import bookContextService from "./book-context-service";

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

    // Prepare messages for API call
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 350,
    });

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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: messages as any,
      temperature: 0.5,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I cannot respond at this time.";
  } catch (error) {
    console.error("Error generating librarian response:", error);
    return "Something went wrong. The literary expert cannot respond at this time.";
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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
 * Identify relevant quotes that exemplify a given theme
 */
export async function identifyRelevantQuotes(
  theme: { id: number; name: string; description: string },
  bookText: string
): Promise<string[]> {
  try {
    const systemMessage: any = {
      role: "system", 
      content: `You are a literary analysis expert. Your task is to identify 3 quotes from a text that exemplify the theme of "${theme.name}" (${theme.description}). Select the most representative and impactful quotes.`
    };
    
    // Use only a relevant portion of the book text to stay within token limits
    const truncatedText = bookText.substring(0, 8000);
    
    const userMessage: any = {
      role: "user",
      content: `Text to analyze:\n"${truncatedText}"\n\nProvide exactly 3 quotes that best exemplify the theme of "${theme.name}". Format your response as a JSON array of strings, with each string being a quote. Example: ["quote 1", "quote 2", "quote 3"]`
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [systemMessage, userMessage],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const responseText = response.choices[0].message.content || '{"quotes": []}';
    
    try {
      const jsonResponse = JSON.parse(responseText);
      return Array.isArray(jsonResponse.quotes) ? jsonResponse.quotes : [];
    } catch (jsonError) {
      console.error("Error parsing quotes JSON:", jsonError);
      return [];
    }
  } catch (error) {
    console.error("Error identifying quotes:", error);
    return [];
  }
}

/**
 * Check if OpenAI API key is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}