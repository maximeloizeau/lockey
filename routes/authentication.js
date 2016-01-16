'use strict';

const authController = require('../controllers/authentication');

module.exports = function() {
    return [
        {
            method: 'POST',
            path: '/login',
            config : {
                handler: authController.login
                //validate: taskValidate.findByID
            }
        },
        {
            method: 'POST',
            path: '/signup',
            config : {
                handler: authController.signup
                //validate: taskValidate.findByID
            }
        },
        {
            method: 'POST',
            path: '/logout',
            config : {
                handler: authController.logout
                //validate: taskValidate.findByID
            }
        }
    ];
}();
