const { createRouter, wrapAsync } = require('express-boilerplate');
const router = createRouter();

const validate = require('../middlewares/validate');
const { todoSchema } = require('../validators/todoValidator');
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} = require('../controllers/todosController');

/**
 * Routes for To-Do API
 * 
 * - wrapAsync is used to automatically catch and forward async errors
 * - validate middleware is used to validate request bodies against the todoSchema
 */

// GET /todos - Get all todos (async error handled)
router.get('/', wrapAsync(getTodos));

// GET /todos/:id - Get todo by ID (async error handled)
router.get('/:id', wrapAsync(getTodoById));

// POST /todos - Create a new todo (validate request body, async error handled)
router.post('/', validate(todoSchema), wrapAsync(createTodo));

// PUT /todos/:id - Update existing todo (validate request body, async error handled)
router.put('/:id', validate(todoSchema), wrapAsync(updateTodo));

// DELETE /todos/:id - Delete todo by ID (async error handled)
router.delete('/:id', wrapAsync(deleteTodo));

module.exports = router;
