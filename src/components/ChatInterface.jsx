import { useState, useRef, useEffect } from 'react';
import { chatWithTom } from '../services/travelApi';
import ChatMessage from './ChatMessage';

/**
 * Chat Interface Component
 * 
 * Main chat component with:
 * - Message input
 * - City search
 * - Message history
 * - Loading states
 * - Error handling
 */
export default function ChatInterface({ onStateChange }) {
  const [messages, setMessages] = useState([
    {
      text: "Meow 😺! Hi there! I'm Tom, your friendly travel buddy! Ask me about any city - I can help you with food, hotels, tourist spots, temples, markets, transport, and more! Where would you like to explore?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Determine Tom's state and notify parent
  const isSpeaking = messages[messages.length - 1]?.isUser === false && !isLoading && !isTyping;
  const isThinking = isLoading;
  const isAttentive = inputValue.length > 0;

  useEffect(() => {
    if (onStateChange) {
      onStateChange({ isSpeaking, isThinking, isAttentive });
    }
  }, [isSpeaking, isThinking, isAttentive, onStateChange]);

  const handleSend = async () => {
    if (!inputValue.trim() && !city.trim()) {
      return;
    }

    const userMessage = inputValue.trim() || `Tell me about ${city}`;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      const response = await chatWithTom(userMessage, city);
      setIsTyping(false);
      
      // Validate and extract response text
      const responseText = response?.response || response?.message || 'Sorry, I could not generate a response.';
      
      if (!responseText || typeof responseText !== 'string') {
        throw new Error('Invalid response format from server');
      }
      
      // Add Tom's response with a slight delay for better UX
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: responseText, isUser: false },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setIsTyping(false);
      setIsLoading(false);
      setError(err.message || 'Failed to get response from Tom. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          text: "Meow 😺! Sorry, I'm having trouble right now. Could you please try again?",
          isUser: false,
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleCitySearch = async () => {
    if (!city.trim()) return;
    
    const cityName = city.trim();
    
    // Create a clear message that emphasizes the city
    const userMessage = `Tell me everything about ${cityName}`;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Send the message with city context - backend will construct explicit query
      const response = await chatWithTom(userMessage, cityName);
      setIsTyping(false);
      
      // Validate response
      if (!response) {
        throw new Error('No response from server');
      }
      
      const responseText = response.response || response.message || 'Sorry, I could not generate a response.';
      
      if (!responseText || typeof responseText !== 'string') {
        throw new Error('Invalid response format from server');
      }
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: responseText, isUser: false },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error in handleCitySearch:', err);
      setIsTyping(false);
      setIsLoading(false);
      const errorMessage = err.message || 'Failed to get response from Tom. Please try again.';
      setError(errorMessage);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          text: `Meow 😺! Sorry, I'm having trouble right now: ${errorMessage}. Please check if the backend server is running.`,
          isUser: false,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* City Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleCitySearch}
            disabled={isLoading || !city.trim()}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isUser={msg.isUser}
            isTyping={index === messages.length - 1 && isTyping}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Tom is thinking...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mx-4 mb-2">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-xs mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Tom about travel destinations..."
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            disabled={isLoading}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!inputValue.trim() && !city.trim())}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
