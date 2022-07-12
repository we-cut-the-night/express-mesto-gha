const jwt = require('jsonwebtoken');
const AuthError = require('../errors/401-auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  // req.user = {
  //   _id: '62cdad8fe7c2882cf318cc4a', // Test user 2
  // };

  req.user = payload;
  next();
};
