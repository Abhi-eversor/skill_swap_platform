const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { HttpError } = require('../utils/errors');
const { validId } = require('../utils/validation');

async function identify(req, optional = false) {
  const header = req.get('Authorization');
  if (!header && optional) return;
  const match = /^Bearer\s+(\S+)$/i.exec(header || '');
  if (!match) throw new HttpError(401, 'Sign in to continue');
  let payload;
  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    throw new HttpError(401, 'Your session has expired. Please sign in again.');
  }
  if (!validId(payload.id)) throw new HttpError(401, 'Invalid session');
  const user = await User.findById(payload.id);
  if (!user) throw new HttpError(401, 'This account is no longer available');
  req.user = user;
}

exports.requireAuth = async (req, res, next) => {
  await identify(req);
  next();
};

exports.optionalAuth = async (req, res, next) => {
  await identify(req, true);
  next();
};
