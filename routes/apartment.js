'use strict';

const apartmentController = require('../controllers/apartment');

module.exports = function() {
    return [
        {
            method: 'POST',
            path: '/apartments',
            config : {
                handler: apartmentController.create
                //validate: taskValidate.findByID
            }
        },
        {
            method: 'GET',
            path: '/apartments',
            config : {
                handler: apartmentController.getAll
                //validate: taskValidate.findByID
            }
        }
    ];
}();
