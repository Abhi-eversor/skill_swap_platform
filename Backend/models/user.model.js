const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  location: { type: String, trim: true, maxlength: 160, default: '' },
  profilePhoto: { type: String, maxlength: 2048, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  skillsOffered: { type: [String], default: [] },
  skillsWanted: { type: [String], default: [] },
  availability: { type: [String], default: [] },
  isPublic: { type: Boolean, default: true },
  bio: { type: String, maxlength: 2000, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
