let jwt = require('jsonwebtoken');

let tokenValidation = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, "secretkeyasdwa88saa", (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token broken'
    });
  }
};

module.exports = {
  validation: tokenValidation
};