const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const user = require("./db/schema");
require("dotenv").config();

app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.Client_id,
    clientSecret: process.env.Client_secret_key,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await user.findOne({ email: profile.emails[0].value });
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = new user({
            // method: 'google',
            email: profile.emails[0].value
        });

        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser(function(user, cb){
    cb(null, user);
});

passport.deserializeUser(function(object, cb){
    cb(null, object);
});

app.get("/", (req, res) => {
    res.send("Welcome to google auth");
});

app.get("/auth/google", passport.authenticate('google', { scope: ["email", "profile"] }));

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/auth/failure" }), async (req, res) => {
    res.redirect("/check-registration");
});

app.get("/auth/failure", (req, res) => {
    res.send("User login failed");
});

// Check if the user is registered
app.get("/check-registration", async (req, res) => {
    if (req.isAuthenticated()) {
        const userEmail = req.user.email;
        const existingUser = await user.findOne({ email: userEmail });

        if (existingUser) {
            res.send("User is registered.");
        } else {
            res.send("User is not registered.");
        }
    } else {
        res.send("Not authenticated.");
    }
});

app.listen(3000, () => {
    console.log("Port 3000 is working");
});
