import mongoose from 'mongoose'

/**
 * Database Connection Configuration
 * 
 * Establishes connection to MongoDB using Mongoose
 * Handles connection events and errors
 */

/**
 * Connect to MongoDB
 * 
 * @param {string} mongoURI - MongoDB connection string from environment variables
 */
export const connectDB = async (mongoURI) => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI)
    
    // Log successful connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
    })
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed due to app termination')
      process.exit(0)
    })
    
  } catch (error) {
    // Log connection error
    console.error('❌ Error connecting to MongoDB:', error.message)
    // Throw error instead of exiting - let the caller handle it
    throw error
  }
}
