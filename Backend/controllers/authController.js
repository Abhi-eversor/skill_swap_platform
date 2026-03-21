const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    location,
    skillsOffered,
    skillsWanted,
    availability,
    bio,
    isPublic,
  } = req.body;

  try {
    // 1. Check if email is already registered
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save user
    user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      
      isPublic,
      bio
    });

    await user.save();

    // 4. Return token and user basic data
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // 2. Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // 3. Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
  
      // 4. Return user data and token
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
