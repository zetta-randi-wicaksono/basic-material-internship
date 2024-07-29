const authMiddleware = (resolve, root, args, context, info) => {
  if (!context.req.headers.authorization) {
    throw new Error('Unauthorized access');
  }

  if (context.req.headers.authorization !== 'valid-token') {
    throw new Error('Invalid token');
  }

  return resolve(root, args, context, info);
};

module.exports = { authMiddleware };
