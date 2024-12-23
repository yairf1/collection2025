const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jnojbnojbj64erqogh349ughbn[v9o3q4'; // Replace with your actual secret key

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user; 
    console.log('user logged');
    next();
  });
}

module.exports = authenticateToken;
