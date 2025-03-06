const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.SECERET_KEY;

// function authenticateToken(req, res, next) {
//   if (!req.cookies || !req.cookies.token) {
//     req.isAuthenticated = false;
//     req.user = null;
//     return next(); // Ensure request continues
//   }

//   const token = req.cookies.token;

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       req.isAuthenticated = false;
//       req.user = null;
//       return next();
//     }

//     req.user = user;
//     req.isAuthenticated = true;
//     next();
//   });
// }

function authenticateToken(req, res, next) {
  console.log('hi');
  
}

module.exports = authenticateToken;