import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// POST /api/auth/register
export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are all required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    // Password hashing happens automatically in the User model's pre('save') hook (bcrypt).
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Could not register user.', error: err.message });
  }
}

// POST /api/auth/login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // .select('+password') because the schema hides password by default.
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Could not log in.', error: err.message });
  }
}

// GET /api/auth/me  (protected) — lets the client re-hydrate the session on page reload.
export async function getMe(req, res) {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
}
