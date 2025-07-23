const authService = require('../services/auth');

/**
 * Auth Controller
 */
class AuthController {
  /**
   * User signup handler.
   */
  // PUBLIC_INTERFACE
  async signup(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      await authService.register(username, password);
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      if (err.message === 'User already exists') {
        return res.status(409).json({ message: 'Username already taken' });
      }
      return res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  }

  /**
   * User login handler.
   */
  // PUBLIC_INTERFACE
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      const tokens = await authService.login(username, password);
      return res.status(200).json(tokens);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  }

  /**
   * User logout handler.
   */
  // PUBLIC_INTERFACE
  async logout(req, res) {
    // Stateless JWT: On client, just delete token.
    // Optionally blacklist token until expiration (demonstrated here).
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      authService.blacklistToken(token);
    }
    res.status(200).json({ message: 'Logged out successfully' });
  }

  /**
   * Token refresh handler.
   */
  // PUBLIC_INTERFACE
  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }
    try {
      const payload = authService.verifyRefreshToken(refreshToken);
      const username = payload.username;
      // Issue a new access token (do NOT re-issue refresh token for safety).
      const newAccessToken = authService.createAccessToken({ username });
      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }
}

module.exports = new AuthController();
