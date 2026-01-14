import express from 'express';
import { invokeTravelAgent } from '../agents/travelAgent.js';

// City-specific landmarks and places - used to detect wrong city information
const cityLandmarks = {
  'nagpur': ['sitabardi', 'sitabuldi', 'deekshabhoomi', 'futala lake', 'ambazari lake', 'zero mile stone', 'maharajbagh', 'seminary hills', 'ramtek', 'saoji', 'orange barfi', 'tarri poha'],
  'pune': ['shaniwar wada', 'aga khan palace', 'sinhagad fort', 'osho ashram', 'fc road', 'laxmi road', 'tulsi baug', 'dagdusheth halwai', 'parvati hill', 'misal pav', 'vada pav'],
  'delhi': ['red fort', 'india gate', 'qutub minar', 'chandni chowk', 'connaught place', 'jama masjid', 'lotus temple', 'chole bhature', 'butter chicken', 'parathas'],
  'mumbai': ['gateway of india', 'marine drive', 'juhu beach', 'colaba causeway', 'siddhivinayak temple', 'vada pav', 'pav bhaji', 'bhel puri'],
  'jaipur': ['hawa mahal', 'city palace', 'johari bazaar', 'amer fort', 'jal mahal', 'dal baati churma', 'laal maas', 'ghevar'],
  'bangalore': ['lalbagh', 'cubbon park', 'commercial street', 'iskcon temple', 'vidhana soudha', 'masala dosa', 'idli vada']
};

// Helper function to detect if wrong city landmarks are mentioned
function detectWrongCityLandmarks(responseText, correctCity) {
  const responseLower = responseText.toLowerCase();
  const correctCityLower = correctCity.toLowerCase();
  
  // Get landmarks for the correct city
  const correctLandmarks = cityLandmarks[correctCityLower] || [];
  
  // Check if response contains landmarks from other cities
  for (const [cityKey, landmarks] of Object.entries(cityLandmarks)) {
    if (cityKey === correctCityLower) continue;
    
    let wrongLandmarkCount = 0;
    landmarks.forEach(landmark => {
      if (responseLower.includes(landmark.toLowerCase())) {
        wrongLandmarkCount++;
      }
    });
    
    // If multiple landmarks from another city are mentioned, it's likely wrong
    if (wrongLandmarkCount >= 2) {
      return cityKey;
    }
  }
  
  return null;
}

