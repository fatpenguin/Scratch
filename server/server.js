
/*
Code Desgined and Written by David Robertaud
 */

module.exports = function () {

	// configuration for the server
	var config = require("./config/server.js"),
	http = require("http"),
	express = require("express"),
	path = require("path"),
	bodyParser = require('body-parser'),
	app = express(),
	// possibility to add events and middleware capacities
	// not used with util.inherits to control the exports of the server
	events = require(path.dirname(require.main.filename) + "/lib/Events/events.js")(),
	middleware = require(path.dirname(require.main.filename) + "/lib/Events/middleware.js")(),
	port = config.port

		// scope safe events and middleware setters
	function eventAddListener(event, listener) {
		events.addListener(event, listener)
		return returnObject
	}

	function middlewareAddListener(event, listener) {
		middleware.addFunction(event, listener)
		return returnObject
	}

	var server = http.createServer(app)
	app.use(bodyParser.urlencoded({
		extended: true
	}))
	app.use(bodyParser.json())
	require("./standartRoutes")(app)
	// server will listen after execution of the function, the callback gives the visual feedback
	server.listen(port, function () {
		console.log("Server listening on port: ", port)
	})

	// handlers of the object for whichever requires it
	var returnObject = {
		on: eventAddListener,
		use: middlewareAddListener
	}
}
();
