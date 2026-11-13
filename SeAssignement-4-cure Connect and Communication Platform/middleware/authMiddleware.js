const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = null;

  // Check Authorization header ("Bearer <token>")
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.headers['cookie']) {
    // Fallback check for token in Cookie header
    const tokenCookie = req.headers['cookie']
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, username, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-Based Access Control (RBAC) middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };