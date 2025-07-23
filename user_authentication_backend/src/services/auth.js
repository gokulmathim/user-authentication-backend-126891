const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const tokenBlacklist = new Set(); // For demonstration; use Redis or DB in production

class AuthService {
  /**
   * Register a new user (calls UserModel).
   * @param {string} username
   * @param {string} password
   * @returns {object}
   */
  // PUBLIC_INTERFACE
  async register(username, password) {
    return await userModel.createUser(username, password);
  }

  /**
   * Validate user credentials and return JWT if successful.
   * @param {string} username
   * @param {string} password
   * @returns {object} { accessToken, refreshToken }
   */
  // PUBLIC_INTERFACE
  async login(username, password) {
    const user = await userModel.findByUsername(username);
    if (!user) throw new Error('Invalid username or password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid username or password');
    // Return JWTs
    return {
      accessToken: this.createAccessToken({ username }),
      refreshToken: this.createRefreshToken({ username }),
    };
  }

  /**
   * Generates an access token.
   * @param {object} payload
   * @returns {string}
   */
  // PUBLIC_INTERFACE
  createAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Generates a refresh token.
   * @param {object} payload
   * @returns {string}
   */
  // PUBLIC_INTERFACE
  createRefreshToken(payload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  }

  /**
   * Verifies a JWT (access token).
   * @param {string} token
   * @returns {object}
   */
  // PUBLIC_INTERFACE
  verifyAccessToken(token) {
    if (tokenBlacklist.has(token)) throw new Error('Token is blacklisted');
    return jwt.verify(token, JWT_SECRET);
  }

  /**
   * Verifies a JWT (refresh token).
   * @param {string} token
   * @returns {object}
   */
  // PUBLIC_INTERFACE
  verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }

  /**
   * Blacklists a JWT (for logout).
   * @param {string} token
   */
  // PUBLIC_INTERFACE
  blacklistToken(token) {
    tokenBlacklist.add(token);
  }

  /**
   * Checks if a token is blacklisted.
   * @param {string} token
   * @returns {boolean}
   */
  // PUBLIC_INTERFACE
  isTokenBlacklisted(token) {
    return tokenBlacklist.has(token);
  }
}

module.exports = new AuthService();
