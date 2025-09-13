# Lead Management Server

Backend API for the Lead Management System built with Express.js and MongoDB.

## Features

- RESTful API endpoints for lead management
- MongoDB integration with Mongoose
- Input validation using express-validator
- Error handling and proper HTTP status codes
- CORS enabled for frontend integration

## API Endpoints

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Server status
- `GET /api/health` - Server health check

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead-management
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections when you start the server.

## Lead Schema

```javascript
{
  name: String (required, min: 2 characters),
  email: String (required, unique, valid email),
  phone: String (required, valid phone number),
  createdAt: Date,
  updatedAt: Date
}
```
