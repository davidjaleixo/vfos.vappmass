#!/usr/bin/env node

/**
 * Module dependencies.
 */
var dal = require('./DAL');

/**
 * Fixing things
 */
var path = require('path');
var baseDir = require('app-root-path').path;
require('app-module-path')
  .addPath(baseDir);

var app = require('./app');
var debug = require('debug')('vfos-usecase:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4200');
console.info('backend is running internally at ', port)
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



function run() {

}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log("INIT DB...");
  init();
}

/**
 * DB population check
 */

function init() {
  console.log("Checking DB...")
  dal.init.dbExists(function (exists) {
    if (exists) {
      console.log("OK")
      console.log("Checking tables...")
      dal.init.tablesExistsAndCreates(function (tablesdone) {
        if (tablesdone) {
          console.log("Checking tables - DONE")
          console.log("Checking views...");
          dal.init.viewsExistsAndCreates(function (viewsdone) {
            if (viewsdone) {
              console.log("Checking views - DONE");
              console.log("Checking roles...");
              dal.init.checkRoles(function (rolesExist) {
                if (rolesExist) {
                  console.log("Checking roles - DONE");
                } else {
                  console.log("Creating roles...");
                  dal.init.createRoles(function (rolesdone) {
                    if (rolesdone) {
                      console.log("Creating roles - DONE")
                    } else {
                      console.log("NOT IMPLEMENTED :(")
                    }
                  })
                }
              })

            } else {
              console.log("NOT IMPLEMENTED :(")
              console.log("Creating roles...");
              dal.init.createRoles(function (rolesdone) {
                if (rolesdone) {
                  console.log("Creating roles - DONE")
                } else {
                  console.log("NOT IMPLEMENTED :(")
                }
              })
            }
          })
        } else {
          console.log("NOT IMPLEMENTED :(")
        }
      })
    } else {
      console.log("DB does not exist");
      console.log("Creating DB");
      dal.init.createDB(function (ok) {
        if (ok) {
          console.log("DB created");
          console.log("Creating tables");
          dal.init.tablesExistsAndCreates(function (tablesdone) {
            if (tablesdone) {
              console.log("Creating tables - DONE")
              console.log("Checking views...");
              dal.init.viewsExistsAndCreates(function (viewsdone) {
                if (viewsdone) {
                  console.log("Creating views - DONE");
                } else {
                  console.log("NOT IMPLEMENTED :(")
                }
              })
            } else {
              console.log("NOT IMPLEMENTED :(")
            }
          })
        } else {
          console.log("something went wrong on db creation...")
        }
      })
    }
  })
}