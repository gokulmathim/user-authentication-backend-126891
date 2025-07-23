const express = require('express');
const authController = require('../controllers/auth');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints for user authentication
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags:
 *       - Auth
 *     description: |
 *       Accepts user's email, checks if user exists, and sends a (mocked) email with a reset link.
 *       This endpoint always returns a generic message, regardless of whether the email exists, for security.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address (username in this demo)
 *     responses:
 *       200:
 *         description: "If a user with that email exists, a reset link has been sent."
 *       400:
 *         description: Email is required.
 */
router.post('/forgot-password', authController.forgotPassword.bind(authController));

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User registration
 *     description: Register a new user with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Username already taken
 */
router.post('/signup', authController.signup.bind(authController));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Logs in a user and returns access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful. Returns tokens.
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     description: Blacklists the JWT access token until it expires.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', authenticateJWT, authController.logout.bind(authController));

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh token
 *     description: Issues a new access token given a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post('/refresh-token', authController.refreshToken.bind(authController));

module.exports = router;
