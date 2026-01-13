import { useState } from 'react';
import TomAvatar from './components/TomAvatar';
import ChatInterface from './components/ChatInterface';

/**
 * Main Travel Application Component
 * 
 * MakeMyTrip-style travel website with Tom the AI travel agent
 */
function TravelApp() {
  const [tomState, setTomState] = useState({
    isSpeaking: false,
    isThinking: false,
    isAttentive: false,
  });

  const handleStateChange = (state) => {
    setTomState(state);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">✈️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TravelBuddy</h1>
                <p className="text-xs text-gray-500">Your AI Travel Companion</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span>Powered by</span>
              <span className="font-semibold text-orange-600">Tom</span>
              <span>😺</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Tom Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <TomAvatar
                isSpeaking={tomState.isSpeaking}
                isThinking={tomState.isThinking}
                isAttentive={tomState.isAttentive}
              />
              
              {/* Quick Tips */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🍽️</span>
                    <span>Ask about local food & famous dishes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🏨</span>
                    <span>Get hotel recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">📍</span>
                    <span>Discover tourist spots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🛕</span>
                    <span>Find temples & religious places</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🛍️</span>
                    <span>Explore local markets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🚕</span>
                    <span>Learn transport tips</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Chat with Tom</h2>
                <p className="text-sm text-orange-100">Your friendly travel guide</p>
              </div>
              <ChatInterface onStateChange={handleStateChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Made with ❤️ using React, Tailwind CSS & LangChain</p>
            <p className="mt-1">Tom the Travel Cat is here to help you explore the world! 🌍</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TravelApp;
