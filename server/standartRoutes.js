
/*
Code Desgined and Written by David Robertaud
 */

module.exports = function () {
	var express = require("express")
		var path = require("path"),
	// possibility to add events and middleware capacities
	// not used with util.inherits to control the exports of the server
	events = require(path.dirname(require.main.filename) + "/lib/Events/events.js")(),
	middleware = require(path.dirname(require.main.filename) + "/lib/Events/middleware.js")()

		// scope safe events and middleware setters
	function eventAddListener(event, listener) {
		events.addListener(event, listener);
		return routeServer
	}

	function middlewareAddListener(event, listener) {
		middleware.addFunction(event, listener);
		return routeServer
	}

	// main functin of this object, allows to add routes to the server put in parameter
	function routeServer(app) {
		var routerAPI = express.Router()
		app.use("/api", routerAPI)

		routerAPI.get('/bonjour', function (req, res) {
			var message = {
				statusCode: 500,
				message: "No listener for /api/bonjour"
			}
			events.fire("get:/api/bonjour", req)
			middleware.fire("get:/api/bonjour", req, message, function () {
				res.status(message.statusCode).send(message.message)
			})
		})
		
		routerAPI.get("/bye",function(req,res){
			var message = {
				statusCode: 500,
				message: "No listener for /api/bye"
			}
			events.fire("get:/api/bye", req)
			middleware.fire("get:/api/bye", req, message, function () {
				res.status(message.statusCode).send(message.message)
			})
		})
		return routeServer
	}

	// Minimal frame strategy, the main function is root server, on and use are only tools
	// Only need to do require(this)(serer).on("event",callback) to add routes and a listener
	routeServer.use = middlewareAddListener
	routeServer.on = eventAddListener
	return routeServer
}
()
