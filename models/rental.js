'use strict';

const mongoose = require('mongoose');

let rentalSchema = mongoose.Schema({
	startingDate: 	Date,
	agreedLength: 	Number,
	rentDay: 		Number,
	_apartment: 	mongoose.Schema.Types.ObjectId,
	_tenant: 		mongoose.Schema.Types.ObjectId,
	documents: 		[String],
	history: 		[mongoose.Schema.Types.ObjectId]
});


let Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;