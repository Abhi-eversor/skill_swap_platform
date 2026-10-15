const express = require('express');
const cors = require('cors');
const { HttpError } = require('./utils/errors');

const app = express();
app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    const allowed = (process.env.FRONTEND_URL || '').split(',').map((url) => url.trim());
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new HttpError(403, 'This origin is not allowed'));
  },
}));
app.use(express.json({ limit: '64kb' }));
app.use((req, res, next) => {
  if (['POST', 'PATCH'].includes(req.method)
      && (!req.body || Array.isArray(req.body) || typeof req.body !== 'object')) {
    return next(new HttpError(400, 'Provide a JSON object'));
  }
  next();
});

app.get('/', (req, res) => res.json({ message: 'Skill Swap API' }));
app.use('/api/user', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
app.use((req, res, next) => next(new HttpError(404, 'Route not found')));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large' });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'This email is already registered' });
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid profile or request data' });
  }
  if (error.status) return res.status(error.status).json({ message: error.message });
  console.error(error.message);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

module.exports = app;
