var jwt = require('jsonwebtoken'),
        crypto = require('crypto'),
        User = require('../model/user'),
        config = require('../config'),
        passport = require('passport');

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: config.sessionTimeout
    });
}

function setUserInfo(request) {
    return {
        _id: request._id,
        name: request.name,
        lastName: request.lastName,
        email: request.email,
        role: request.role
    };
}

function login(req, res, next) {
    var userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
}

function register(req, res, next) {
    // Check for registration errors
    var email = req.body.email;
    var name = req.body.name;
    var lastName = req.body.lastName;
    var password = req.body.password;
    // Return error if no email provided
    if (!email) {
        return res.status(422).send({error: 'You must enter an email address.'});
    }
    // Return error if full name not provided
    if (!name || !lastName) {
        return res.status(422).send({error: 'You must enter your full name.'});
    }
    // Return error if no password provided
    if (!password) {
        return res.status(422).send({error: 'You must enter a password.'});
    }
    User.findOne({email: email}, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({error: 'That email address is already in use.'});
        }
        // If email is unique and password was provided, create account
        var user = new User({
            email: email,
            password: password,
            name: name,
            lastName: lastName
        });
        user.save(function (err, user) {
            if (err) {
                return next(err);
            }
            // Respond with JWT if user was created
            var userInfo = setUserInfo(user);
            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
}

module.exports = function (router) {
    var requireAuth = passport.authenticate('jwt', { session: false });
    var requireLogin = passport.authenticate('local', { session: false });
    router
            .post('/auth/register', register)
            .post('/auth/login', requireLogin, login);
};