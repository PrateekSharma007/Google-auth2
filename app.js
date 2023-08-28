const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const user = require("./db/schema");
const db = require("./db/db");
require("dotenv").config();



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
        console.log(profile.emails[0].value + "profile")
        const newUser = new user({
            email: profile.emails[0].value
        });
        console.log(profile.emails[0].value + "profile")
        await newUser.save();
        console.log(newUser)
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
}));



app.get("/", (req, res) => {
    res.send("Welcome to google auth");
});

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'select_account'}));

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/auth/failure" }), (req, res) => {

    res.redirect("/check-registration");
});

app.get("/auth/failure", (req, res) => {
    res.send("User login failed");
});

app.get("/check-registration", async (req, res) => {
    if (req.isAuthenticated()) {
        const userEmail = req.user.email;
        const existingUser = await user.findOne({ email: userEmail });
        console.log(existingUser)
        console.log(userEmail)

        if (existingUser) {
            res.send("login successfull.");
        } else {
            res.send("User is not registered.");
        }
    } else {
        res.send("Not authenticated.");
    }
});



app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  

//   app.get('/logout', function(req, res, next) {
//     req.logout(function(err) {
//       if (err) { return next(err); }
//       console.log(req.session)
//       req.session = null ;
//       res.redirect('/');
//     });

//   });

// app.get("/logout" , function(req,res) => { 
//     rew
// })

  //current user khud ki api
app.listen(3000, () => {
    console.log("Port 3000 is working");
});
