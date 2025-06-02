const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { todoSchema } = require('../validators/todoValidator');
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} = require('../controllers/todosController');

// Routes
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.post('/', validate(todoSchema), createTodo);
router.put('/:id', validate(todoSchema), updateTodo); 
router.delete('/:id', deleteTodo);

module.exports = router;