import OpenAI from "openai";

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  console.error("==============================================");
  console.error("[simple-librarian] ERROR: OpenAI API key is not configured!");
  console.error("[simple-librarian] Please set the OPENAI_API_KEY environment variable.");
  console.error("==============================================");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Simple librarian service that generates literary analysis responses about 1984
 */
export async function getLibrarianResponse(message: string): Promise<string> {
  try {
    console.log(`[simple-librarian] Generating response for: "${message.substring(0, 30)}..."`);
    
    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error("[simple-librarian] No OpenAI API key found in environment");
      return "I apologize, but the AI Librarian service is not properly configured. Please check the OPENAI_API_KEY.";
    }
    
    // Build a simple system prompt for the librarian
    const systemPrompt = `You are Alexandria, a knowledgeable AI librarian specializing in literature, particularly George Orwell's "1984".

As a literary expert, you can provide analysis on themes, characters, plot points, and historical context of "1984". Be helpful, educational, and thoughtful in your responses.

Your responses should:
- Provide expert literary analysis of "1984"
- Connect themes and elements to the broader context of dystopian literature
- Offer thoughtful interpretations backed by evidence from the text
- Maintain a helpful, educational tone
- Encourage deeper exploration of the book's themes and ideas

Keep responses concise (150-200 words) but intellectually stimulating.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Validate response
    if (!response || !response.choices || response.choices.length === 0) {
      console.error("[simple-librarian] Empty or invalid response from OpenAI API");
      return "I apologize, but I'm experiencing technical difficulties at the moment. Please try again later.";
    }

    const content = response.choices[0].message.content;
    console.log(`[simple-librarian] Response generated, length: ${content?.length || 0}`);
    
    return content || "I apologize, but I couldn't formulate a proper response at this time.";
  } catch (error) {
    console.error("[simple-librarian] Error generating response:", error);
    
    // Provide a simple error message
    if (error instanceof Error) {
      console.error(`[simple-librarian] Error details: ${error.message}`);
      
      if (error.message.includes("API key")) {
        return "The AI Librarian is currently unavailable due to API authentication issues.";
      } else if (error.message.includes("rate limit")) {
        return "The AI Librarian is currently busy with too many requests. Please try again later.";
      }
    }
    
    return "I apologize, but I'm having trouble formulating a response at the moment. Please try again.";
  }
} 