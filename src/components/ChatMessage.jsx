import { useEffect, useState } from 'react';

/**
 * Chat Message Component
 * 
 * Displays individual chat messages with:
 * - User messages on the right
 * - Tom's messages on the left
 * - Word-by-word animation for Tom's responses
 */
export default function ChatMessage({ message, isUser, isTyping = false }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check for message
  if (!message || typeof message !== 'string') {
    return null;
  }

  // Word-by-word animation for Tom's messages
  useEffect(() => {
    if (isUser || isTyping) {
      setDisplayedText(message || '');
      return;
    }

    setDisplayedText('');
    setCurrentIndex(0);

    const words = message.split(' ');
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        setDisplayedText(prev => 
          prev ? `${prev} ${words[wordIndex]}` : words[wordIndex]
        );
        wordIndex++;
        setCurrentIndex(wordIndex);
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust speed here (lower = faster)

    return () => clearInterval(interval);
  }, [message, isUser, isTyping]);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-slide-in-right">
        <div className="max-w-[75%] md:max-w-[60%]">
          <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
            <p className="text-sm md:text-base whitespace-pre-wrap break-words">
              {message}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">You</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 animate-slide-in-left">
      <div className="max-w-[75%] md:max-w-[60%]">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
          <p className="text-sm md:text-base text-gray-800 whitespace-pre-wrap break-words">
            {displayedText}
            {currentIndex < message.split(' ').length && (
              <span className="inline-block w-2 h-4 bg-orange-500 ml-1 animate-blink-cursor"></span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-semibold text-orange-600">Tom</span>
          <span className="text-xs text-gray-500">😺</span>
        </div>
      </div>
    </div>
  );
}
