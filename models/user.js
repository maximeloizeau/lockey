'use strict';

const mongoose = require('mongoose');
const options = { discriminatorKey: 'type' };

// User model
const safeAttributes = ['firstname', 'lastname', 'email', 'phone', 'type'];
let userSchema = mongoose.Schema({
	firstname: String,
	lastname:  String,
	email:     String,
	password:  String,
	phone:     String,
	token:     String,
	tokenExpiry: Date
}, options);

userSchema.statics.typeName = function() { return "User" };

userSchema.methods.formatWithToken = function() {
	let safeFields = safeAttributes.concat(['token', 'tokenExpiry']);
	return this.format(safeFields);
};

userSchema.methods.format = function(fields) {
	let safeFields = fields || safeAttributes;

	let safeUser = {};
	safeFields.forEach(a => {
		safeUser[a] = this[a];
	});

	return safeUser;
};

let User = mongoose.model('User', userSchema);

// Owner model
let ownerSchema = mongoose.Schema({}, options);
ownerSchema.statics.typeName = function() { return "Owner" };
let Owner = User.discriminator('Owner', ownerSchema);

// Tenant model
let tenantSchema = mongoose.Schema({}, options);
tenantSchema.statics.typeName = function() { return "Tenant" };
let Tenant = User.discriminator('Tenant', tenantSchema);

module.exports = {
	User: User,
	Owner: Owner,
	Tenant: Tenant
};