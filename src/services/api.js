/**
 * API Service
 * 
 * Handles all HTTP requests to the backend API
 * Centralized API configuration and error handling
 */

// API base URL - change this to match your backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

/**
 * Helper function to handle API responses
 * 
 * @param {Response} response - Fetch API response
 * @returns {Promise} Parsed JSON data
 */
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred')
  }
  
  return data
}

/**
 * Fetch all todos from the API
 * 
 * @returns {Promise<Array>} Array of todo objects
 */
export const fetchTodos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`)
    const result = await handleResponse(response)
    return result.data || []
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
}

/**
 * Create a new todo
 * 
 * @param {string} title - Task title
 * @param {boolean} completed - Completion status (optional)
 * @returns {Promise<Object>} Created todo object
 */
export const createTodo = async (title, completed = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed }),
    })
    const result = await handleResponse(response)
    return result.data
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

/**
 * Update an existing todo
 * 
 * @param {string} id - Todo ID
 * @param {Object} updates - Object with title and/or completed fields
 * @returns {Promise<Object>} Updated todo object
 */
export const updateTodo = async (id, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    const result = await handleResponse(response)
    return result.data
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

/**
 * Delete a todo
 * 
 * @param {string} id - Todo ID
 * @returns {Promise<void>}
 */
export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    })
    await handleResponse(response)
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
