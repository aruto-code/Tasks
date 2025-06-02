// tests/todo.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Todo = require('../models/todo.model');

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/todo_test'); // test DB
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Todo.deleteMany();
});

describe('Todo API', () => {
  it('should create a new todo', async () => {
    const res = await request(app).post('/api/todos').send({
      title: 'Test Todo'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Todo');
  });

  it('should return validation error for missing title', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toContain('Title is required');

  });

  it('should get all todos', async () => {
    await Todo.create({ title: 'Sample Todo' });
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