// Helper function to detect if wrong city is mentioned
function detectWrongCity(responseText, correctCity) {
  const responseLower = responseText.toLowerCase();
  const correctCityLower = correctCity.toLowerCase();
  
  // First check for wrong city landmarks (more reliable)
  const wrongCityFromLandmarks = detectWrongCityLandmarks(responseText, correctCity);
  if (wrongCityFromLandmarks) {
    return wrongCityFromLandmarks;
  }
  
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
      
      // Create a direct, imperative query emphasizing factual, city-specific information
      // Add explicit warnings about not mixing cities
      const citySpecificExamples = {
        'nagpur': 'Sitabardi Fort, Deekshabhoomi, Futala Lake, Ambazari Lake, Zero Mile Stone, Saoji cuisine, Orange Barfi, Tarri Poha, Sitabuldi area, Maharajbagh',
        'pune': 'Shaniwar Wada, Aga Khan Palace, Sinhagad Fort, Misal Pav, FC Road, Osho Ashram, Laxmi Road, Tulsi Baug',
        'delhi': 'Red Fort, India Gate, Qutub Minar, Chandni Chowk, Chole Bhature, Parathas, Connaught Place, Jama Masjid',
        'mumbai': 'Gateway of India, Marine Drive, Juhu Beach, Vada Pav, Pav Bhaji, Colaba Causeway, Siddhivinayak Temple'
      };
      
      const cityLower = cityName.toLowerCase();
      const specificExample = citySpecificExamples[cityLower] || 'actual places and dishes specific to this city';
      
      enhancedMessage = `You are a travel expert. Provide accurate, factual travel information about ${cityName}, India.

CRITICAL: Do NOT provide information about other cities. If the user asks about ${cityName}, provide information ONLY about ${cityName}.

DO NOT mention places from other cities:
- If asked about Nagpur, do NOT mention: Shaniwar Wada, Aga Khan Palace, Sinhagad Fort, Osho Ashram, FC Road, Laxmi Road, Tulsi Baug (these are in Pune)
- If asked about Pune, do NOT mention: Sitabardi, Deekshabhoomi, Futala Lake, Saoji (these are in Nagpur)
- Each city has its own unique places and dishes - use only ${cityName}-specific information

REQUIREMENTS FOR ${cityName}:
- Use your knowledge base to provide REAL, FACTUAL information about ${cityName} ONLY
- Mention ACTUAL place names, landmarks, monuments in ${cityName} (e.g., ${specificExample})
- Mention ACTUAL local dishes famous in ${cityName} (not dishes from other cities)
- Mention ACTUAL temple/mosque/church names in ${cityName}
- Mention ACTUAL market names and shopping areas in ${cityName}
- Provide REAL hotel recommendations or areas in ${cityName}
- Include accurate transport information for ${cityName}

For ${cityName}, provide:
1. Food and famous dishes: List actual dish names famous in ${cityName} (NOT dishes from other cities)
2. Tourist spots: List actual places, monuments, parks, lakes, forts in ${cityName} (NOT places from other cities)
3. Temples and religious places: List actual temple/mosque/church names in ${cityName}
4. Markets and shopping: List actual market names and shopping areas in ${cityName}
5. Hotels: Mention hotel names or areas in ${cityName}
6. Transport and best time: Provide accurate information for ${cityName}

Start with "Meow 😺! Welcome to ${cityName}!" and provide factual, accurate information with real place names and dish names specific to ${cityName} ONLY.`;
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
      
      // Use helper function to detect wrong city (checks both city names and landmarks)
      const wrongCityMentioned = detectWrongCity(responseText, cityName);
      
      // Also check specifically for wrong landmarks
      const wrongCityFromLandmarks = detectWrongCityLandmarks(responseText, cityName);
      const detectedWrongCity = wrongCityFromLandmarks || wrongCityMentioned;
      
      // Check if response mentions the correct city
      const correctCityMentioned = responseLower.includes(cityLower);
      
      // Get correct city mention count
      const correctCityCount = (responseLower.match(new RegExp(cityLower, 'g')) || []).length;
      
      // Check for generic information (common phrases that appear in all cities)
      const genericPhrases = [
        'famous tourist spots',
        'best hotels',
        'local food',
        'famous dishes',
        'temples and religious places',
        'local markets'
      ];
      const hasSpecificInfo = [
        // Check for actual place names (capitalized words that might be places)
        /[A-Z][a-z]+ (Palace|Fort|Temple|Market|Beach|Park|Museum|Gate|Tower)/g,
        // Check for specific dish names (common Indian dish patterns)
        /\b(Misal|Pav|Bhature|Dosa|Biryani|Kebab|Tikka|Curry|Thali)\b/gi,
        // Check for specific area/street names
        /(Road|Street|Chowk|Bazaar|Market|Nagar)/gi
      ].some(pattern => pattern.test(responseText));
      
      console.log(`\n=== RESPONSE VALIDATION ===`);
      console.log(`Requested city: "${cityName}"`);
      console.log(`Correct city mentioned: ${correctCityMentioned} (${correctCityCount} times)`);
      console.log(`Wrong city detected (from name): ${wrongCityMentioned || 'None'}`);
      console.log(`Wrong city detected (from landmarks): ${wrongCityFromLandmarks || 'None'}`);
      console.log(`Final detected wrong city: ${detectedWrongCity || 'None'}`);
      console.log(`Has specific information: ${hasSpecificInfo}`);
      console.log(`Response length: ${responseText.length} characters`);
      console.log(`Response preview: ${responseText.substring(0, 200)}...`);
      console.log(`===========================\n`);
      
      // Warn if response seems generic
      if (!hasSpecificInfo && responseText.length < 500) {
        console.warn(`⚠️  WARNING: Response may be too generic. Consider requesting more specific information.`);
      }
      
      if (detectedWrongCity) {
        console.error(`❌ CRITICAL ERROR: Response contains information about "${detectedWrongCity}" instead of "${cityName}"`);
        if (wrongCityFromLandmarks) {
          console.error(`   Detected via landmarks: Response mentions landmarks from ${wrongCityFromLandmarks}`);
        }
        console.error('Response preview:', responseText.substring(0, 400));
        
        // Try to get a corrected response with a very explicit query
        try {
          const wrongCityName = detectedWrongCity;
          const correctionQuery = `CRITICAL ERROR: You provided information about "${wrongCityName}" (including places like ${cityLandmarks[wrongCityName]?.slice(0, 3).join(', ') || 'various landmarks'}) but the user asked about "${cityName}". 

You MUST provide information about "${cityName}" ONLY. Do not mention "${wrongCityName}" or any places from "${wrongCityName}". 

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
            const correctedHasWrongLandmarks = detectWrongCityLandmarks(correctedResponse, cityName);
            const correctedHasCorrectCity = correctedLower.includes(cityLower);
            
            if (!correctedHasWrongCity && !correctedHasWrongLandmarks && correctedHasCorrectCity) {
              responseText = correctedResponse;
              console.log('✅ Corrected response generated and validated');
            } else {
              console.warn('⚠️  Corrected response still has issues, using text replacement');
              responseText = replaceWrongCityInText(responseText, detectedWrongCity, cityName);
            }
          } else {
            responseText = replaceWrongCityInText(responseText, detectedWrongCity, cityName);
          }
        } catch (error) {
          console.error('Error generating correction:', error);
          responseText = replaceWrongCityInText(responseText, detectedWrongCity, cityName);
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
