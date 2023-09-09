const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // Import passport module

const promisePool = require('../model/usermodel'); // Replace with your database connection

module.exports = {
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if the user already exists
      const [existingUser] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
      }


      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert the user into the database
      await promisePool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error in /signup:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body; // Use a single field for email or username
      
  
      // Check if the user exists based on email or username
      const [user] = await promisePool.query('SELECT * FROM users WHERE email = ? OR username = ?', [emailOrUsername, emailOrUsername]);
  
    
  
      // Check if the user exists
      if (!user.length) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, user[0].password);
  
    
  
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // At this point, the login was successful
      // You can generate and return a JWT token or perform further actions
      // For example:
      // const token = generateAuthToken(user[0].id);
      // return res.status(200).json({ token });
    
  
  


      // Generate a JWT token for authentication
      const token = jwt.sign({ userId: user[0].id }, 'your_secret_key', { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error in /login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  googleLogin: (req, res) => {
    // Google OAuth2 login logic
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  },

  googleCallback: (req, res) => {
    // After the user is authenticated with Google, this callback function will be called
    // You can handle the user's data here and create a JWT token if needed
    passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
      if (err) {
        // Handle authentication error
        console.error('Error in Google OAuth2 authentication:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!user) {
        // Handle authentication failure
        return res.status(401).json({ message: 'Google authentication failed' });
      }

      // User is authenticated, generate a JWT token or perform other actions as needed
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

      // Redirect or respond with the token as needed
      // Example: res.redirect('/dashboard');
      res.status(200).json({ token });
    })(req, res);
  },
};
