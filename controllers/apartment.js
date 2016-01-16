'use strict';

const config = require('../config/app');
const Apartment = require('../models/apartment');
const User = require('../models/user').User;

module.exports = {
    
    create: function(request, reply) {
        const address = request.payload.address;
        const rent = request.payload.rent;
        const utilities = request.payload.utilities;
        const furnished = request.payload.furnished;
        const type = request.payload.type;
        const description = request.payload.description;

        let apartment = new Apartment({
            address: address,
            rent: rent,
            utilities: utilities,
            furnished: furnished,
            type: type,
            description: description,
            _owner: request.app.user
        });
        apartment.save()
        .then(appt => {
            reply(appt)
        });
    },

    getAll: function(request, reply) {
        Apartment.find({ _owner: request.app.user })
        .then(appts => {
            reply(appts);
        })
    }

};