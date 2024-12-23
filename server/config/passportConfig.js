const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you would handle user data (e.g., store or retrieve user from the database)
      console.log('Google Profile:', profile);
      console.log('Google accessToken:', accessToken);

      // Access specific fields
      const userData = {
        id: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails ? profile.emails[0].value : null,
        picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
      };
      
      // Here, you might save or retrieve the user in your database
      done(null, userData); // Pass the user data to the next step
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_GITHUB_URL}`,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('GitHub Profile:',profile);
      console.log('GitHub accessToken:',accessToken);

      // Access specific fields
      const userData = {
        id: profile.id,
        displayName: profile.displayName,
        username: profile.username,
        email: profile.emails ? profile.emails[0].value : null,
        profileUrl: profile.profileUrl,
        picture: profile.photos ? profile.photos[0].value : null,
      };

      // Save or retrieve the user in your database if necessary
      done(null, userData); // Pass the user data to the next step
    }
  )
);

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.CALLBACK_FACEBOOK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
(accessToken, refreshToken, profile, done) => {
  
  console.log('Facebook Profile:',profile);
  console.log('Facebook accessToken:',accessToken);

  // Handle user data here (e.g., store or retrieve user from the database)
  const userData = {
    id: profile.id,
    displayName: profile.displayName,
    email: profile.emails ? profile.emails[0].value : null,
    picture: profile.photos && profile.photos.length ? profile.photos[0].value : null,
  };

  // You can then save `userData` to your database or session, etc.
  done(null, userData);
}
));

// Serialize and deserialize user information to/from the session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
