// middlewares/blockIfAuthenticated.js
const jwt = require('jsonwebtoken');

const blockIfAuthenticated = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return next(); // User is not logged in → allow
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.id) {
      return res.status(403).json({ msg: 'Already logged in. Cannot register again.' });
    }
    next();
  } catch (err) {
    // Token might be invalid/expired → still allow registration
    next();
  }
};

module.exports = blockIfAuthenticated;
