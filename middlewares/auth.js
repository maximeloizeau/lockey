const config = require('../config/app');
const jwt = require('jsonwebtoken');
const User = require('../models/user').User;

module.exports = {

    /* Check if user is correctly logged in and returns a User object
    * @method loggedUser
    * @param {String} token A jwt token
    * @param {Function} next A callback function called when token is verified and returns results and user object (Boolean, Object)
    * @return {} Returns void
    */
    loggedUser: function(token, next) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) return next(false);

            User.findOne({ 'email': decoded.email, 'token': token })
            .then(user => {
                if(!user) return next(false);

                next(true, user);
            }, err => {
            	next(false);
            });
        });
    }

};