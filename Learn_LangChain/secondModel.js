require('dotenv').config();
const { tool, createAgent } = require("langchain");
const { ChatOpenAI } = require('@langchain/openai');
const z = require("zod");

const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

const getUserLocation = tool(
  (_, config) => {
    const { user_id } = config.context;
    return user_id === "1" ? "Florida" : "SF";
  },
  {
    name: "get_user_location",
    description: "Retrieve user information based on user ID",
  },
);

// Initialize the LLM model
const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0,
});

// Create agent with weather and location tools
const agent = createAgent({
  model: model,
  tools: [getWeather, getUserLocation],
  systemPrompt: 'You are a helpful assistant that can get weather information for cities and retrieve user locations based on user ID.',
});

/**
 * Simple function to invoke the agent with a user query
 * @param {string} input - The user's question or input
 * @param {object} context - Optional context (e.g., { user_id: "1" })
 * @returns {Promise<string>} - The agent's response
 */
async function invokeAgent(input, context = {}) {
  try {
    const result = await agent.invoke({
      input: input,
      ...(context.user_id && { context: { user_id: context.user_id } }),
    });
    return result.output || result.content || result;
  } catch (error) {
    console.error('Error invoking agent:', error);
    throw error;
  }
}

// Example usage
async function main() {
  console.log("=== Testing Agent ===\n");
  
  // Test 1: Weather query
  console.log("Query: What's the weather in Paris?");
  const result1 = await invokeAgent("What's the weather in Paris?");
  console.log("Agent Response:", result1);
  console.log();

  // Test 2: User location query with context
  console.log("Query: Where am I located? (user_id: 1)");
  const result2 = await invokeAgent("Where am I located?", { user_id: "1" });
  console.log("Agent Response:", result2);
  console.log();

  // Test 3: Combined query
  console.log("Query: What's the weather in my location? (user_id: 2)");
  const result3 = await invokeAgent("What's the weather in my location?", { user_id: "2" });
  console.log("Agent Response:", result3);
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { getWeather, getUserLocation, agent, invokeAgent };