const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();

// Configure Passport with Steam strategy
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '549A84BFE40303793E62B84BA57FCC84'
},
function(identifier, profile, done) {
    process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
    });
}));

// Serialize user for session
passport.serializeUser(function(user, done) {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Set up express session middleware
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Steam authentication routes
app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/return', 
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home with user info.
        res.redirect('/profile');
    });

// Route to get user profile
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.redirect('/auth/steam');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
