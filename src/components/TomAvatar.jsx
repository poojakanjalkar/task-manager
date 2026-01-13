import { useEffect, useState } from 'react';

/**
 * Tom the Cat Avatar Component
 * 
 * Features:
 * - Blinking animation when idle
 * - Mouth movement when speaking
 * - Attentive state when user types
 * - Speaking indicator (sound waves)
 * - Bounce/head movement animations
 */
export default function TomAvatar({ isSpeaking, isThinking, isAttentive }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Blinking animation (random intervals)
  useEffect(() => {
    if (isSpeaking || isThinking || isAttentive) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [isSpeaking, isThinking, isAttentive]);

  // Mouth movement animation when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(false);
      return;
    }

    const mouthInterval = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 300);

    return () => clearInterval(mouthInterval);
  }, [isSpeaking]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Tom the Cat SVG */}
      <div className={`relative transition-all duration-300 ${isSpeaking ? 'animate-bounce-slow' : ''} ${isAttentive ? 'scale-110' : ''}`}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="drop-shadow-lg"
        >
          {/* Cat Head */}
          <ellipse
            cx="60"
            cy="50"
            rx="45"
            ry="40"
            fill="#FFA500"
            stroke="#FF8C00"
            strokeWidth="2"
          />

          {/* Left Ear */}
          <polygon
            points="25,25 35,5 45,25"
            fill="#FFA500"
            stroke="#FF8C00"
            strokeWidth="2"
          />
          <polygon
            points="28,22 35,10 42,22"
            fill="#FFB84D"
          />

          {/* Right Ear */}
          <polygon
            points="75,25 85,5 95,25"
            fill="#FFA500"
            stroke="#FF8C00"
            strokeWidth="2"
          />
          <polygon
            points="78,22 85,10 92,22"
            fill="#FFB84D"
          />

          {/* Left Eye */}
          <ellipse
            cx="45"
            cy="45"
            rx="8"
            ry={isBlinking ? 1 : 12}
            fill="#000"
            className="transition-all duration-150"
          />
          <circle
            cx="47"
            cy="43"
            r="3"
            fill="#FFF"
            className={isBlinking ? 'opacity-0' : 'opacity-100 transition-opacity duration-150'}
          />

          {/* Right Eye */}
          <ellipse
            cx="75"
            cy="45"
            rx="8"
            ry={isBlinking ? 1 : 12}
            fill="#000"
            className="transition-all duration-150"
          />
          <circle
            cx="77"
            cy="43"
            r="3"
            fill="#FFF"
            className={isBlinking ? 'opacity-0' : 'opacity-100 transition-opacity duration-150'}
          />

          {/* Nose */}
          <polygon
            points="60,55 55,60 65,60"
            fill="#FF69B4"
          />

          {/* Mouth */}
          {mouthOpen ? (
            <ellipse
              cx="60"
              cy="70"
              rx="8"
              ry="12"
              fill="#000"
              className="transition-all duration-300"
            />
          ) : (
            <path
              d="M 55 60 Q 60 65 65 60"
              stroke="#000"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          )}

          {/* Whiskers Left */}
          <line
            x1="20"
            y1="50"
            x2="35"
            y2="52"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="60"
            x2="35"
            y2="60"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Whiskers Right */}
          <line
            x1="85"
            y1="52"
            x2="100"
            y2="50"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="85"
            y1="60"
            x2="100"
            y2="60"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Body (simple) */}
          <ellipse
            cx="60"
            cy="100"
            rx="35"
            ry="25"
            fill="#FFA500"
            stroke="#FF8C00"
            strokeWidth="2"
          />
        </svg>

        {/* Speaking Indicator - Sound Waves */}
        {isSpeaking && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-1 h-4 bg-blue-400 rounded-full animate-sound-wave" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-4 bg-blue-400 rounded-full animate-sound-wave" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Tom's Name */}
      <div className="mt-2 text-center">
        <p className="text-lg font-bold text-orange-600">Tom</p>
        <p className="text-xs text-gray-500">Your Travel Buddy</p>
      </div>
    </div>
  );
}
