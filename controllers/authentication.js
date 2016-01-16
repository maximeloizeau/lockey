'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../config/app');
const User = require('../models/user').User;

let cryptPassword = function(password) {
    return crypto.createHash('sha256').update(password + config.secret).digest('hex');
}

let loginFailed = function(reply) {
    reply({
        success: false,
        message: 'Login unsuccessful'
    });
}

let logUserIn = function(email, hash, reply) {
    User.findOne({ 'email': email, 'password': hash })
    .then(user => {
        if(user) {
            let token = jwt.sign({ email: email }, config.secret, { expiresIn: '30d' });
            user.token = token;
            user.save()
            .then(
                savedUser => {
                    reply({
                        success: true,
                        message: 'Login successful',
                        data: {
                            token: token,
                            expiry: new Date().getTime() + 60*60*24*30
                        }
                    });
                },
                err => {
                    loginFailed(reply);
                }
            );
        }
        else {
            loginFailed(reply);
        }
    });
}

module.exports = {
    
    login: function(request, reply) {
        let email = request.payload.email;
        let password = cryptPassword(request.payload.password);

        logUserIn(email, password, reply);
    },

    signup: function(request, reply) {
        let email = request.payload.email;
        let firstname = request.payload.firstname;
        let lastname = request.payload.lastname;
        let password = cryptPassword(request.payload.password);

        User.findOne({ 'email': email })
        .then(user => {
            if(user) {
                reply({
                    success: false,
                    message: 'User already registered'
                });
            }
            else {
                let createdUser = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password
                });

                createdUser.save()
                .then(
                    savedUser => {
                        logUserIn(email, password, reply);
                    },
                    err => {
                        return reply({
                            success: false,
                            message: "A problem occured during registration"
                        });
                    }
                );
            }
        })
    },

    logout: function(request, reply) {
        if(request.app.user) {
            request.app.user.token = undefined;
            request.app.user.save()
            .then(u => {
                reply({
                    success: true,
                    message: "Successfully logged out"
                });
            });
        }
    }

};