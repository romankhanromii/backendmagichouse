const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: '245087461387-4rfr9vdvm3kttajvabfbalcgl3osrum1.apps.googleusercontent.com', // Replace with your actual client ID
  clientSecret: 'your_client_secret', // Replace with your actual client secret
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists in your database based on their Google profile ID
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      // If the user already exists, you can return it
      return done(null, existingUser);
    }

    // If the user doesn't exist, you can create a new user in your database
    const newUser = new User({
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value, // Assuming you want to store the first email
    });

    // Save the new user to the database
    await newUser.save();

    // Return the newly created user
    return done(null, newUser);
  } catch (error) {
    console.error('Error in Google OAuth2 authentication:', error);
    return done(error, null);
  }
}));
