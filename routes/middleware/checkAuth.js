const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.SECERET_KEY; 

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log('no token');
    
    return res.status(401).redirect('/login');
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('invalid token');
      
      return res.status(403).redirect('/login');
    }
    console.log('valid token');
    req.user = user; 
    next();
  });
}

module.exports = authenticateToken;
