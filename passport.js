const passport = require("passport") ; 
const user = require("./db/schema")
const db = require("./db/db")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config() ;

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//key extract karega ye 
opts.secretOrKey = 'Random key';
console.log("h1")
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const foundUser = await user.findOne({ email: jwt_payload.email });
        console.log(jwt_payload)
        // console.log(jwt_payload.email)
        
        if (foundUser) {
            return done(null, foundUser);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }

}));




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


module.exports = passport;