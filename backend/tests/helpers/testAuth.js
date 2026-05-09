const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateTestToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

module.exports = { generateTestToken, hashPassword };
