import express from 'express';
import { invokeTravelAgent } from '../agents/travelAgent.js';

// Helper function to detect if wrong city is mentioned
function detectWrongCity(responseText, correctCity) {
  const responseLower = responseText.toLowerCase();
  const correctCityLower = correctCity.toLowerCase();
  
  // Common Indian cities that might be confused
  const commonCities = {
    'delhi': ['new delhi', 'delhi'],
    'mumbai': ['mumbai', 'bombay'],
    'bangalore': ['bangalore', 'bengaluru'],
    'chennai': ['chennai', 'madras'],
    'kolkata': ['kolkata', 'calcutta'],
    'hyderabad': ['hyderabad'],
    'pune': ['pune', 'puna'],
    'jaipur': ['jaipur'],
    'udaipur': ['udaipur'],
    'goa': ['goa'],
    'varanasi': ['varanasi', 'banaras', 'benares'],
    'ahmedabad': ['ahmedabad'],
    'surat': ['surat'],
    'lucknow': ['lucknow'],
    'kanpur': ['kanpur'],
    'nagpur': ['nagpur']
  };
  
  // Check if any other city is mentioned prominently
  for (const [cityKey, variations] of Object.entries(commonCities)) {
    if (cityKey === correctCityLower) continue;
    
    let wrongCityCount = 0;
    variations.forEach(variation => {
      const matches = responseLower.match(new RegExp(`\\b${variation}\\b`, 'gi'));
      if (matches) wrongCityCount += matches.length;
    });
    
    const correctCityCount = (responseLower.match(new RegExp(`\\b${correctCityLower}\\b`, 'gi')) || []).length;
    
    // If wrong city is mentioned prominently (more than once and more than correct city), it's likely wrong
    if (wrongCityCount > 0 && (wrongCityCount > correctCityCount || wrongCityCount > 2)) {
      return cityKey;
    }
  }
  
  return null;
}

// Helper function to replace wrong city mentions with correct city
function replaceWrongCityInText(text, wrongCity, correctCity) {
  if (!wrongCity) return text;
  
  const wrongCityLower = wrongCity.toLowerCase();
  const correctCityLower = correctCity.toLowerCase();
  const correctCityCapitalized = correctCity.charAt(0).toUpperCase() + correctCity.slice(1).toLowerCase();
  
  // Replace wrong city mentions with correct city (case-insensitive)
  let correctedText = text;
  
  // Create regex to match wrong city (word boundary to avoid partial matches)
  const wrongCityRegex = new RegExp(`\\b${wrongCity}\\b`, 'gi');
  correctedText = correctedText.replace(wrongCityRegex, correctCityCapitalized);
  
  // Also replace common variations
  const variations = {
    'delhi': ['new delhi'],
    'mumbai': ['bombay'],
    'bangalore': ['bengaluru'],
    'chennai': ['madras'],
    'kolkata': ['calcutta'],
    'varanasi': ['banaras', 'benares']
  };
  
  if (variations[wrongCityLower]) {
    variations[wrongCityLower].forEach(variation => {
      const variationRegex = new RegExp(`\\b${variation}\\b`, 'gi');
      correctedText = correctedText.replace(variationRegex, correctCityCapitalized);
    });
  }
  
  // Ensure the greeting mentions the correct city
  if (!correctedText.toLowerCase().includes(`welcome to ${correctCityLower}`)) {
    correctedText = `Meow 😺! Welcome to ${correctCityCapitalized}! ${correctedText}`;
  }
  
  return correctedText;
}

const router = express.Router();

