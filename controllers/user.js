'use strict';

const config = require('../config/app');
const User = require('../models/user').User;

module.exports = {
    
    me: function(request, reply) {
        if(!request.app.authenticated) {
            return reply({
                message: "No profile found"
            });
        }

        reply(request.app.user.format());
    },

};