import jwt from 'jsonwebtoken';

// Signs a token that just carries the user's id. Kept deliberately minimal —
// the rest of the user's data is fetched fresh from the DB on each request
// via the auth middleware, so a stale token never serves stale profile data.
export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}
