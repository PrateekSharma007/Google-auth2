const passport = require("passport") ; 
const user = require("./db/schema")
const db = require("./db/db")
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config() ;




app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
    cb(null, user._id); 
});

passport.deserializeUser(async (id, cb) => {
    try {
        const existingUser = await user.findById(id);
        cb(null, existingUser);
    } catch (error) {
        cb(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.Client_id,
    clientSecret: process.env.Client_secret_key,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        // console.log(profile.emails[0].value + "profile")
        const existingUser = await user.findOne({ email: profile.emails[0].value });
        // console.log(profile.emails[0].value)
        if (existingUser) {
            return done(null, existingUser);
        }
        // console.log(profile.emails[0].value + "profile")
        const newUser = new user({
            email: profile.emails[0].value
        });
        // console.log(profile.emails[0].value + "profile")
        await newUser.save();
        console.log(newUser)
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
}));
