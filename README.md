# To-Do List Full-Stack Application

A modern, full-stack To-Do List application with a React frontend and Node.js/Express/MongoDB backend. This app allows users to manage their tasks efficiently with a clean and intuitive interface, backed by a robust RESTful API.

## Features

### Frontend
- ✅ **Add Tasks**: Create new tasks with a simple input field
- ✏️ **Edit Tasks**: Click on any task to edit its content
- 🗑️ **Delete Tasks**: Remove tasks you no longer need
- ☑️ **Mark Complete**: Toggle task completion status
- 📊 **Statistics**: View total, completed, and pending task counts
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient backgrounds, smooth animations, and hover effects
- 🔄 **Real-time Updates**: Instant synchronization with backend API

### Backend
- 🚀 **RESTful API**: Complete CRUD operations for todos
- 🗄️ **MongoDB Integration**: Persistent data storage with Mongoose
- 🔒 **Data Validation**: Input validation and error handling
- 🌐 **CORS Enabled**: Configured for frontend integration
- 🏗️ **MVC Architecture**: Clean separation of concerns

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **Tailwind CSS 3**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-Origin Resource Sharing

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

#### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` and configure your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/todo-app
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

5. Start MongoDB (if using local installation):
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

#### 2. Frontend Setup

1. Navigate to the project root (or open a new terminal):
```bash
cd ..  # if you're in the backend directory
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

**Note:** Make sure both backend and frontend servers are running simultaneously.

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## Usage

1. **Adding a Task**: Type your task in the input field and click "Add Task" or press Enter
2. **Completing a Task**: Click the checkbox next to a task to mark it as completed
3. **Editing a Task**: Click on the task text (or the edit icon on hover) to edit it
4. **Deleting a Task**: Click the delete icon (trash can) that appears when you hover over a task
5. **Saving Edits**: Click the checkmark or press Enter to save your edits
6. **Canceling Edits**: Click the X button or press Escape to cancel editing

## API Documentation

The backend provides a RESTful API with the following endpoints:

- `GET /api/todos` - Fetch all todos
- `GET /api/todos/:id` - Fetch a single todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/health` - Health check endpoint

For detailed API documentation, request/response formats, and examples, see [backend/README.md](./backend/README.md).

## Project Structure

```
Learn_AI/
├── backend/                    # Backend API
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   └── todoController.js  # Business logic
│   ├── models/
│   │   └── Todo.js            # Mongoose schema
│   ├── routes/
│   │   └── todoRoutes.js     # API routes
│   ├── server.js             # Express server
│   ├── package.json          # Backend dependencies
│   └── .env.example          # Environment template
├── src/                       # Frontend React app
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── App.jsx               # Main component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                 # HTML template
├── package.json              # Frontend dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Customization

You can customize the color scheme by modifying the `tailwind.config.js` file. The app uses a primary color palette that can be adjusted to match your preferences.

## Browser Support

This application works on all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Local Storage API

## License

This project is open source and available for personal and commercial use.
