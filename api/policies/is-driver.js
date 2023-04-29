const jwt = require('jsonwebtoken');

/**
 * is-super-admin
 *
 * A simple policy that blocks requests from non-super-admins.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {

  // First, check whether the request comes from a logged-in user.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).

  const decoded = jwt.verify(req.headers['token'], sails.config.custom.jwtKey);

  if (decoded.type !== 'DRIVER') {
    return res.unauthorized({ code: 'FORBIDDEN', message: 'Need a driver login' });
  }

  // IWMIH, we've got ourselves a "DRIVER".
  return proceed();

};
