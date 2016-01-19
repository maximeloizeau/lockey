'use strict';

const mongoose = require('mongoose');

let eventSchema = mongoose.Schema({
	startingDate: 	Date,
	agreedLength: 	Number,
	rentDay: 		Number,
	_housing: 		Schema.Types.ObjectId,
	_tenant: 		Schema.Types.ObjectId,
	documents: 		[String],
	history: 		[Schema.Types.ObjectId]
});


let Event = mongoose.model('Event', eventSchema);

module.exports = Event;