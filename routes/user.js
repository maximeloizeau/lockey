'use strict';

const userController = require('../controllers/user');

module.exports = function() {
    return [
        {
            method: 'GET',
            path: '/users/me',
            config : {
                handler: userController.me
                //validate: taskValidate.findByID
            }
        }
    ];
}();
