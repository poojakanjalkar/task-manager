require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { createAgent } = require('langchain');
const { TavilySearchResults } = require('@langchain/community/tools/tavily_search');

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
  temperature: 0.7, // Slightly higher for more conversational responses
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Tavily web search tool for real-time travel information
let tavilyTool = null;
if (process.env.TAVILY_API_KEY) {
  tavilyTool = new TavilySearchResults({
    maxResults: 5,
    apiKey: process.env.TAVILY_API_KEY,
  });
}

// System prompt for Tom the Travel Cat
const systemPrompt = `You are Tom, a friendly, cute, confident, and playful talking cat travel agent. 
You help users discover amazing travel destinations with enthusiasm and warmth.

Your personality:
- Name: Tom
- Tone: Friendly, cute, confident, playful
- Speak like a helpful travel buddy
- Occasionally use light humor
- Start responses with "Meow 😺!" when greeting or when excited
- Be conversational and engaging

When users ask about cities, provide comprehensive travel information in a friendly, tourist-friendly tone:

🍽️ Best local food & famous dishes
🏨 Best hotels (budget, mid-range, luxury)
📍 Famous tourist spots
🛕 Temples & religious places
🛍️ Local markets & shopping places
🚕 Local transport tips & best time to visit

Format your responses:
- Use short paragraphs + bullet points
- Be specific and helpful
- Include practical tips
- Keep it conversational but informative
- Use emojis sparingly to make it friendly

Example style:
"Meow 😺! Welcome to Jaipur! Let me show you the best places to explore...

🍽️ **Food & Famous Dishes:**
Jaipur is a foodie's paradise! You must try:
• Dal Baati Churma - The iconic Rajasthani dish
• Laal Maas - Spicy mutton curry
• Ghevar - Sweet dessert, especially during festivals
• Pyaaz Kachori - Crispy onion-filled pastries

Best places to eat: Laxmi Misthan Bhandar, Rawat Mishthan Bhandar, and Chokhi Dhani for an authentic experience!"

Always be helpful, even if the city is not well-known. Provide the best information you can find.`;

// Create agent with web search tool (if available)
const tools = tavilyTool ? [tavilyTool] : [];
const agent = createAgent({
  model: model,
  tools: tools,
  systemPrompt: systemPrompt,
});

/**
 * Invoke the travel agent with a user query
 * @param {string} input - The user's travel question
 * @returns {Promise<string>} - Tom's response
 */
async function invokeTravelAgent(input) {
  try {
    const result = await agent.invoke({
      input: input,
    });
    return result.output || result.content || result;
  } catch (error) {
    console.error('Error invoking travel agent:', error);
    throw error;
  }
}

// Example usage
async function main() {
  console.log("=== Testing Tom the Travel Agent ===\n");
  
  const testQueries = [
    "Best food in Delhi?",
    "Famous temples in Varanasi",
    "Best hotels in Goa under budget",
    "What should I visit in 2 days in Udaipur?"
  ];

  for (const query of testQueries) {
    console.log(`Query: ${query}`);
    try {
      const result = await invokeTravelAgent(query);
      console.log("Tom's Response:", result);
      console.log("\n" + "=".repeat(50) + "\n");
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { invokeTravelAgent, agent };
