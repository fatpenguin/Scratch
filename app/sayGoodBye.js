module.exports = function(){
	var path = require("path"),

	// Load the necessary component to be listened and to listen
	routes = require(path.dirname(require.main.filename) + '/server/standartRoutes.js'),
	events = require(path.dirname(require.main.filename) + "/lib/Events/events.js")(),
	middleware = require(path.dirname(require.main.filename) + "/lib/Events/middleware.js")()

	
		// scope safe events and middleware setters
	function eventAddListener(event, listener) {
		events.addListener(event, listener)
		return returnObject
	}

	function middlewareAddListener(event, listener) {
		middleware.addFunction(event, listener)
		return returnObject
	}
	
	routes.use("get:/api/bye",function(req,res,next){
		res.statusCode = 200
		res.message = "Bye"
		events.fire("bye",res)
		next()
	})
	
	var returnObject = {
		on : eventAddListener,
		use : middlewareAddListener
	}
	return returnObject
}()