
/*
Code Desgined and Written by David Robertaud
 */

// Object to make the caller inheriting being listened by other modules and able to wait for an answer
function Middleware() {
	if (!(this instanceof Middleware))
		return new Middleware()
}

Middleware.prototype = {
	constructor: Middleware,
	// Register a function to call when the inheriting object called fire with the write type
	addFunction: function (event, fonction) {
		if (typeof event === "string" && typeof fonction === "function") {
			if (!this.hasOwnProperty("_functions")) {
				this._functions = []
			}
			if (typeof this._functions[event] == "undefined") {
				this._functions[event] = []
			}
			this._functions[event].push(fonction)
		} else {
			return new Error("The parameters are not valid")
		}
	},
	// Execute in chain all the functions linked the type
	fire: function (event) {
		var callback = arguments[arguments.length - 1]
			var parameters = []
			var self = this
			for (var i = 1; i < arguments.length - 1; i++) {
				parameters.push(arguments[i])
			}
			if (typeof event === "string" && typeof arguments[arguments.length - 1] === "function") {
				var erreurs = undefined
					if (this._functions && this._functions[event]instanceof Array) {
						// Prepares the callback
						parameters.push(function (err) {
							// Gathering all the errors
							if (err) {
								if (erreurs === undefined)
									erreurs = []
									erreurs.push(err)
							}
							compteur++
							// check if all the functions launched trriggered the callback
							if (compteur === len) {
								parameters.splice(0, 0, erreurs)
								for (var i = 1; i < arguments.length; i++) {
									parameters.push(arguments[i])
								}
								callback.apply(self, parameters)
							}
						})
						// Applying the parameters to the function launched
						var functions = this._functions[event]
							var compteur = 0
							for (var i = 0, len = functions.length; i < len; i++) {
								functions[i].apply(this, parameters)
							}
					} else {
						parameters.splice(0, 0, undefined)
						callback.apply(this, parameters)
					}
			} else {
				return new Error("The parameters are not valid")
			}
	}
}

module.exports = Middleware
