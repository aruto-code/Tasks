require('./config/config');

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes/todos'); //  This must come BEFORE createApp
const { logger, createApp } = require('express-boilerplate');

// Log early startup
logger.info('🔧 Starting Express To-Do App');

const corsOption = { origin: true, credentials: true };

// Optional: monitor memory usage at startup
logger.warn('🔍 Memory usage at startup', { usage: process.memoryUsage() });

// Optional middlewares (can push logger.httpLogger() here if desired)
const middlewares = [];

// Create app using express-boilerplate
const app = createApp({
  routes,
  corsOption,
  routePrefix: '/',
  middlewares,
});

// Log middleware registration
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  logger.info(' GET / - Sending welcome message');
  res.send('Welcome to the To-Do List API');
});

// Central error handler
app.use((err, req, res, next) => {
  logger.error(' Unexpected error occurred', {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  res.json({
    timestamp: Date.now(),
    hostname: os.hostname(),
    serviceId: config.serviceId,
  });
});
// App setup complete
logger.info(' Express application setup complete');

module.exports = app;
