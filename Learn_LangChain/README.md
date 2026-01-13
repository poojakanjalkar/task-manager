# City Explorer Chatbot 🏙️

A helpful chatbot built with **LangChain** and **OpenAI** that assists newcomers in exploring a city. The chatbot can provide information about:

- 🍕 **Food** - Restaurants, local cuisine, food recommendations
- 🏛️ **Places** - Tourist attractions, landmarks, must-visit locations
- 🎭 **Traditions** - Cultural practices, festivals, local customs
- 🏥 **Hospitals** - Medical facilities, emergency services, healthcare information

## 🚀 Features

- **Powered by OpenAI GPT-3.5-turbo** via LangChain framework
- **Context-aware conversations** - Remembers previous interactions
- **Specialized knowledge** in food, places, traditions, and healthcare
- **Interactive CLI** - Easy to use command-line interface
- **Customizable city** - Specify any city name when starting

## 📋 Prerequisites

- Python 3.8 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🛠️ Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the chatbot:**
```bash
python chatbot.py
```

## 💬 Usage

When you run the chatbot, you'll be prompted to enter a city name (or press Enter for a generic city). Then you can start asking questions!

### Example Questions:

**Food & Dining:**
- "What are the best restaurants in the city?"
- "Where can I find vegetarian food?"
- "Tell me about local street food"
- "What's the best place for breakfast?"

**Places & Attractions:**
- "What are the must-visit tourist attractions?"
- "Tell me about popular museums"
- "Where can I go shopping?"
- "What are some hidden gems in the city?"

**Traditions & Culture:**
- "What are the local traditions and festivals?"
- "Tell me about cultural practices I should know"
- "What are some important customs?"
- "When are the major festivals celebrated?"

**Hospitals & Healthcare:**
- "Where can I find hospitals near me?"
- "What are the emergency services available?"
- "Tell me about 24/7 medical facilities"
- "Where can I find pharmacies?"

### Commands:
- Type `quit`, `exit`, `bye`, or `q` to end the conversation
- Press `Ctrl+C` to exit at any time

## 🏗️ Project Structure

```
Learn_LangChain/
├── chatbot.py          # Main chatbot implementation
├── requirements.txt    # Python dependencies
├── .env.example        # Example environment file
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 🔧 How It Works

1. **LangChain Integration**: Uses LangChain's `ChatOpenAI` to interact with OpenAI's API
2. **Memory Management**: Uses `ConversationBufferMemory` to maintain conversation context
3. **Prompt Engineering**: Custom system prompt that defines the chatbot's expertise areas
4. **Chain Pattern**: Uses LangChain's `LLMChain` to handle the conversation flow

## 📝 Code Structure

- `CityExplorerChatbot` class: Main chatbot class
  - `__init__()`: Initializes the LLM, memory, and prompt template
  - `get_response()`: Processes user input and returns chatbot response
  - `chat()`: Interactive chat loop

## 🔐 Security Note

⚠️ **Never commit your `.env` file** - It contains your API key. The `.gitignore` file is already configured to exclude it.

## 🎯 Future Enhancements

- Add support for multiple cities with specific data
- Integrate with external APIs for real-time information
- Add web interface
- Support for multiple languages
- Add voice input/output

## 📄 License

This project is open source and available for learning purposes.
