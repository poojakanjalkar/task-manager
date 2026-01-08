# To-Do List Backend API

A RESTful API backend for the To-Do List application built with Node.js, Express.js, and MongoDB.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, and Delete todos
- 🔒 **Data Validation**: Input validation and error handling
- 🌐 **CORS Enabled**: Configured for frontend integration
- 📊 **MongoDB Integration**: Persistent data storage with Mongoose
- 🏗️ **MVC Architecture**: Clean separation of concerns
- 📝 **Well Documented**: Comprehensive code comments

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

## Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection configuration
├── controllers/
│   └── todoController.js # Business logic for todo operations
├── models/
│   └── Todo.js          # Mongoose schema and model
├── routes/
│   └── todoRoutes.js    # API route definitions
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables template
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Setup Steps

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your configuration:

   ```env
   MONGODB_URI=mongodb://localhost:27017/todo-app
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
   ```

3. **Start MongoDB**

   **Local MongoDB:**
   ```bash
   # macOS (using Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

   **Or use MongoDB Atlas** (cloud-hosted, no local installation needed)

4. **Run the Server**

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000` (or your configured PORT)

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All Todos
```http
GET /api/todos
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete project",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Query Parameters (optional):**
- `completed`: Filter by completion status (`true` or `false`)
  - Example: `GET /api/todos?completed=false`

#### 2. Get Single Todo
```http
GET /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Complete project",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "New task",
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "New task",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 4. Update Todo
```http
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Updated task",
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated task",
    "completed": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** You can update `title` and/or `completed` fields independently.

#### 5. Delete Todo
```http
DELETE /api/todos/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {}
}
```

#### 6. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Example API Requests

### Using cURL

**Get all todos:**
```bash
curl http://localhost:5000/api/todos
```

**Create a todo:**
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js", "completed": false}'
```

**Update a todo:**
```bash
curl -X PUT http://localhost:5000/api/todos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a todo:**
```bash
curl -X DELETE http://localhost:5000/api/todos/507f1f77bcf86cd799439011
```

### Using JavaScript (Fetch API)

```javascript
// Fetch all todos
const response = await fetch('http://localhost:5000/api/todos')
const data = await response.json()

// Create a todo
const newTodo = await fetch('http://localhost:5000/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New task', completed: false })
})

// Update a todo
const updated = await fetch('http://localhost:5000/api/todos/ID', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed: true })
})

// Delete a todo
await fetch('http://localhost:5000/api/todos/ID', {
  method: 'DELETE'
})
```

## Frontend Integration

The backend is configured to work with the React frontend. Make sure:

1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:5173` (or update CORS_ORIGIN in `.env`)
3. Frontend API service is configured to use the correct backend URL

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/todo-app` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

## Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running:**
   ```bash
   # macOS/Linux
   mongosh
   
   # Or check service status
   brew services list  # macOS
   sudo systemctl status mongod  # Linux
   ```

2. **Verify connection string:**
   - Local: `mongodb://localhost:27017/todo-app`
   - Atlas: Check your cluster connection string

3. **Check firewall/network settings** if using MongoDB Atlas

### Port Already in Use

If port 5000 is already in use:
```bash
# Change PORT in .env file
PORT=3000
```

### CORS Errors

If you see CORS errors in the browser:
1. Check `CORS_ORIGIN` in `.env` matches your frontend URL
2. Restart the server after changing `.env`

## Development

### Scripts

- `npm start` - Start server in production mode
- `npm run dev` - Start server in development mode with auto-reload

### Code Structure

- **Models**: Define data structure and validation
- **Controllers**: Handle business logic and database operations
- **Routes**: Define API endpoints and map to controllers
- **Config**: Database and server configuration

## License

This project is open source and available for personal and commercial use.
