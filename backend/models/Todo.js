import mongoose from 'mongoose'

/**
 * Todo Schema Definition
 * 
 * Defines the structure of a Todo document in MongoDB
 * Each todo has:
 * - title: The task description (required)
 * - completed: Completion status (default: false)
 * - createdAt: Automatic timestamp when document is created
 */
const todoSchema = new mongoose.Schema(
  {
    // Task title/description
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true, // Remove whitespace from beginning and end
      maxlength: [500, 'Task title cannot exceed 500 characters']
    },
    // Completion status
    completed: {
      type: Boolean,
      default: false // New tasks are incomplete by default
    },
    // Creation timestamp
    createdAt: {
      type: Date,
      default: Date.now // Automatically set to current date/time
    }
  },
  {
    // Enable automatic timestamps (createdAt, updatedAt)
    timestamps: true,
    // Transform document when converting to JSON
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      }
    }
  }
)

/**
 * Todo Model
 * 
 * Creates a model based on the schema
 * This model is used to interact with the 'todos' collection in MongoDB
 */
const Todo = mongoose.model('Todo', todoSchema)

export default Todo
