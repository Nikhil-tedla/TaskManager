# Task Manager Application

This is a full-stack Task Manager Application built using React for the frontend, Node.js (Express) for the backend, and MongoDB Atlas as the database. The application supports two user roles: Admin and Member. It enables users to create, manage, and share tasks, with features like inline editing, sorting, pagination, and dashboards.

## Features

- User authentication and role-based authorization
- Two user roles: Admin and Member
- Create, update (inline editing), view, and delete tasks
- Assign tasks to users only y admin
- Set task priority, due dates, and status
- Share tasks with other users
- Member-specific dashboard showing personal and shared tasks
- Admin dashboard showing stats for all users and tasks
- Responsive frontend built with React
- Filter tasks based on due date and search or tasks using name or description or status or priority of tasks

## Tech Stack

Frontend:
- React
- Axios
- React Router
- Tailwind CSS 

Backend:
- Node.js
- Express
- JWT for authentication
- Bcrypt for password hashing
- Mongoose for MongoDB integration

Database:
- MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas cluster created
- .env file configured in the backend with the following variables:
  MONGO_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret_key
  PORT-5000
  ADMIN_INVITE_TOKEN=1234
## running project
# Backend Setup
cd backend
npm install
npm start
The backend will run on http://localhost:5000
# frontend Setup

cd frontend
npm install
npm start
The backend will run on http://localhost:5173

## refer for UI screenshots if necessary from screenshots directory





