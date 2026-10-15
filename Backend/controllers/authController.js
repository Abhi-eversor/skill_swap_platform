const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { safeProfile } = require('../utils/profiles');
const { HttpError } = require('../utils/errors');
const { credentials, checkFields, profileInput, profileFields } = require('../utils/validation');

function emailLookup(email) {
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { email: { $regex: `^${escaped}$`, $options: 'i' } };
}

function session(user) {
  return {
    token: jwt.sign({ id: String(user._id) }, process.env.JWT_SECRET, {
      algorithm: 'HS256', expiresIn: '1d',
    }),
    user: safeProfile(user, true),
  };
}

exports.register = async (req, res) => {
  checkFields(req.body, [...profileFields, 'email', 'password']);
  const { email, password } = credentials(req.body, true);
  const profile = profileInput(req.body);
  if (!profile.name) throw new HttpError(400, 'Name is required');
  if (await User.findOne(emailLookup(email))) {
    throw new HttpError(409, 'This email is already registered');
  }
  const user = await User.create({
    ...profile, email, password: await bcrypt.hash(password, 10),
  });
  res.status(201).json(session(user));
};

exports.login = async (req, res) => {
  checkFields(req.body, ['email', 'password']);
  const { email, password } = credentials(req.body);
  const user = await User.findOne(emailLookup(email)).select('+password');
  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new HttpError(401, 'Invalid email or password');
  }
  res.json(session(user));
};
