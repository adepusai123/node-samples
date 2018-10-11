import express from 'express';
import { Strategy as FacebookStrategy } from 'passport-facebook';
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

    passport.use(new FacebookStrategy(CONSTANTS['SOCIAL']['FACEBOOK'], (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken, refreshToken, profile)
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

    router.get('/', (req, res) => {
        res.send('Hello World');
    });
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

    router.get('/home', isAuthenticated, (req, res) => {
        res.send('You are successfully signed up with facebook ');
    });
    return router;
};