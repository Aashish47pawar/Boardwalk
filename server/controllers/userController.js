import User from '../models/User.js';

// GET /api/users — populates the "Assign to" dropdown on the client.
// Returns only safe, non-sensitive fields.
export async function getUsers(req, res) {
  try {
    const users = await User.find().select('name email').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users.', error: err.message });
  }
}
