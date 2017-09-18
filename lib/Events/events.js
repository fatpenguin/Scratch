
/*
Code Desgined and Written by David Robertaud
 */

// Object to make the caller inheriting being listened by other modules

function Events() {
	// Scope safe constructor
	if (!(this instanceof Events)) {
		return new Events()
	}
}

Events.prototype = {
	constructor: Events,
	// Register a function to call when the inheriting object called fire with the write type
	addListener: function (type, listener) {
		if (typeof type === "string" && typeof listener === "function") {
			if (!this.hasOwnProperty("_listeners")) {
				this._listeners = []
			}
			if (typeof this._listeners[type] == "undefined") {
				this._listeners[type] = []
			}
			this._listeners[type].push(listener)
		} else {
			return new Error("The parameters are not valid")
		}
	},
	// Execute in chain all the functions linked the type
	fire: function (type) {
		var data = []
		if (typeof type === "string") {
			for (var i = 1; i < arguments.length; i++) {
				data.push(arguments[i])
			}

			if (this._listeners && this._listeners[type]instanceof Array) {
				var listeners = this._listeners[type]
					for (var i = 0, len = listeners.length; i < len; i++) {
						listeners[i].apply(listeners[i], data)
					}
			}
		} else {
			return new Error("The parameters are not valid")
		}
	}
}

module.exports = Events
