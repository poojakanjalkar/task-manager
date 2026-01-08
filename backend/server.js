import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import todoRoutes from './routes/todoRoutes.js'

// Load environment variables from .env file
dotenv.config()

/**
 * Express Server Setup
 * 
 * Main server file that:
 * - Initializes Express app
 * - Configures middleware (CORS, JSON parsing)
 * - Connects to MongoDB
 * - Sets up API routes
 * - Handles errors
 */

// Initialize Express app
const app = express()

// Get environment variables with defaults
const PORT = process.env.PORT || 5001  // Changed default to 5001 to avoid port conflicts
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

// ==================== Middleware ====================

/**
 * CORS Configuration
 * 
 * Allows frontend to make requests to the API
 * Configure allowed origins, methods, and headers
 */
app.use(
  cors({
    origin: CORS_ORIGIN, // Frontend URL
    credentials: true, // Allow cookies/credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
  })
)

/**
 * Body Parser Middleware
 * 
 * Parses incoming JSON requests
 * Allows Express to read JSON data from request body
 */
app.use(express.json())

/**
 * URL Encoded Parser
 * 
 * Parses URL-encoded data (form data)
 */
app.use(express.urlencoded({ extended: true }))

// ==================== Routes ====================

/**
 * Health Check Endpoint
 * 
 * Simple endpoint to verify server is running
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

/**
 * API Routes
 * 
 * All todo-related routes are prefixed with /api/todos
 */
app.use('/api/todos', todoRoutes)

/**
 * Root Endpoint
 * 
 * Welcome message for API
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to To-Do List API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      todos: '/api/todos'
    }
  })
})

// ==================== Error Handling ====================

/**
 * 404 Handler
 * 
 * Handles requests to non-existent routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  })
})

/**
 * Global Error Handler
 * 
 * Catches any unhandled errors and returns appropriate response
 */
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ==================== Server Startup ====================

/**
 * Start Server
 * 
 * Connects to MongoDB and starts Express server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB(MONGODB_URI)
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📡 API available at http://localhost:${PORT}/api`)
      console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
