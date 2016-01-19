'use strict';

const Boom = require('boom');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../config/app');
const Users = require('../models/user');
const User = Users.User;

let cryptPassword = function(password) {
    return crypto.createHash('sha256').update(password + config.secret).digest('hex');
}

let loginFailed = function(reply) {
    return reply(Boom.unauthorized('Login failed'));
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
                    return reply(savedUser.formatWithToken());
                },
                err => {
                    return loginFailed(reply);
                }
            );
        }
        else {
            return loginFailed(reply);
        }
    }, err => {
        return loginFailed(reply);
    });
}

module.exports = {
    
    login: function(request, reply) {
        let email = request.payload.email;
        let password = cryptPassword(request.payload.password);

        return logUserIn(email, password, reply);
    },

    signup: function(request, reply) {
        let email = request.payload.email;
        let firstname = request.payload.firstname;
        let lastname = request.payload.lastname;
        let password = cryptPassword(request.payload.password);
        let type = request.payload.type;

        User.findOne({ 'email': email })
        .then(user => {
            if(user) {
                return reply(Boom.badRequest('Email already in use'));
            }
            else {
                let createdUser;
                let fields = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password
                };

                for(let userType in Users) {
                    if(Users[userType].typeName() === type) {
                        createdUser = new Users[userType](fields);
                        break;
                    }
                }
                
                createdUser.save()
                .then(
                    savedUser => {
                        logUserIn(email, password, reply);
                    },
                    err => {
                        reply(Boom.badRequest('A problem occured during registration'));
                    }
                );
            }
        });
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