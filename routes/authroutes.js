const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authcontroller'); // Update the path as needed

const router = express.Router();

// Signup Route
router.post('/signup', authController.signup);

// Login Route
router.post('/login', authController.login);

// Google OAuth2 Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);

module.exports = router;
