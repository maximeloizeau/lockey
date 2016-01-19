'use strict';

const housingController = require('../controllers/housing');

module.exports = function() {
    return [
        {
            method: 'POST',
            path: '/housings',
            config : {
                handler: housingController.create
                //validate: taskValidate.findByID
            }
        },
        {
            method: 'GET',
            path: '/housings',
            config : {
                handler: housingController.getAll
                //validate: taskValidate.findByID
            }
        }
    ];
}();
