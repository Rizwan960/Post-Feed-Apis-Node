const { validationResult } = require('express-validator');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt-secret');

// User signup
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save user to the database
    const result = await user.save();

    // Respond with success
    res.status(201).json({
      message: 'User created successfully',
      userId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// User login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('No user found with this email');
      error.statusCode = 401;
      throw error;
    }

    // Compare password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Email or password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      jwtSecret,
      { expiresIn: '1h' } // Optional: set token expiration time
    );

    // Respond with the token
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
