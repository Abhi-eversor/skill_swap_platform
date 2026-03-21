const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  profilePhoto: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillsOffered: [String],
  skillsWanted: [String],
  availability: [String], // e.g. ["Weekends", "Evenings"]
  isPublic: { type: Boolean ,  default : true},
  bio : {type : String}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);