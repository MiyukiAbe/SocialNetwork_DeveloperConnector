const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

  //if the header does not have a toke, this user is not authorized to access.
  if (!token) {
    return res.status(401).json({ msg: 'No token, and authorization denied' });
  }

  try {
    //use received token and secret word to decode. Now, I can access to user inf
    const decoded = jwt.verify(token, config.get('jwtToken'));
    console.log('show me decoed token', decoded);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
