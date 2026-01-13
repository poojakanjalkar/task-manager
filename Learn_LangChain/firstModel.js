require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { createAgent } = require('langchain');
const { TavilySearchResults } = require('@langchain/community/tools/tavily_search');

// Initialize the LLM model
const model = new ChatOpenAI({
    modelName: 'gpt-5-nano',
    
});

// Initialize Tavily web search tool
const tavilyTool = new TavilySearchResults({
    maxResults: 5,
    apiKey: process.env.TAVILY_API_KEY,
});

// Create agent with web search tool
const agent = createAgent({
    model: model,
    tools: [tavilyTool],
    systemPrompt: 'You are a helpful assistant that can search the web for current information.',
});

/**
 * Simple function to invoke the agent with a user query
 * @param {string} input - The user's question or input
 * @returns {Promise<string>} - The agent's response
 */
async function invokeAgent(input) {
    try {
        const result = await agent.invoke({
            input: input,
        });
        return result.output || result.content || result;
    } catch (error) {
        console.error('Error invoking agent:', error);
        throw error;
    }
}

// Example usage
async function main() {
    const result = await invokeAgent('latest news on AI');
    console.log('Agent Response:', result);
}

// Run the example if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { invokeAgent, agent };