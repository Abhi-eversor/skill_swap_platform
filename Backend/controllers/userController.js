const User = require('../models/user.model');
const { safeProfile } = require('../utils/profiles');
const { HttpError } = require('../utils/errors');
const { checkFields, profileFields, profileInput, text, validId } = require('../utils/validation');

exports.getMe = (req, res) => res.json({ user: safeProfile(req.user, true) });

exports.updateMe = async (req, res) => {
  checkFields(req.body, profileFields);
  const changes = profileInput(req.body);
  if (!Object.keys(changes).length) throw new HttpError(400, 'No profile changes provided');
  const user = await User.findByIdAndUpdate(req.user._id, { $set: changes }, {
    new: true, runValidators: true,
  });
  if (!user) throw new HttpError(404, 'Profile not found');
  res.json({ user: safeProfile(user, true) });
};

exports.listUsers = async (req, res) => {
  const filter = { isPublic: true };
  if (req.query.q !== undefined) {
    const query = text(req.query.q, 'search query', { max: 100 });
    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = ['name', 'location', 'skillsOffered', 'skillsWanted']
        .map((field) => ({ [field]: { $regex: escaped, $options: 'i' } }));
    }
  }
  if (req.query.availability !== undefined) {
    const availability = text(req.query.availability, 'availability', { max: 60 });
    if (availability) {
      filter.availability = {
        $regex: `^${availability.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i',
      };
    }
  }
  const users = await User.find(filter).sort({ name: 1, _id: 1 }).limit(100);
  res.json({ users: users.map((user) => safeProfile(user)) });
};

exports.getUser = async (req, res) => {
  if (!validId(req.params.id)) throw new HttpError(400, 'Invalid user id');
  const user = await User.findById(req.params.id);
  const isOwner = req.user && String(req.user._id) === req.params.id.toLowerCase();
  if (!user || (!user.isPublic && !isOwner)) throw new HttpError(404, 'Profile not found');
  res.json({ user: safeProfile(user, Boolean(isOwner)) });
};
