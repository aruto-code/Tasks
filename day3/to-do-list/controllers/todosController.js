const { promClient } = require('express-boilerplate/monitoring/metrics');
const redis = require('../redisClient');
const Todo = require("../models/todo.model")
const todoCreatedCounter = new promClient.Counter({
  name: 'todos_created_total',
  help: 'Total number of todos created',
});
const todoFetchedCounter = new promClient.Counter({
  name: 'todos_fetched_total',
  help: 'Total number of todos fetched',
});

const todoUpdatedCounter = new promClient.Counter({
  name: 'todos_updated_total',
  help: 'Total number of todos updated',
});

const todoDeletedCounter = new promClient.Counter({
  name: 'todos_deleted_total',
  help: 'Total number of todos deleted',
});

const todoFetchDuration = new promClient.Histogram({
  name: 'todo_fetch_duration_seconds',
  help: 'Duration of fetching todos from DB',
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Get all todos
const getTodos = async (req, res) => {
  const endTimer = todoFetchDuration.startTimer(); // ⏱️ Start timer

  try {
    const cachedTodos = await redis.get('todos');
    if (cachedTodos) {
      todoFetchedCounter.inc(); // increment metric
      endTimer(); // ⏱️ Stop timer
      return res.status(200).json({
        source: 'cache',
        data: JSON.parse(cachedTodos)
      });
    }

    const todos = await Todo.find();
    await redis.set('todos', JSON.stringify(todos), 'EX', 60);

    todoFetchedCounter.inc();
    res.status(200).json({
      source: 'database',
      data: todos
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  } finally {
    endTimer(); // ensure timer ends even on failure
  }
};

// Get a single todo by ID
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve todo', error: err.message });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description, completed = false, dueDate } = req.body; // ← Include dueDate
    const newTodo = new Todo({
      title,
      description,
      completed,
      dueDate, // ← Add here
    });
    await newTodo.save();
    await redis.del('todos');
    todoCreatedCounter.inc(); // increment counter after saving
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create todo', error: err.message });
  }
};


const updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    await redis.del('todos');
    todoUpdatedCounter.inc(); // 🔢

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update todo', error: err.message });
  }
};


// Delete a todo
const deleteTodo = async (req, res) => {
  try {
    // Step 1: Delete the todo item from MongoDB by its ID
    const todo = await Todo.findByIdAndDelete(req.params.id);

    // Step 2: If no todo was found with that ID, return a 404 response
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Step 3: Invalidate the Redis cache so we don't return stale data on future GET requests
    await redis.del('todos'); // 🚨 Very important line
    todoDeletedCounter.inc();

    // Step 4: Send success response to client
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (err) {
    // Step 5: If anything goes wrong (e.g., DB error), send a 500 error
    res.status(500).json({ message: 'Failed to delete todo', error: err.message });
  }
};



module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};

