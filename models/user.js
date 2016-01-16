'use strict';

const mongoose = require('mongoose');
const options = { discriminatorKey: 'type' };

const safeAttributes = ['firstname', 'lastname', 'email', 'phone'];
let userSchema = mongoose.Schema({
	firstname: String,
	lastname:  String,
	email:     String,
	password:  String,
	phone:     String,
	token:     String,
	tokenExpiry: Date
}, options);

userSchema.methods.formatWithToken = function() {
	let safeFields = safeAttributes.concat(['token', 'tokenExpiry']);
	return this.format(safeFields);
};

userSchema.methods.format = function(fields) {
	let safeFields = fields || safeAttributes;

	let safeUser = {};
	safeAttributes.forEach(a => {
		safeUser[a] = this[a];
	});

	return safeUser;
};

let User = mongoose.model('User', userSchema);

let ownerSchema = mongoose.Schema({}, options);
let Owner = User.discriminator('Owner', ownerSchema);

let tenantSchema = mongoose.Schema({}, options);
let Tenant = User.discriminator('Tenant', tenantSchema);

module.exports = {
	User: User,
	Owner: Owner,
	Tenant: Tenant
};