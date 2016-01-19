'use strict';

const mongoose = require('mongoose');

let housingSchema = mongoose.Schema({
	name: 		String,
	address: 	{
		number: 		String,
		street: 		String,
		postal_code: 	String,
		city: 			String
	},
	location: 	[Number],
	rent: 		Number,
	utilities:	Number,
	area:	 	Number,
	furnished:  Boolean,
	type: 	    String,
	description:String,
	_owner: 	mongoose.Schema.Types.ObjectId
});


let Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;