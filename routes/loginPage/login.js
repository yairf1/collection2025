const { Router } = require("express");
const path = require("path");
const users = require('../../scheme/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authenticateToken = require('../middleware/checkAuth');
const router = Router();

const JWT_SECRET = process.env.SECERET_KEY;  

router.get('/', (req, res) => {
  const file = path.join(__dirname + '../../../public/loginPage/login.html');
  res.sendFile(file);
});

router.post('/checkIfExist', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await users.findOne({ name: name });
    if (user && user.password === password) {
      const token = jwt.sign({ name: name}, JWT_SECRET, { expiresIn: "1h" });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000,
      });
      console.log('login successful')
      return res.json({ message: 'login successful', user: { name: user.name} });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred, please try again.' });
  }
});

module.exports = router;