/**
 * POST /api/travel/chat
 * 
 * Endpoint to chat with Tom the travel agent
 * Body: { message: string, city?: string }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, city } = req.body;
    
    // Log incoming request for debugging
    console.log('Received request - City:', city, 'Message:', message?.substring(0, 100));

    // Validate: either message or city must be provided
    if ((!message || typeof message !== 'string' || message.trim() === '') && 
        (!city || typeof city !== 'string' || city.trim() === '')) {
      return res.status(400).json({
        success: false,
        error: 'Either message or city must be provided'
      });
    }

    // Extract city name - prioritize explicit city parameter over message
    let requestedCity = null;
    if (city && city.trim() !== '') {
      requestedCity = city.trim();
    } else if (message && message.trim() !== '') {
      // Try to extract city name from message (simple extraction)
      // Look for patterns like "about [city]", "in [city]", etc.
      const cityPatterns = [
        /(?:about|in|for|to)\s+([A-Z][a-zA-Z\s]+?)(?:\s|$|,|\.|!|\?)/g,
        /(?:tell me|information|details).*?([A-Z][a-zA-Z\s]{2,20}?)(?:\s|$|,|\.)/g
      ];
      
      for (const pattern of cityPatterns) {
        const matches = message.match(pattern);
        if (matches && matches.length > 0) {
          // Take the first substantial match
          const potentialCity = matches[0].replace(/(?:about|in|for|to|tell me|information|details)\s+/i, '').trim();
          if (potentialCity.length > 2 && potentialCity.length < 30) {
            requestedCity = potentialCity;
            break;
          }
        }
      }
    }
    
    // Enhance the message with city context
    let enhancedMessage = message || '';
    
    if (requestedCity) {
      const cityName = requestedCity;
      
      // Create a direct, imperative query with city name repeated MANY times
      // This ensures the agent cannot miss or confuse the city name
      enhancedMessage = `The user wants information about ${cityName}. 

CITY NAME: ${cityName}
CITY NAME: ${cityName}
CITY NAME: ${cityName}

Provide comprehensive travel information about ${cityName} and ONLY ${cityName}. 

Do NOT provide information about Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Jaipur, Udaipur, Goa, Varanasi, or ANY other city. Only ${cityName}.

Required information about ${cityName}:
1. Food and famous dishes in ${cityName}
2. Hotels (budget, mid-range, luxury) in ${cityName}  
3. Tourist spots in ${cityName}
4. Temples and religious places in ${cityName}
5. Markets and shopping in ${cityName}
6. Transport tips and best time to visit ${cityName}

Your response must start with "Meow 😺! Welcome to ${cityName}!" and mention ${cityName} at least 5 times. All information must be about ${cityName} only.`;
    } else if (!enhancedMessage || enhancedMessage.trim() === '') {
      // Fallback if somehow both are empty (shouldn't happen due to validation)
      enhancedMessage = 'Tell me about travel destinations.';
    }
    
    // Log the enhanced message for debugging
    console.log('=== CITY REQUEST ===');
    console.log('City:', city);
    console.log('Enhanced message (first 300 chars):', enhancedMessage.substring(0, 300));
    console.log('===================');

    // Invoke the travel agent
    const agentResponse = await invokeTravelAgent(enhancedMessage);
    
    // The invokeTravelAgent function should already return a string
    // But add a safety check just in case
    let responseText = typeof agentResponse === 'string' 
      ? agentResponse 
      : String(agentResponse || 'Sorry, I could not generate a response.');

    // Validate and correct the response (if city was provided)
    if (requestedCity) {
      const cityName = requestedCity;
      const cityLower = cityName.toLowerCase();
      const responseLower = responseText.toLowerCase();
      
      // Use helper function to detect wrong city
      const wrongCityMentioned = detectWrongCity(responseText, cityName);
      
      // Check if response mentions the correct city
      const correctCityMentioned = responseLower.includes(cityLower);
      
      // Get correct city mention count
      const correctCityCount = (responseLower.match(new RegExp(cityLower, 'g')) || []).length;
      
      console.log(`\n=== RESPONSE VALIDATION ===`);
      console.log(`Requested city: "${cityName}"`);
      console.log(`Correct city mentioned: ${correctCityMentioned} (${correctCityCount} times)`);
      console.log(`Wrong city detected: ${wrongCityMentioned || 'None'}`);
      console.log(`===========================\n`);
      
      if (wrongCityMentioned) {
        console.error(`❌ CRITICAL ERROR: Response mentions wrong city "${wrongCityMentioned}" instead of "${cityName}"`);
        console.error('Response preview:', responseText.substring(0, 400));
        
        // Try to get a corrected response with a very explicit query
        try {
          const correctionQuery = `ERROR: You provided information about "${wrongCityMentioned}" but the user asked about "${cityName}". 

You MUST provide information about "${cityName}" ONLY. Do not mention "${wrongCityMentioned}" or any other city. 

Provide comprehensive travel information about "${cityName}" including:
1. Food and famous dishes in ${cityName}
2. Hotels (budget, mid-range, luxury) in ${cityName}
3. Tourist spots in ${cityName}
4. Temples and religious places in ${cityName}
5. Markets and shopping in ${cityName}
6. Transport tips and best time to visit ${cityName}

Start with "Meow 😺! Welcome to ${cityName}!" and mention ${cityName} multiple times.`;
          
          const correctedResponse = await invokeTravelAgent(correctionQuery);
          if (correctedResponse && typeof correctedResponse === 'string') {
            // Validate the corrected response
            const correctedLower = correctedResponse.toLowerCase();
            const correctedHasWrongCity = detectWrongCity(correctedResponse, cityName);
            const correctedHasCorrectCity = correctedLower.includes(cityLower);
            
            if (!correctedHasWrongCity && correctedHasCorrectCity) {
              responseText = correctedResponse;
              console.log('✅ Corrected response generated and validated');
            } else {
              console.warn('⚠️  Corrected response still has issues, using text replacement');
              responseText = replaceWrongCityInText(responseText, wrongCityMentioned, cityName);
            }
          } else {
            responseText = replaceWrongCityInText(responseText, wrongCityMentioned, cityName);
          }
        } catch (error) {
          console.error('Error generating correction:', error);
          responseText = replaceWrongCityInText(responseText, wrongCityMentioned, cityName);
        }
      } else if (!correctCityMentioned) {
        console.warn(`⚠️  WARNING: Response does not mention the requested city "${cityName}"`);
        console.warn('Response preview:', responseText.substring(0, 200));
        
        // Prepend a correction to the response
        responseText = `Meow 😺! Welcome to ${cityName}! Let me provide you with information about ${cityName}.\n\n${responseText}`;
      } else if (correctCityCount < 3) {
        console.warn(`⚠️  City mentioned only ${correctCityCount} times - ensuring it's more prominent`);
        // Ensure city name appears in the greeting
        if (!responseText.toLowerCase().startsWith(`meow`) || !responseLower.includes(`welcome to ${cityLower}`)) {
          responseText = `Meow 😺! Welcome to ${cityName}! ${responseText}`;
        }
      } else {
        console.log(`✅ Response correctly mentions "${cityName}" ${correctCityCount} times`);
      }
    }

    res.json({
      success: true,
      response: responseText,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in travel chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get response from travel agent',
      message: error.message
    });
  }
});

/**
 * GET /api/travel/health
 * 
 * Health check for travel agent service
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Travel agent service is running',
    agent: 'Tom (The Talking Cat)'
  });
});

export default router;
