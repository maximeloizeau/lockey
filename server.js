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

for (var route in routes) {
    server.route(routes[route]);
}

mongoose.connect('mongodb://localhost/lockey');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB lockey");
});

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

    const requestedSubdomain = 'lockey16';
    let tunnel = localtunnel(config.port, { 'subdomain': requestedSubdomain }, function(err, tunnel) {
        if (err) throw err;

        console.log('Local tunnel on subdomain : ' + tunnel.url);
    });
});