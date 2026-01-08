# API Request/Response Examples

This document provides detailed examples of API requests and responses for the To-Do List backend API.

## Base URL
```
http://localhost:5000/api
```

## 1. Get All Todos

### Request
```http
GET /api/todos HTTP/1.1
Host: localhost:5000
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Review code changes",
      "completed": true,
      "createdAt": "2024-01-14T09:15:00.000Z",
      "updatedAt": "2024-01-14T15:20:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Prepare presentation",
      "completed": false,
      "createdAt": "2024-01-13T14:45:00.000Z",
      "updatedAt": "2024-01-13T14:45:00.000Z"
    }
  ]
}
```

### Filter by Completion Status
```http
GET /api/todos?completed=false HTTP/1.1
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Prepare presentation",
      "completed": false,
      "createdAt": "2024-01-13T14:45:00.000Z"
    }
  ]
}
```

---

## 2. Get Single Todo by ID

### Request
```http
GET /api/todos/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:5000
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response (Not Found - 404)
```json
{
  "success": false,
  "message": "Todo not found"
}
```

### Response (Invalid ID - 400)
```json
{
  "success": false,
  "message": "Invalid todo ID format"
}
```

---

## 3. Create New Todo

### Request
```http
POST /api/todos HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Learn MongoDB",
  "completed": false
}
```

### Response (Success - 201 Created)
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "title": "Learn MongoDB",
    "completed": false,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### Request (Minimal - only title)
```http
POST /api/todos HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "New task"
}
```

**Response:** Same as above (completed defaults to false)

### Response (Validation Error - 400)
```json
{
  "success": false,
  "message": "Task title is required"
}
```

---

## 4. Update Todo

### Request (Update title only)
```http
PUT /api/todos/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Updated task title"
}
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated task title",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:15:00.000Z"
  }
}
```

### Request (Update completed status only)
```http
PUT /api/todos/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
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
    "title": "Complete project documentation",
    "completed": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:20:00.000Z"
  }
}
```

### Request (Update both fields)
```http
PUT /api/todos/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "title": "Finish project documentation",
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
    "title": "Finish project documentation",
    "completed": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:25:00.000Z"
  }
}
```

### Response (No fields provided - 400)
```json
{
  "success": false,
  "message": "No fields provided to update"
}
```

### Response (Empty title - 400)
```json
{
  "success": false,
  "message": "Task title cannot be empty"
}
```

---

## 5. Delete Todo

### Request
```http
DELETE /api/todos/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:5000
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": {}
}
```

### Response (Not Found - 404)
```json
{
  "success": false,
  "message": "Todo not found"
}
```

---

## 6. Health Check

### Request
```http
GET /api/health HTTP/1.1
Host: localhost:5000
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T11:30:00.000Z"
}
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

### Common HTTP Status Codes

- **200 OK**: Successful GET, PUT, DELETE request
- **201 Created**: Successful POST request
- **400 Bad Request**: Validation error or invalid input
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## cURL Examples

### Get all todos
```bash
curl http://localhost:5000/api/todos
```

### Get single todo
```bash
curl http://localhost:5000/api/todos/507f1f77bcf86cd799439011
```

### Create todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "New task", "completed": false}'
```

### Update todo
```bash
curl -X PUT http://localhost:5000/api/todos/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete todo
```bash
curl -X DELETE http://localhost:5000/api/todos/507f1f77bcf86cd799439011
```

---

## JavaScript/Fetch Examples

### Fetch all todos
```javascript
const response = await fetch('http://localhost:5000/api/todos')
const data = await response.json()
console.log(data.data) // Array of todos
```

### Create todo
```javascript
const response = await fetch('http://localhost:5000/api/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New task',
    completed: false
  })
})
const data = await response.json()
console.log(data.data) // Created todo
```

### Update todo
```javascript
const response = await fetch('http://localhost:5000/api/todos/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Updated title',
    completed: true
  })
})
const data = await response.json()
console.log(data.data) // Updated todo
```

### Delete todo
```javascript
const response = await fetch('http://localhost:5000/api/todos/507f1f77bcf86cd799439011', {
  method: 'DELETE'
})
const data = await response.json()
console.log(data.message) // "Todo deleted successfully"
```

---

## Testing with Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: Create an environment variable `base_url` = `http://localhost:5000/api`
3. **Add Requests**:
   - GET `{{base_url}}/todos`
   - GET `{{base_url}}/todos/:id`
   - POST `{{base_url}}/todos` (with JSON body)
   - PUT `{{base_url}}/todos/:id` (with JSON body)
   - DELETE `{{base_url}}/todos/:id`

4. **Test**: Run requests and verify responses match the examples above
