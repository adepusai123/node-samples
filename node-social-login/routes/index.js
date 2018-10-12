import express from 'express';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuthStrategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import environment from '../config/constants';
const env = environment.ENVIRONMENT;
process.env.NODE_ENV = env;
const config = require(`../config/config-${env}.json`);
const CONSTANTS = config['CONSTANTS'];
import User from '../models/user';
const router = express.Router();

export const isAuthenticated = (req, res, next) => {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
};

export default passport => {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    router.get('/', (req, res) => {
        res.send('Hello World');
    });
    /* FACEBOOK AUTHENTICATION */
    passport.use(new FacebookStrategy(CONSTANTS['SOCIAL']['FACEBOOK'], (accessToken, refreshToken, profile, done) => {
        User.findOne({ facebookId: profile.id }, (err, user) => {
            if (err) { return done(err) }
            if (user) {
                done(null, user);
            } else {
                User.create({ facebookId: profile.id, displayName: profile.displayName, token: accessToken, email: profile.email }, (err, user) => {
                    if (err) { return done(err); }
                    done(null, user);
                });
            }
        });
    }
    ));

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    // route for facebook authentication and login
    // different scopes while logging in
    router.get('/login/facebook',
        passport.authenticate('facebook', { scope: ['email', 'user_birthday', 'user_gender'] }
        ));

    // handle the callback after facebook has authenticated the user
    router.get('/login/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/'
        })
    );
    /* 
    FACEBOOK AUTHENTICATION DONE
     */
    /* GOOGLE AUTHENTICATION START */

    // Use the GoogleStrategy within Passport.
    //   Strategies in passport require a `verify` function, which accept
    //   credentials (in this case, a token, tokenSecret, and Google profile), and
    //   invoke a callback with a user object.
    passport.use(new GoogleStrategy({
        consumerKey: "GOOGLE_CONSUMER_KEY",
        consumerSecret: "GOOGLE_CONSUMER_SECRET",
        callbackURL: "http://localhost:3000/login/google/callback"
    }, (token, tokenSecret, profile, done) => {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
    ));

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve redirecting
    //   the user to google.com.  After authorization, Google will redirect the user
    //   back to this application at /auth/google/callback
    router.get('/login/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    router.get('/login/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('/home');
        });
    /* GOOGLE AUTHENTICATION END */
    /* TWITTER AUTHENTICATION START */
    passport.use(new TwitterStrategy(CONSTANTS['SOCIAL']['TWITTER'],
        function (token, tokenSecret, profile, done) {
            User.findOrCreate({}, function (err, user) {
                if (err) { return done(err); }
                done(null, user);
            });
        }
    ));

    router.get('/login/twitter', passport.authenticate('twitter'));
    router.get('/login/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));
    /* TWITTER AUTHENTICATION END */
    router.get('/home', isAuthenticated, (req, res) => {
        res.send('You are successfully signed up with facebook ');
    });
    return router;
};