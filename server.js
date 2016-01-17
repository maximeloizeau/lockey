'use strict';

const localtunnel = require('localtunnel');
const Hapi = require('hapi');
const mongoose = require('mongoose');

const config = require('./config/app');
const authMiddleware = require('./middlewares/auth');
const routes = require('./routes')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: config.port 
});

// Register all routes defined in ./routes/
for (var route in routes) {
    server.route(routes[route]);
}

// Database connection with mongoose
mongoose.connect('mongodb://localhost/lockey');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB lockey");
});

// Log every request
server.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
});

// Middleware to check authentication (if token provided by client)
server.ext('onRequest', function (request, reply) {
    authMiddleware.loggedUser(request.headers.token, (authenticated, user) => {
        request.app.authenticated = authenticated;

        if(authenticated) {
            request.app.user = user;
        }

        return reply.continue();
    });
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);

    // Connection to localtunnel to be exposed to the internet for the mobile app requests
    const requestedSubdomain = 'lockey16';
    let tunnel = localtunnel(config.port, { 'subdomain': requestedSubdomain }, function(err, tunnel) {
        if (err) throw err;

        console.log('Local tunnel on subdomain : ' + tunnel.url);
    });
});