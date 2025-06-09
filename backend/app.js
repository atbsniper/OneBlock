const express = require("express");
const logs = require("./Router/logs");
const cors = require('cors');

const app = express();

// Enhanced CORS configuration for Railway deployment
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'https://oneblock-production.up.railway.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// Health check for Railway
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use("/LogGard", logs);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: "error", 
    message: "Something went wrong!" 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: "error", 
    message: "Route not found" 
  });
});

module.exports = app;
