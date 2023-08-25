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
        const User = await user.findOne({ email: profile.emails[0].value });
        if (User) {
            return done(null, User);
        }
        const newUser = new user({
            method: 'google',
            email: profile.emails[0].value
        });

        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
}));


passport.serializeUser(function(user,cb){
    cb(null,user)
})

passport.deserializeUser(function(object,cb){
    cb(null,object)
})


app.get("/", (req, res) => {
    res.send("Welcome to google auth");
}); 

app.get("/auth/google", passport.authenticate('google', { scope: ["email", "profile"] }));

app.get("/auth/google/callback", passport.authenticate('google', { session: false }), (req, res) => {
    res.send("User login successful");
});

app.listen(3000, () => {
    console.log("Port 3000 is working");
});
