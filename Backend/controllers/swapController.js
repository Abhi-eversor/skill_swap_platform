const User = require('../models/user.model');
const Swap = require('../models/swap.model');
const { HttpError } = require('../utils/errors');
const { publicFields, safeSwap } = require('../utils/profiles');
const { checkFields, text, validId } = require('../utils/validation');

const participants = { path: 'requester responder', select: publicFields };

function belongsTo(swap, id) {
  return [swap.requester, swap.responder]
    .some((user) => user && String(user._id || user) === String(id));
}

function findSkill(skills, value, field) {
  const skill = text(value, field, { max: 60, required: true });
  const match = (skills || []).find((item) => item.toLowerCase() === skill.toLowerCase());
  if (!match) throw new HttpError(400, `${field} must match the profile's offered skills`);
  return match;
}

exports.listSwaps = async (req, res) => {
  const swaps = await Swap.find({
    $or: [{ requester: req.user._id }, { responder: req.user._id }],
  }).populate(participants).sort({ createdAt: -1, _id: -1 });
  res.json({ swaps: swaps.map(safeSwap) });
};

exports.getSwap = async (req, res) => {
  if (!validId(req.params.id)) throw new HttpError(400, 'Invalid swap id');
  const swap = await Swap.findById(req.params.id).populate(participants);
  if (!swap || !belongsTo(swap, req.user._id)) throw new HttpError(404, 'Swap not found');
  res.json({ swap: safeSwap(swap) });
};

exports.createSwap = async (req, res) => {
  checkFields(req.body, ['responder', 'skillOffered', 'skillRequested', 'message']);
  if (!validId(req.body.responder)) throw new HttpError(400, 'Invalid recipient');
  if (String(req.user._id) === req.body.responder.toLowerCase()) {
    throw new HttpError(400, 'You cannot request a swap with yourself');
  }
  const responder = await User.findById(req.body.responder);
  if (!responder || !responder.isPublic) throw new HttpError(404, 'Profile not found');
  const skillOffered = findSkill(req.user.skillsOffered, req.body.skillOffered, 'Offered skill');
  const skillRequested = findSkill(responder.skillsOffered, req.body.skillRequested, 'Requested skill');
  const message = req.body.message === undefined ? ''
    : text(req.body.message, 'message', { max: 1000 });
  const swap = await Swap.create({
    requester: req.user._id, responder: responder._id, skillOffered, skillRequested, message,
  });
  await swap.populate(participants);
  res.status(201).json({ swap: safeSwap(swap) });
};

exports.updateSwap = async (req, res) => {
  if (!validId(req.params.id)) throw new HttpError(400, 'Invalid swap id');
  checkFields(req.body, ['status']);
  const { status } = req.body;
  if (!['accepted', 'rejected', 'cancelled'].includes(status)) {
    throw new HttpError(400, 'Choose accepted, rejected or cancelled');
  }
  const current = await Swap.findById(req.params.id);
  if (!current || !belongsTo(current, req.user._id)) throw new HttpError(404, 'Swap not found');
  const actor = status === 'cancelled' ? 'requester' : 'responder';
  if (String(current[actor]) !== String(req.user._id)) {
    throw new HttpError(403, status === 'cancelled'
      ? 'Only the requester can cancel this swap'
      : 'Only the recipient can accept or reject this swap');
  }
  const swap = await Swap.findOneAndUpdate({
    _id: req.params.id, status: 'pending', [actor]: req.user._id,
  }, { $set: { status } }, { new: true, runValidators: true }).populate(participants);
  if (!swap) throw new HttpError(409, 'This swap is no longer pending');
  res.json({ swap: safeSwap(swap) });
};
