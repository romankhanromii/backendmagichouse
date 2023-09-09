// const express = require('express');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mysql = require('mysql2');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const app = express();
// app.use(express.json());

// // Define MySQL connection configuration
// const db = mysql.createConnection({
//   user: 'root', // Your MySQL username
//   password: 'Roman1435', // Your MySQL password
//   host: '127.0.0.1', // MySQL host (usually localhost)
//   port: 3306, // MySQL port
//   database: 'mydb', // Your database name
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Configure Google OAuth2
// passport.use(new GoogleStrategy({
//   clientID: 'your_client_id', // Replace with your actual client ID
//   clientSecret: 'your_client_secret', // Replace with your actual client secret
//   callbackURL: 'http://localhost:3000/auth/google/callback',
// }, (accessToken, refreshToken, profile, done) => {
//   // You can handle Google authentication here.
//   // Store user data in the database or retrieve it if already exists
//   // ...
// }));

// // Define routes
// app.get('/', (req, res) => {
//   res.send('Welcome to the authentication API!');
// });

// // Signup Route
// app.post('/signup', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     // Check if the user already exists
//     const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
//     if (existingUser.length > 0) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the user into the database
//     await db.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
//     return res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error in /signup:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Check if the user exists
//     const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
//     if (user.length === 0) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Compare the provided password with the hashed password in the database
//     const match = await bcrypt.compare(password, user[0].password);
//     if (!match) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate a JWT token for authentication
//     const token = jwt.sign({ userId: user[0].id }, 'your_secret_key', { expiresIn: '1h' });
//     return res.status(200).json({ token });
//   } catch (error) {
//     console.error('Error in /login:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Google OAuth2 Login
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const passport = require('passport');
const cors = require('cors'); // Import the cors middleware

const authroutes = require('./routes/authroutes'); // Update the path as needed
const app = express();

app.use(express.json());

// Initialize Passport
require('./config/passport');

// Use the cors middleware to allow requests from any origin
const corsOptions = {
  origin: "*",
  "Access-Control-Allow-Origin": "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the authentication API!');
});

// Use the authentication routes
app.use('/', authroutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
