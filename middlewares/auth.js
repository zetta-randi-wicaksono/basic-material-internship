const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/user');

const authMiddleware = async (resolver, parent, args, context, info) => {
  const { fieldName } = info;
  const excludedOperations = ['signup', 'signin', 'token', 'user', 'id', 'username'];

  if (excludedOperations.includes(fieldName)) {
    return resolver();
  }
  const Authorization = context.req.get('Authorization');
  if (!Authorization) {
    throw new AuthenticationError('Authorization Header is Missing');
  }
  const token = Authorization.replace('Bearer ', '');
  const { userID } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(userID);
  if (!user) {
    throw new AuthenticationError('UnAuthenticated');
  }
  context.userId = user._id;
  return resolver();
};

module.exports = authMiddleware;
