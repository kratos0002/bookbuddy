import OpenAI from "openai";
import { 
  CharacterPersona, 
  LibrarianPersona, 
  Message, 
  Theme, 
  ThemeQuote,
  Character
} from "@shared/schema";
import { ChatCompletionMessageParam } from "openai/resources";

// Check if we have an OpenAI API key in the environment
const apiKey = process.env.OPENAI_API_KEY;

// Create OpenAI client if API key is available
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Character response generation
export async function generateCharacterResponse(
  character: Character,
  characterPersona: CharacterPersona,
  messages: Message[],
  relevantThemes: Theme[] = [],
  relevantQuotes: ThemeQuote[] = []
): Promise<string> {
  if (!openai) {
    return "I cannot respond at the moment. Please check the OpenAI API key configuration.";
  }

  // Format previous messages for context
  const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
    role: msg.isUserMessage ? "user" as const : "assistant" as const,
    content: msg.content
  }));

  // Build system prompt from character persona
  const systemPrompt = `
You are ${character.name} from George Orwell's "1984". 

Voice: ${characterPersona.voiceDescription}

Background Knowledge: ${characterPersona.backgroundKnowledge}

Personality Traits: ${characterPersona.personalityTraits}

Biases: ${characterPersona.biases}

Instructions: ${characterPersona.promptInstructions}

${relevantThemes.length > 0 ? 
  `Relevant Themes in this Conversation: 
  ${relevantThemes.map(theme => `- ${theme.name}: ${theme.description}`).join('\n  ')}` 
  : ''}

${relevantQuotes.length > 0 ? 
  `Relevant Quotes to Reference:
  ${relevantQuotes.map(quote => `- "${quote.quote}" (${quote.chapter})`).join('\n  ')}` 
  : ''}

Respond in character to the user's messages, maintaining your character's perspective, personality, and worldview at all times.
`;

  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system" as const, content: systemPrompt },
        ...formattedMessages
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.5,
    });

    return response.choices[0].message.content || "I cannot respond at the moment.";
  } catch (error) {
    console.error("Error generating character response:", error);
    return "I cannot respond at the moment due to a technical issue.";
  }
}

// Librarian response generation
export async function generateLibrarianResponse(
  librarianPersona: LibrarianPersona,
  messages: Message[],
  relevantThemes: Theme[] = [],
  relevantQuotes: ThemeQuote[] = []
): Promise<string> {
  if (!openai) {
    return "I cannot respond at the moment. Please check the OpenAI API key configuration.";
  }

  // Format previous messages for context
  const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
    role: msg.isUserMessage ? "user" as const : "assistant" as const,
    content: msg.content
  }));

  // Build system prompt from librarian persona
  const systemPrompt = `
You are ${librarianPersona.name}, a librarian and literary guide specialized in George Orwell's "1984".

Personality: ${librarianPersona.personalityDescription}

Knowledge Base: ${librarianPersona.knowledgeBase}

Instructions: ${librarianPersona.promptInstructions}

${relevantThemes.length > 0 ? 
  `Relevant Themes in this Conversation: 
  ${relevantThemes.map(theme => `- ${theme.name}: ${theme.description}`).join('\n  ')}` 
  : ''}

${relevantQuotes.length > 0 ? 
  `Relevant Quotes to Reference:
  ${relevantQuotes.map(quote => `- "${quote.quote}" (${quote.chapter})`).join('\n  ')}` 
  : ''}

Respond to the user's literary questions or discussions about "1984", providing insight, analysis, and guidance.
`;

  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system" as const, content: systemPrompt },
        ...formattedMessages
      ],
      temperature: 0.7,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0.1,
      presence_penalty: 0.2,
    });

    return response.choices[0].message.content || "I cannot respond at the moment.";
  } catch (error) {
    console.error("Error generating librarian response:", error);
    return "I cannot respond at the moment due to a technical issue.";
  }
}

// Sentiment analysis for user messages
export async function analyzeSentiment(text: string): Promise<number> {
  if (!openai) {
    return 0; // Neutral sentiment as fallback
  }

  try {
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: "You are a sentiment analysis expert. Analyze the sentiment of the text in the context of George Orwell's 1984 and provide a single sentiment score value between -1 (extremely negative/oppressive) and 1 (extremely positive/hopeful). Respond only with the numerical score."
    };
    
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: text
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, userMessage],
      temperature: 0.3,
      max_tokens: 10,
    });

    const sentimentText = response.choices[0].message.content?.trim();
    const sentimentScore = parseFloat(sentimentText || "0");
    return isNaN(sentimentScore) ? 0 : Math.max(-1, Math.min(1, sentimentScore));
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0; // Neutral sentiment as fallback
  }
}

// Identify relevant themes for a message
export async function identifyRelevantThemes(
  text: string, 
  allThemes: Theme[]
): Promise<number[]> {
  if (!openai || allThemes.length === 0) {
    return [];
  }

  const themeDescriptions = allThemes.map(theme => 
    `${theme.id}: ${theme.name} - ${theme.description}`
  ).join('\n');

  try {
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are a literary analysis expert specialized in George Orwell's 1984. 
          Given a message, identify which themes from the novel are most relevant to it.
          Respond with only the IDs of the relevant themes, comma-separated (e.g., "1,3,4").
          If no themes are relevant, respond with an empty string.
          
          Available themes:
          ${themeDescriptions}`
    };
    
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: text
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, userMessage],
      temperature: 0.3,
      max_tokens: 20,
    });

    const themeIdsText = response.choices[0].message.content?.trim() || "";
    const themeIds = themeIdsText
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && allThemes.some(theme => theme.id === id));
    
    return themeIds;
  } catch (error) {
    console.error("Error identifying relevant themes:", error);
    return [];
  }
}

// Identify relevant quotes for a message
export async function identifyRelevantQuotes(
  text: string, 
  allQuotes: ThemeQuote[]
): Promise<number[]> {
  if (!openai || allQuotes.length === 0) {
    return [];
  }

  const quoteDescriptions = allQuotes.map(quote => 
    `${quote.id}: "${quote.quote}" (${quote.chapter})`
  ).join('\n');

  try {
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are a literary analysis expert specialized in George Orwell's 1984. 
          Given a message, identify which quotes from the novel are most relevant to it.
          Respond with only the IDs of the relevant quotes, comma-separated (e.g., "1,3,4").
          If no quotes are relevant, respond with an empty string.
          Limit your selection to at most 3 quotes.
          
          Available quotes:
          ${quoteDescriptions}`
    };
    
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: text
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, userMessage],
      temperature: 0.3,
      max_tokens: 20,
    });

    const quoteIdsText = response.choices[0].message.content?.trim() || "";
    const quoteIds = quoteIdsText
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && allQuotes.some(quote => quote.id === id));
    
    return quoteIds;
  } catch (error) {
    console.error("Error identifying relevant quotes:", error);
    return [];
  }
}

// Check if the OpenAI API key is configured
export function isOpenAIConfigured(): boolean {
  return !!openai;
}