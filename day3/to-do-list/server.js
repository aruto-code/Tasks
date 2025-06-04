// server.js
require('dotenv').config();
require('express-boilerplate/monitoring/tracing');
const mongoose = require('mongoose');
const app = require('./app');
 // 💡 traces HTTP, MongoDB, Redis, etc.

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/todolist';

mongoose
  .connect(MONGO_URI) // ✅ no deprecated options
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
