// app.js
const express = require('express');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todos');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the To-Do List API');
});


module.exports = app; // ✅ exporting the express app directly
