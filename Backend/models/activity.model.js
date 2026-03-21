const mongoose = require('mongoose');

const adminActivitySchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., "Ban user", "Delete skill", etc.
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AdminActivity', adminActivitySchema);