#!/usr/bin/env node
/**********
 *
 * should start module config first
 */
var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var config = require('../config/config');

var app = express();
var port = process.env.PORT || 3000;

// Connect to mongodb
var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    //mongoose.connect(config.db, options);
    console.log(options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models like classLoader
["action", "service", "dao"].forEach(function (subdir) {
    fs.readdirSync(__dirname + '/../app/' + subdir).forEach(function (file) {
        if (~file.indexOf('.js')) require(__dirname + '/../app/' + subdir + '/' + file);
    });

});

// The project's individual business modules assembling below
// Bootstrap application underlying settings
require('../config/express')(app, undefined);

// Bootstrap routes
require('../config/routes')(app, undefined);


// Starting server after all preparations
var server = app.listen(port, function () {
    console.log('Express app started on port ' + port);

});

/**
 * Expose
 */
//This file is the top level of the system, so note it's not to be injected down-stairs
process.httpServer = server;
process.app = app;
