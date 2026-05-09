const jwt = require('jsonwebtoken');

function generateToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = generateToken;
