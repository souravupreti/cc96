const errorHandler = (err, req, res, _next) => {
  console.error('[ERROR]', err.message || err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(400).json({ success: false, error: `${field} already exists` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  res.status(500).json({ success: false, error: 'Internal server error' });
};

module.exports = errorHandler;
