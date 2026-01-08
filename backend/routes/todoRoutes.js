import express from 'express'
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController.js'

/**
 * Todo Routes
 * 
 * Defines all API endpoints for todo operations
 * All routes are prefixed with /api/todos
 */

const router = express.Router()

/**
 * @route   GET /api/todos
 * @desc    Get all todos
 * @access  Public
 */
router.get('/', getAllTodos)

/**
 * @route   GET /api/todos/:id
 * @desc    Get single todo by ID
 * @access  Public
 */
router.get('/:id', getTodoById)

/**
 * @route   POST /api/todos
 * @desc    Create a new todo
 * @access  Public
 */
router.post('/', createTodo)

/**
 * @route   PUT /api/todos/:id
 * @desc    Update a todo
 * @access  Public
 */
router.put('/:id', updateTodo)

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete a todo
 * @access  Public
 */
router.delete('/:id', deleteTodo)

export default router
