'use strict';

const mongoose = require('mongoose');

let apartmentSchema = mongoose.Schema({
	address: 	String,
	location: 	[Number],
	rent: 		Number,
	utilities:	Number,
	furnished:  Boolean,
	type: 	    String,
	description:String,
	_owner: 	mongoose.Schema.Types.ObjectId
});


let Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;