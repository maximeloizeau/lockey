'use strict';

const Boom = require('boom');

const config = require('../config/app');
const User = require('../models/user').User;

module.exports = {
    
    me: function(request, reply) {
        if(!request.app.authenticated) {
            return reply(Boom.unauthorized());
        }

        reply(
        	request.app.user.format()
        );
    },

};