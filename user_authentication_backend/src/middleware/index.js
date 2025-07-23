// Export all middleware here
const { authenticateJWT } = require('./auth');

module.exports = {
  authenticateJWT,
};
