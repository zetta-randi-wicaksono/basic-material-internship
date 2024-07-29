const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function authenticateToken(req, res, next) {
  const Authorization = req.headers['authorization'];
  if (!Authorization) {
    return res.sendStatus(401);
  }
  const token = Authorization && Authorization.split(' ')[1];

  const { userID } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(userID);
  if (!user) {
    return res.sendStatus(403);
  }
  req.user = user;
  next();
}

module.exports = authenticateToken;
