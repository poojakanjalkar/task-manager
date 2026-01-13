"""
City Explorer Chatbot
A helpful assistant for newcomers to explore food, places, traditions, and hospitals in a city.
"""

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()

class CityExplorerChatbot:
    def __init__(self, city_name="the city", temperature=0.7):
        """
        Initialize the City Explorer Chatbot
        
        Args:
            city_name: Name of the city (default: "the city")
            temperature: Temperature for OpenAI model (default: 0.7)
        """
        self.city_name = city_name
        
        # Initialize OpenAI LLM
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=temperature,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # System prompt that defines the chatbot's role and capabilities
        system_prompt = f"""You are a friendly and knowledgeable city guide assistant helping newcomers explore {city_name}. 
Your expertise includes:

1. **Food & Dining**: 
   - Restaurant recommendations (budget-friendly to fine dining)
   - Local cuisine and specialties
   - Popular food markets and street food
   - Dietary restrictions and options
   - Best times to visit restaurants

2. **Places & Attractions**:
   - Tourist attractions and landmarks
   - Parks, museums, and cultural sites
   - Shopping areas and markets
   - Entertainment venues
   - Hidden gems and off-the-beaten-path locations

3. **Traditions & Culture**:
   - Local customs and traditions
   - Festivals and celebrations
   - Cultural practices and etiquette
   - Historical background
   - Language tips and common phrases

4. **Hospitals & Healthcare**:
   - Hospital locations and contact information
   - Emergency services and 24/7 facilities
   - Specialized medical centers
   - Pharmacy locations
   - Health insurance information

Always be helpful, friendly, and provide detailed, practical information. If you don't know something specific, acknowledge it and provide general guidance. 
Remember the context of previous conversations to provide personalized recommendations."""

        # Create prompt template with memory placeholder
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])
        
        # Initialize memory to store conversation history
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Create LLM chain with memory
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.prompt,
            memory=self.memory,
            verbose=False
        )

    def get_response(self, user_input):
        """
        Get a response from the chatbot
        
        Args:
            user_input: User's question or message
            
        Returns:
            str: Chatbot's response
        """
        try:
            # Get response from the chain
            response = self.chain.invoke({"input": user_input})
            return response["text"]
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}. Please try again."
    
    def chat(self):
        """
        Start an interactive chat session
        """
        print("=" * 60)
        print(f"🏙️  Welcome to {self.city_name} Explorer Chatbot!")
        print("=" * 60)
        print("\nI can help you explore:")
        print("  🍕 Food & Restaurants")
        print("  🏛️  Places & Attractions")
        print("  🎭 Traditions & Culture")
        print("  🏥 Hospitals & Healthcare")
        print("\nType 'quit', 'exit', or 'bye' to end the conversation.")
        print("=" * 60)
        print()
        
        while True:
            try:
                user_input = input("You: ").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() in ['quit', 'exit', 'bye', 'q']:
                    print("\n👋 Thank you for using City Explorer! Have a great time exploring!")
                    break
                
                print("\n🤖 Assistant: ", end="", flush=True)
                response = self.get_response(user_input)
                print(response)
                print()
                
            except KeyboardInterrupt:
                print("\n\n👋 Thank you for using City Explorer! Have a great time exploring!")
                break
            except Exception as e:
                print(f"\n❌ Error: {str(e)}")
                print("Please try again or type 'quit' to exit.\n")


def main():
    """
    Main function to run the chatbot
    """
    # Check if API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY not found in environment variables.")
        print("Please create a .env file with your OpenAI API key:")
        print("OPENAI_API_KEY=your_api_key_here")
        return
    
    # Get city name from user (optional)
    print("Enter the city name (or press Enter for generic 'city'): ", end="")
    city_name = input().strip() or "the city"
    
    # Initialize and start chatbot
    chatbot = CityExplorerChatbot(city_name=city_name)
    chatbot.chat()


if __name__ == "__main__":
    main()
