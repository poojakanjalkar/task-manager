import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';
// Note: Install dependencies with --legacy-peer-deps to resolve peer dependency conflicts
// See INSTALLATION_FIX.md for details
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// Load environment variables
dotenv.config();

/**
 * MakeMyTrip Travel Agent - Tom (The Talking Cat)
 * 
 * This agent provides city-based travel information including:
 * - Best local food & famous dishes
 * - Best hotels (budget, mid-range, luxury)
 * - Famous tourist spots
 * - Temples & religious places
 * - Local markets & shopping places
 * - Local transport tips & best time to visit
 */

// Initialize the LLM model
const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  temperature: 0.3, // Lower temperature for more focused, accurate responses
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Tavily web search tool for real-time travel information
// Note: Tavily is optional - the agent works without it
let tavilyTool = null;
if (process.env.TAVILY_API_KEY && TavilySearchResults) {
  try {
    tavilyTool = new TavilySearchResults({
      maxResults: 5,
      apiKey: process.env.TAVILY_API_KEY,
    });
  } catch (error) {
    console.warn('Tavily search tool initialization failed:', error.message);
  }
}

// System prompt for Tom the Travel Cat
const systemPrompt = `You are Tom, a friendly, cute, confident, and playful talking cat travel agent. 
You help users discover amazing travel destinations with enthusiasm and warmth.

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. When you see "CITY NAME: [NAME]" repeated multiple times in the query, that is the EXACT city you must provide information about.
2. The city name will be mentioned MANY times in the query - use THAT EXACT city name, not any other city.
3. If the query says "CITY NAME: Pune" or mentions "Pune" multiple times, provide information about PUNE only. Do NOT provide information about Delhi, Mumbai, Bangalore, or any other city.
4. If the query says "CITY NAME: Delhi" or mentions "Delhi" multiple times, provide information about DELHI only. Do NOT provide information about Pune, Mumbai, or any other city.
5. Before writing your response, identify the city name that appears after "CITY NAME:" in the query - that is the ONLY city to discuss.
6. Do NOT confuse cities - Pune and Delhi are different cities. Mumbai and Bangalore are different cities. Always use the exact city from the query.
7. Your response MUST start with "Meow 😺! Welcome to [CITY NAME FROM QUERY]!" using the exact city name that appears in the query.
8. Do NOT ask the user to provide a template, format, or header - you should directly provide the information about the city mentioned in the query.
9. Do NOT echo back instructions or ask the user to paste anything - just provide the travel information directly.
10. When you see a city name repeated multiple times in the query, immediately provide comprehensive travel information about that exact city without asking for clarification.
11. If you are unsure about a city, say so, but do NOT substitute with a different city - use the exact city name from the query.

Your personality:
- Name: Tom
- Tone: Friendly, cute, confident, playful
- Speak like a helpful travel buddy
- Occasionally use light humor
- Start responses with "Meow 😺! Welcome to [EXACT CITY NAME]!" - use the EXACT city name from the query
- Be conversational and engaging

When users ask about cities, you MUST provide comprehensive travel information about THE EXACT CITY MENTIONED in the query. Include ALL of the following sections:

🍽️ Best local food & famous dishes (specific to that exact city)
🏨 Best hotels (budget, mid-range, luxury) in that exact city
📍 Famous tourist spots in that exact city
🛕 Temples & religious places in that exact city
🛍️ Local markets & shopping places in that exact city
🚕 Local transport tips & best time to visit that exact city

Format your responses:
- ALWAYS start with "Meow 😺! Welcome to [EXACT CITY NAME FROM QUERY]!" - use the exact city name provided
- Use short paragraphs + bullet points
- Be specific with actual place names, dish names, and locations from that city
- Include practical tips specific to that exact city
- Keep it conversational but informative
- Use emojis sparingly to make it friendly
- ALWAYS mention the exact city name multiple times in your response
- Verify you are providing information about the correct city before responding

Example style for Jaipur (when user asks about Jaipur):
"Meow 😺! Welcome to Jaipur! Let me show you the best places to explore in this Pink City...

🍽️ **Food & Famous Dishes:**
Jaipur is a foodie's paradise! You must try:
• Dal Baati Churma - The iconic Rajasthani dish
• Laal Maas - Spicy mutton curry
• Ghevar - Sweet dessert, especially during festivals
• Pyaaz Kachori - Crispy onion-filled pastries

Best places to eat in Jaipur: Laxmi Misthan Bhandar, Rawat Mishthan Bhandar, and Chokhi Dhani for an authentic experience!"

CRITICAL REMINDERS: 
- Read the city name in the query VERY carefully - it will be mentioned multiple times
- Use the EXACT city name provided in the query, not a similar one or a different city
- If the query says "Pune", talk about PUNE. If it says "Delhi", talk about DELHI. Do NOT mix them up.
- The query will explicitly state "The city is [NAME]" - use that exact name
- Double-check that your response mentions the correct city name multiple times
- Do NOT assume or guess - use the exact city name from the query
- Before sending your response, verify you mentioned the correct city name at least 3-4 times`;

// Create agent with web search tool (if available)
const tools = tavilyTool ? [tavilyTool] : [];
const agent = createAgent({
  model: model,
  tools: tools,
  systemPrompt: systemPrompt,
});

/**
 * Extract text content from LangChain response
 * Handles various response formats from LangChain agents
 */
function extractTextFromResponse(result) {
  // If it's already a string, return it
  if (typeof result === 'string') {
    return result;
  }

  // Try common response properties
  if (result?.output) {
    return extractTextFromResponse(result.output);
  }
  
  if (result?.content) {
    return extractTextFromResponse(result.content);
  }

  // Handle LangChain message structure
  if (result?.messages && Array.isArray(result.messages) && result.messages.length > 0) {
    const message = result.messages[0];
    
    // Check for kwargs.content (AIMessage structure)
    if (message?.kwargs?.content) {
      return message.kwargs.content;
    }
    
    // Check for content property directly
    if (message?.content) {
      return message.content;
    }
  }

  // If it's an object, try to stringify (fallback)
  if (typeof result === 'object') {
    console.warn('Unexpected response format, attempting to extract text:', JSON.stringify(result).substring(0, 200));
    // Try to find any string content in the object
    const stringified = JSON.stringify(result);
    // This is a fallback - should not normally reach here
    return 'Sorry, I received an unexpected response format. Please try again.';
  }

  return String(result);
}

/**
 * Invoke the travel agent with a user query
 * @param {string} input - The user's travel question
 * @returns {Promise<string>} - Tom's response
 */
export async function invokeTravelAgent(input) {
  try {
    const result = await agent.invoke({
      input: input,
    });
    
    // Extract text content from the response
    const textResponse = extractTextFromResponse(result);
    
    // Log for debugging (first 100 chars only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Agent response extracted:', textResponse.substring(0, 100) + '...');
    }
    
    return textResponse;
  } catch (error) {
    console.error('Error invoking travel agent:', error);
    throw error;
  }
}

export { agent };
