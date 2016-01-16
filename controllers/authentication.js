'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../config/app');
const User = require('../models/user').User;

let cryptPassword = function(password) {
    return crypto.createHash('sha256').update(password + config.secret).digest('hex');
}

let loginFailed = function(reply) {
    reply(Boom.unauthorized());
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
                    reply(savedUser.formatWithToken());
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
                reply(Boom.badRequest('Email already in use'));
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
                        return reply(Boom.badRequest('A problem occured during registration'));
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
                reply();
            });
        }
    }

};