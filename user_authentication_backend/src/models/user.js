const bcrypt = require('bcrypt');

// In-memory user store for demonstration purposes.
// In production, use a database.
const users = new Map();

class UserModel {
  /**
   * Create a new user with hashed password.
   * @param {string} username
   * @param {string} password
   * @returns {object} The created user (without password)
   */
  // PUBLIC_INTERFACE
  async createUser(username, password) {
    if (users.has(username)) {
      throw new Error('User already exists');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = { username, password: hash };
    users.set(username, user);
    return { username };
  }

  /**
   * Find user by username.
   * @param {string} username
   * @returns {object|null}
   */
  // PUBLIC_INTERFACE
  async findByUsername(username) {
    return users.get(username) || null;
  }
}

module.exports = new UserModel();
