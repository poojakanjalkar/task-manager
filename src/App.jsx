import { useState, useEffect } from 'react'
import { Table, Button, Input, Space, Tag, Popconfirm, message, Modal } from 'antd'
import { CheckOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './services/api'

/**
 * Main To-Do List Application Component
 * 
 * Features:
 * - Add new tasks
 * - Edit existing tasks
 * - Delete tasks
 * - Mark tasks as completed/uncompleted
 * - Backend API integration with MongoDB
 * - Responsive design with modern UI
 */
function App() {
  // State to manage the list of tasks
  const [todos, setTodos] = useState([])

  // State to manage the input field for new tasks
  const [inputValue, setInputValue] = useState('')

  // State to track which task is being edited
  const [editingId, setEditingId] = useState(null)

  // State to store the edit input value
  const [editValue, setEditValue] = useState('')

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for delete animation
  const [deletingId, setDeletingId] = useState(null)

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // Fetch todos from API on component mount
  useEffect(() => {
    loadTodos()
  }, [])

  /**
   * Load todos from the backend API
   */
  const loadTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTodos()
      // Transform API response to match frontend format
      const transformedData = data.map(todo => ({
        id: todo.id || todo._id,
        text: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt || todo.createdAt
      }))
      setTodos(transformedData)
      setPagination(prev => ({
        ...prev,
        total: transformedData.length
      }))
    } catch (err) {
      setError('Failed to load tasks. Please check if the backend server is running.')
      console.error('Error loading todos:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add a new task to the list
   */
  const addTodo = async () => {
    if (inputValue.trim() !== '') {
      try {
        setError(null)
        const newTodo = await createTodo(inputValue.trim(), false)
        // Add the new todo to the list
        const newTodoItem = {
          id: newTodo.id || newTodo._id,
          text: newTodo.title,
          completed: newTodo.completed,
          createdAt: newTodo.createdAt,
          updatedAt: newTodo.updatedAt || newTodo.createdAt
        }
        setTodos([...todos, newTodoItem])
        setPagination(prev => ({
          ...prev,
          total: todos.length + 1
        }))
        setInputValue('') // Clear input field
        message.success('Task added successfully!')
      } catch (err) {
        setError('Failed to add task. Please try again.')
        console.error('Error adding todo:', err)
      }
    }
  }


  /**
   * Toggle the completion status of a task
   */
  const toggleComplete = async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      setError(null)
      const updatedTodo = await updateTodo(id, { completed: !todo.completed })
      setTodos(todos.map(t =>
        t.id === id ? {
          ...t,
          id: updatedTodo.id || updatedTodo._id,
          text: updatedTodo.title,
          completed: updatedTodo.completed,
          updatedAt: updatedTodo.updatedAt || updatedTodo.createdAt
        } : t
      ))
      message.success('Task status updated!')
    } catch (err) {
      setError('Failed to update task. Please try again.')
      console.error('Error updating todo:', err)
    }
  }

  /**
   * Start editing a task
   */
  const startEdit = (id, currentText) => {
    setEditingId(id)
    setEditValue(currentText)
  }

  /**
   * Save the edited task
   */
  const saveEdit = async (id) => {
    if (editValue.trim() !== '') {
      try {
        setError(null)
        const updatedTodo = await updateTodo(id, { title: editValue.trim() })
        setTodos(todos.map(todo =>
          todo.id === id ? {
            ...todo,
            id: updatedTodo.id || updatedTodo._id,
            text: updatedTodo.title,
            completed: updatedTodo.completed,
            updatedAt: updatedTodo.updatedAt || updatedTodo.createdAt
          } : todo
        ))
        setEditingId(null)
        setEditValue('')
        message.success('Task updated successfully!')
      } catch (err) {
        setError('Failed to update task. Please try again.')
        console.error('Error updating todo:', err)
      }
    }
  }

  /**
   * Cancel editing
   */
  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }


  /**
   * Delete a task from the list with animation
   */
  const handleDeleteTodo = async (id) => {
    try {
      setError(null)
      setDeletingId(id) // Start animation
      
      // Wait a bit for animation
      await new Promise(resolve => setTimeout(resolve, 300))
      
      await deleteTodo(id)
      
      // Remove from list with animation
      setTodos(todos.filter(todo => todo.id !== id))
      setPagination(prev => ({
        ...prev,
        total: todos.length - 1
      }))
      
      setDeletingId(null) // End animation
      message.success({
        content: 'Task deleted successfully!',
        duration: 2,
        style: {
          marginTop: '20vh',
        },
      })
    } catch (err) {
      setDeletingId(null) // End animation on error
      setError('Failed to delete task. Please try again.')
      message.error('Failed to delete task. Please try again.')
      console.error('Error deleting todo:', err)
    }
  }

  /**
   * Show delete confirmation modal
   */
  const showDeleteConfirm = (id, taskText) => {
    Modal.confirm({
      title: 'Delete Task',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Are you sure you want to delete this task?</p>
          <p style={{ 
            marginTop: '8px', 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            fontStyle: 'italic',
            color: '#666'
          }}>
            "{taskText}"
          </p>
          <p style={{ marginTop: '8px', color: '#ff4d4f', fontSize: '12px' }}>
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk() {
        handleDeleteTodo(id)
      },
      onCancel() {
        // User cancelled
      },
    })
  }

  // Calculate statistics
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const pendingTodos = totalTodos - completedTodos

  /**
   * Format timestamp to readable date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Handle pagination change
   */
  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      ...newPagination,
    })
  }

  // Table columns definition
  const columns = [
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      width: 100,
      render: (completed) => (
        <Tag color={completed ? 'success' : 'processing'}>
          {completed ? 'Completed' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Task',
      dataIndex: 'text',
      key: 'text',
      render: (text, record) => {
        if (editingId === record.id) {
          return (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onPressEnter={() => saveEdit(record.id)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  cancelEdit()
                }
              }}
              autoFocus
              onFocus={(e) => {
                // Select all text when input is focused for easy editing
                e.target.select()
              }}
              suffix={
                <Space>
                  <Button
                    type="text"
                    icon={<SaveOutlined />}
                    onClick={() => saveEdit(record.id)}
                    size="small"
                    title="Save (Enter)"
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={cancelEdit}
                    size="small"
                    title="Cancel (Esc)"
                  />
                </Space>
              }
            />
          )
        }
        return (
          <span
            style={{
              textDecoration: record.completed ? 'line-through' : 'none',
              color: record.completed ? '#999' : '#000',
              cursor: record.completed ? 'default' : 'pointer'
            }}
            onClick={() => !record.completed && startEdit(record.id, record.text)}
          >
            {text}
          </span>
        )
      },
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>Created At</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date) => formatDate(date),
    },
    {
      title: <span style={{ whiteSpace: 'nowrap' }}>Updated At</span>,
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      render: (date) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small" wrap={false}>
          <Button
            type="primary"
            icon={record.completed ? <CloseOutlined /> : <CheckOutlined />}
            onClick={() => toggleComplete(record.id)}
            size="small"
            ghost
            title={record.completed ? 'Mark as Pending' : 'Mark as Complete'}
          />
          {!record.completed && editingId !== record.id && (
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => startEdit(record.id, record.text)}
              size="small"
              title="Edit Task"
            />
          )}
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            title="Delete Task"
            onClick={() => showDeleteConfirm(record.id, record.text)}
            className={deletingId === record.id ? 'deleting-animation' : ''}
            loading={deletingId === record.id}
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="logo-animated">
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-600"
              >
                {/* Checkmark Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="url(#gradient1)"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary-500"
                />
                {/* Checkmark */}
                <path
                  d="M30 50 L45 65 L70 35"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#7dd3fc" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          {/* Title with Water Animation */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 water-text">
            My To-Do List
          </h1>
          <p className="text-primary-600 text-sm sm:text-base">
            Stay organized and get things done
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Statistics Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-primary-50 rounded-lg">
              <p className="text-2xl font-bold text-primary-700">{totalTodos}</p>
              <p className="text-xs text-primary-600 mt-1">Total Tasks</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{completedTodos}</p>
              <p className="text-xs text-green-600 mt-1">Completed</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-700">{pendingTodos}</p>
              <p className="text-xs text-orange-600 mt-1">Pending</p>
            </div>
          </div>
        </div>

        {/* Add Task Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="large"
              placeholder="Add a new task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={addTodo}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              size="large"
              onClick={addTodo}
              icon={<CheckOutlined />}
            >
              Add Task
            </Button>
          </Space.Compact>
        </div>

        {/* Todo Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <Table
            columns={columns}
            dataSource={todos}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1000 }}
            rowClassName={(record) => deletingId === record.id ? 'deleting-row' : ''}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} tasks`,
              pageSizeOptions: ['5', '10', '20', '50'],
            }}
            onChange={handleTableChange}
            locale={{
              emptyText: (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 text-lg">No tasks yet. Add one to get started!</p>
                </div>
              ),
            }}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-primary-600 text-sm">
          <p>Made with ❤️ using React & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}

export default App
