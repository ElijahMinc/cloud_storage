const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = decodedToken._id;

    next();
  } catch (err) {
    return res.status(400).json({
      message: 'Auth error',
    });
  }
};
