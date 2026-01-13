/**
 * Travel API Service
 * 
 * Handles all API calls to the travel agent backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Send a message to Tom the travel agent
 * @param {string} message - User's message
 * @param {string} city - Optional city name
 * @returns {Promise<{success: boolean, response: string}>}
 */
export async function chatWithTom(message, city = '') {
  try {
    console.log('Calling API:', `${API_BASE_URL}/travel/chat`, { message, city });
    
    const response = await fetch(`${API_BASE_URL}/travel/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, city }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to get response from Tom';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get response from Tom');
    }
    
    return data;
  } catch (error) {
    console.error('Error chatting with Tom:', error);
    // Re-throw with more context
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 5001.');
    }
    throw error;
  }
}

/**
 * Check if travel agent service is healthy
 * @returns {Promise<boolean>}
 */
export async function checkTravelServiceHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/travel/health`);
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Travel service health check failed:', error);
    return false;
  }
}
