import mongoose from 'mongoose'
import Todo from '../models/Todo.js'

/**
 * Get All Todos
 * 
 * Fetches all todos from the database
 * Supports optional query parameters for filtering
 * 
 * @route GET /api/todos
 * @returns {Object} JSON response with todos array
 */
export const getAllTodos = async (req, res) => {
  try {
    // Optional query parameters for filtering
    const { completed } = req.query
    
    // Build query object
    const query = {}
    if (completed !== undefined) {
      // Convert string to boolean
      query.completed = completed === 'true'
    }
    
    // Fetch todos from database
    // Sort by creation date (newest first)
    const todos = await Todo.find(query).sort({ createdAt: -1 })
    
    // Return success response with todos
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    })
  } catch (error) {
    // Handle any errors that occur during database query
    res.status(500).json({
      success: false,
      message: 'Error fetching todos',
      error: error.message
    })
  }
}

/**
 * Get Single Todo by ID
 * 
 * Fetches a specific todo by its ID
 * 
 * @route GET /api/todos/:id
 * @param {string} id - Todo ID
 * @returns {Object} JSON response with todo object
 */
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      })
    }
    
    // Find todo by ID
    const todo = await Todo.findById(id)
    
    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      })
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      data: todo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo',
      error: error.message
    })
  }
}

/**
 * Create New Todo
 * 
 * Creates a new todo in the database
 * 
 * @route POST /api/todos
 * @param {string} title - Task title (required)
 * @param {boolean} completed - Completion status (optional, default: false)
 * @returns {Object} JSON response with created todo
 */
export const createTodo = async (req, res) => {
  try {
    const { title, completed } = req.body
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      })
    }
    
    // Create new todo object
    const todoData = {
      title: title.trim(),
      ...(completed !== undefined && { completed: Boolean(completed) })
    }
    
    // Save todo to database
    const todo = await Todo.create(todoData)
    
    // Return success response with created todo
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    })
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      })
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Error creating todo',
      error: error.message
    })
  }
}

/**
 * Update Todo
 * 
 * Updates an existing todo (title and/or completed status)
 * 
 * @route PUT /api/todos/:id
 * @param {string} id - Todo ID
 * @param {string} title - Updated task title (optional)
 * @param {boolean} completed - Updated completion status (optional)
 * @returns {Object} JSON response with updated todo
 */
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params
    const { title, completed } = req.body
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      })
    }
    
    // Build update object with only provided fields
    const updateData = {}
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty'
        })
      }
      updateData.title = title.trim()
    }
    if (completed !== undefined) {
      updateData.completed = Boolean(completed)
    }
    
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided to update'
      })
    }
    
    // Find and update todo
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validators on update
    const todo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
    
    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      })
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    })
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      })
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Error updating todo',
      error: error.message
    })
  }
}

/**
 * Delete Todo
 * 
 * Deletes a todo from the database
 * 
 * @route DELETE /api/todos/:id
 * @param {string} id - Todo ID
 * @returns {Object} JSON response with success message
 */
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      })
    }
    
    // Find and delete todo
    const todo = await Todo.findByIdAndDelete(id)
    
    // Check if todo existed
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      })
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {}
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo',
      error: error.message
    })
  }
}
