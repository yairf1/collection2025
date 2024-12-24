const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.SECERET_KEY; 

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).redirect('/error');
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).redirect('/error');
    }
    req.user = user; 
    next();
  });
}

module.exports = authenticateToken;
