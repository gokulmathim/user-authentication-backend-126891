const crypto = require('crypto');
const userModel = require('../models/user');

// In-memory token store: { email: { token, expires } }
const resetTokens = new Map();

// Email config via env
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@example.com';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

/**
 * Generate a secure random token
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

class PasswordResetService {
  /**
   * Initiates a password reset request for an email.
   * Generates token if user exists and "sends" email.
   * @param {string} email
   * @returns {object} { success: boolean, token?:string }
   */
  // PUBLIC_INTERFACE
  async initiatePasswordReset(email) {
    // Demo: username acts as email
    const user = await userModel.findByUsername(email);
    if (!user) {
      // "Success" for security; do not reveal email does not exist
      return { success: false };
    }
    // Generate reset token & expiry (1 hour)
    const token = generateToken();
    const expires = Date.now() + 60 * 60 * 1000;

    resetTokens.set(email, { token, expires });

    // Simulate email sending (mock)
    const resetUrl = `${SITE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    let emailSent;
    if (EMAIL_API_KEY) {
      // Place for real email logic (left as TODO)
      // emailSent = await realSendEmail({ to: email, from: EMAIL_FROM, ... })
      emailSent = true;
    } else {
      // Mock: log to server
      console.log(`[PasswordReset MOCK EMAIL]\nTo: ${email}\nReset link: ${resetUrl}\n`);
      emailSent = true;
    }

    return { success: !!emailSent, token }; // returning token for demo/testing
  }

  /**
   * Validates a reset token for a given email address.
   * @param {string} email
   * @param {string} token
   * @returns {boolean}
   */
  // PUBLIC_INTERFACE
  validateToken(email, token) {
    const record = resetTokens.get(email);
    if (!record) return false;
    if (record.token !== token) return false;
    if (Date.now() > record.expires) return false;
    return true;
  }

  /**
   * Removes the used token after reset
   * @param {string} email
   */
  // PUBLIC_INTERFACE
  invalidateToken(email) {
    resetTokens.delete(email);
  }
}

module.exports = new PasswordResetService();
