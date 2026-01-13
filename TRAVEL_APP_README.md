# TravelBuddy - AI Travel Agent with Tom the Cat 🐱✈️

A MakeMyTrip-style travel website featuring **Tom**, a friendly AI travel agent (talking cat) that helps users discover amazing travel destinations.

## Features

### 🧠 AI Agent (LangChain)
- **Tom the Travel Cat**: Friendly, conversational AI agent
- Answers questions about cities including:
  - 🍽️ Best local food & famous dishes
  - 🏨 Best hotels (budget, mid-range, luxury)
  - 📍 Famous tourist spots
  - 🛕 Temples & religious places
  - 🛍️ Local markets & shopping places
  - 🚕 Local transport tips & best time to visit

### 💻 Frontend (React + Tailwind CSS)
- **Modern Chat Interface**: WhatsApp/ChatGPT-style messaging
- **Tom Avatar**: Animated cat with:
  - Blinking animation when idle
  - Mouth movement when speaking
  - Attentive state when user types
  - Speaking indicator (sound waves)
  - Bounce/head movement animations
- **Word-by-word Animation**: Responses appear smoothly
- **City Search**: Quick city-based queries
- **Responsive Design**: Works on mobile and desktop

### 🎨 UI/UX
- Clean, modern, minimal design
- Travel-tech style (similar to MakeMyTrip/Airbnb)
- Smooth animations and transitions
- Error handling for better UX

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- LangChain
- OpenAI API
- Tavily Search (optional, for real-time web search)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API Key

### 1. Install Frontend Dependencies

```bash
cd Learn_AI
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install --legacy-peer-deps
```

**Note**: Use `--legacy-peer-deps` flag to resolve peer dependency conflicts between LangChain packages. This is a standard solution for this type of conflict. See `backend/INSTALLATION_FIX.md` for details.

### 3. Install LangChain Dependencies

```bash
cd Learn_LangChain
npm install
```

### 4. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# OpenAI API Key (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Model name (default: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini

# Optional: Tavily API Key for web search
TAVILY_API_KEY=your_tavily_api_key_here

# Server Configuration
PORT=5001
CORS_ORIGIN=http://localhost:5173

# Optional: MongoDB (only needed for todo app)
MONGODB_URI=mongodb://localhost:27017/todo-app
```

Create a `.env` file in the root `Learn_AI` directory for frontend:

```env
VITE_API_URL=http://localhost:5001/api
```

### 5. Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5001`

### 6. Start the Frontend

```bash
cd Learn_AI
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. You'll see Tom the cat on the left side
3. Use the city search bar or chat directly with Tom
4. Ask questions like:
   - "Best food in Delhi?"
   - "Famous temples in Varanasi"
   - "Best hotels in Goa under budget"
   - "What should I visit in 2 days in Udaipur?"

## Project Structure

```
Learn_AI/
├── src/
│   ├── components/
│   │   ├── TomAvatar.jsx          # Tom the cat avatar with animations
│   │   ├── ChatMessage.jsx        # Individual chat message component
│   │   └── ChatInterface.jsx      # Main chat interface
│   ├── services/
│   │   └── travelApi.js           # API service for travel agent
│   ├── TravelApp.jsx              # Main travel app component
│   ├── App.jsx                    # Todo app (separate)
│   └── main.jsx                   # Entry point
├── backend/
│   ├── agents/
│   │   └── travelAgent.js         # LangChain travel agent
│   ├── routes/
│   │   └── travelRoutes.js        # Travel API routes
│   └── server.js                   # Express server
└── Learn_LangChain/
    └── makeMyTripAgent.js          # Original agent (CommonJS)
```

## API Endpoints

### POST `/api/travel/chat`
Send a message to Tom the travel agent.

**Request:**
```json
{
  "message": "Best food in Delhi?",
  "city": "Delhi"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Meow 😺! Welcome to Delhi! Let me show you...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET `/api/travel/health`
Check if the travel agent service is running.

## Features in Detail

### Tom's Personality
- **Name**: Tom
- **Tone**: Friendly, cute, confident, playful
- **Style**: Speaks like a helpful travel buddy
- **Humor**: Occasionally uses light humor
- **Greeting**: Starts with "Meow 😺!" when excited

### Animations
- **Blinking**: Random intervals when idle
- **Mouth Movement**: Syncs with speaking
- **Sound Waves**: Visual indicator when speaking
- **Bounce**: Gentle bounce when active
- **Text Animation**: Word-by-word appearance

## Troubleshooting

### Backend won't start
- Check if port 5001 is available
- Verify OpenAI API key is set correctly
- Ensure all dependencies are installed

### Frontend can't connect to backend
- Verify backend is running on port 5001
- Check CORS settings in backend
- Verify `VITE_API_URL` in frontend `.env`

### Tom not responding
- Check OpenAI API key is valid
- Verify network connection
- Check browser console for errors

## Future Enhancements (Optional)

- [ ] Voice input (mic button)
- [ ] Text-to-speech for Tom's replies
- [ ] Dark mode
- [ ] Chat history per user session
- [ ] Save favorite destinations
- [ ] Share travel plans

## License

ISC

## Credits

Built with ❤️ using React, Tailwind CSS, LangChain, and OpenAI.
