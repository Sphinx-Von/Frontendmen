require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Your Next.js frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const skillGapRouter = require('./app/api/skill-gap/route');
const roadmapRouter = require('./app/api/roadmap/route');
const hackerNewsRouter = require('./app/api/hackernews/route');

// Use routes
app.use('/api/skill-gap', skillGapRouter);
app.use('/api/roadmap', roadmapRouter);
app.use('/api/hackernews', hackerNewsRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Career Path Analyzer API is running!',
    endpoints: {
      skillGap: 'POST /api/skill-gap',
      roadmap: 'POST /api/roadmap',
      hackerNews: 'GET /api/hackernews' 
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    details: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✓ Loaded' : '✗ Missing'}`);
});