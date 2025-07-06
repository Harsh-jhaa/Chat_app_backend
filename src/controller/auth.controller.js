import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const signup = async (req, res) => {
  const { fullName, password, email } = req.body;

  // Validate input
  try {
    if (!fullName) {
      res.status(400).json({ message: 'Full name is required' });
      return;
    }
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    if (!password) {
      res.status(400).json({ message: 'Password is required' });
      return;
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: 'Password  must be atleast 6 characters long' });
      return;
    }

    //    email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }
    // Check if user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create random avatar
    const idx = Math.floor(Math.random() * 1000 + 1);
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // STEP:1  Create new user
    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePicture: randomAvatar,
    });

    // create user in StreamChat

    //STEP:2   jwt token generation and saving user
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '7d',
      }
    );
    //STEP:3 setting token in cookie with secure and httpOnly flags
    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    //STEP:4  Sending response
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error(
      'Error during signup:',
      error?.response?.data?.message || error.message
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: 'Email or password is incorrect' });
      return;
    }

    // Check if password is correct
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Email or password is incorrect' });
      return;
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error(
      'Error during login:',
      error?.response?.data?.message || error.message
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};
const logout = (req, res) => {
  try {
    res.clearCookie('jwtToken');
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error(
      'Error during logout:',
      error?.response?.data?.message || error.message
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { signup, login, logout };
