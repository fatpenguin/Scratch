# Scratch

Readme version 1.0
# Database Description

# Main Features
Description of the server and code implementations
## Options
Different options are available for the runtime, each includes the ones under

| Option | DESCTIPTION |
| --- | --- |
| hello | launches the server and the "sayHello" middleware |
| default | Run the server |

## Event based architecture
The server is mainly based on the event architecture which means that most of the links between function is not declared in the code but after the first load.
For example, A and B are functions and B needs the data returned by A. A classic architecture would be to write in the code
```javascript
 A(parameter,function(data){
    b(data)
 }
```
With the event based system, B must call the event manager of A to register to a particular event with a function. When A will trigger the event, it will automatically call the function registered by B. 
This architecture makes all the modules independent and unaware of the rest of the process. Therefore, it is possible to specify options when the server is launched. For example, if the logger system is not load, no log function will be registered to any of the event but the server will still do its job. On the opposite, if it is loaded the events with a log function registered will create a log message.
### Events
The event object offers one function to register to event (defined or not) and one to trigger the event. Each parameter put in the trigger will by passed as parameter to all the functions registered.
On this server only the object emitting the event has access to the emit function thank to a cache system.
### Middlewares
The middleware is an event which waits for all the listeners to finish their executions. It is achieved by offering to all the listener a "next" function, when all the next where called the emitter of the middleware knows it can continue its own execution. 
If any of the listener calls the next function with a parameter, the emitter will treat it as an error passed and act accordingly.
On this server only the object emitting the middleware event has access to the emit function thank to a cache system.
# Discussion

## Basic implementation
### How to code a independent module & best practices

In this section, different strategies will be developed to picture how the independent strategy can be flexible and responsive.

A module is independent if it can work whether another module is loaded. One possible workaround is to enable the events on the interactions on which the module does not depend. For example, if the module needs to register in a database, it is mandatory that this action is done and therefore should not depend on a listener. In this case a basic callback is more suited. On the other hand, if the module is offering data to be modified or other non-critical functions the event proposes this nondependent interaction. 

#### The singleton
With that in mind, each independent module should work as a standalone singleton, so the events are same through all the listeners.
Here is how to code a singleton in node JS

```javascript
 module.exports = function(){
     /// some code
 }()
```
The parenthesis at the end make the function execute just after it has been defined. So, after execution the equivalent code would be:
```javascript
 module.exports = {
     //result of the function
}
```

#### The event handling
The module should be able to emit events in order to let another module interact with it. To do it the module should load the library middleware and event and emit data when needed.
Here is a basic implementation: 

```javascript
var path = require("path"),
// possibility to add events and middleware capacities
// not used with util.inherits to control the exports of the object
events = require(path.dirname(require.main.filename) + "/lib/Events/events.js")(),
middleware = require(path.dirname(require.main.filename) + "/lib/Events/middleware.js")()

```

The library path is used to get the root of the project and look for the library with an absolute path. The parenthesis at the end of the requires is an equivalent for:
```javascript
var Events = require(path.dirname(require.main.filename) + "/lib/Events/events.js")
var event = new Events()
```

The events call all the listeners when a specific event occurs. For example, the listeners A and B register for the event event1 of a module. When the module will fire the event1 the listener A and B will have their code executed.

The registration will be described in the next section: "How to listen and react with a independent module". 

Then to emit the events and middleware events: 
```javascript
events.fire("event1", someData)
/// Emit the events but does not wait for an answer
middleware.fire("events1", someData, someOtherData, function () {
    /// Some code executed after all listeners finished their job
})
```
#### The minimum surface strategy
The minimum surface strategy is a good practice on Node JS to keep the use of libraries simple. If one module has a main function and multiple sub-functions the exports of the module can be as followed:

```javascript
function sayHello(name){
    console.log("Hello " + name)
}

sayHello.sayGoodBye = function(name){
    console.log("Bye " + name)
}
module.exports = sayHello
```

And it can be used this way which simplifies largely the use of the library: 
```javascript
var theModule = require("./theModule")

theModule("Name1") 
// outputs Hello Name1
theModule("Name2") 
// outputs Hello Name2
theModule.sayGoodBye("Name3")
// outputs Bye Name3

```

#### The recursive surface strategy
If some functions return the same surface as the module, it is possible to do a recursive application of functions on some data in this manner:

```javascript
var theModule = require("./theModule")

theModule("Name1")("Name2").sayGoodBye("Name3")
/*
    outputs Hello Name1
    Hello Name2
    Bye Name3
*/
```
or even:
```javascript
var theModule = require("./theModule")("Name1")("Name2").sayGoodBye("Name3")

theModule("Name4")
/*
    outputs Hello Name1
    Hello Name2
    Bye Name3
    Hello Name4
*/
```

The design to allow the recursive call the module should be coded like this: 
```javascript
function sayHello(name){
    console.log("Hello ", name)
    return interface
}

function sayGoodBye(name){
    console.log("Bye ", name)
    return interface
}

var interface = sayHello
interface.sayGoodBye = sayGoodBye
module.exports = interface
```
Because each function returns as value the same object, the functions can be called one after the other

#### All-inclusive module
To sum up a unique, simple and responsive module can be coded like this:
```javascript
module.exports = function () {
    function sayHello(name){
        console.log("Hello ", name)
        return returnObject
    }

    function sayGoodBye(name){
        console.log("Bye ", name)
        return returnObject
    }
    var returnObject = sayHello
    returnObject.sayGoodBye = sayGoodBye
    return returnObject
}()
```

And to add event capacities
```javascript
module.exports = function () {
    var path = require("path"),
    // possibility to add events and middleware capacities
    // not used with util.inherits to control the exports of the object
    events = require(path.dirname(require.main.filename) + "/lib/Events/events.js")(),
    middleware = require(path.dirname(require.main.filename) + "/lib/Events/middleware.js")()

    // Scope safe memory set
    function eventAddListener(event, listener) {
        events.addListener(event, listener);
        return returnObject
    }

    function middlewareAddListener(event, listener) {
        middleware.addFunction(event, listener);
        return returnObject
    }

    function sayHello(name){
        console.log("Hello ", name)
        events.fire("hello", name)
        /// Emit the events but does not wait for an answer
        middleware.fire("hello", name, function () {
            /// Some code executed after all listeners finished their job
        })
        return returnObject
    }

    function sayGoodBye(name){
        console.log("Bye ", name)
        events.fire("bye", name)
        /// Emit the events but does not wait for an answer
        middleware.fire("bye", name, function () {
            /// Some code executed after all listeners finished their job
        })
        return returnObject
    }

    var returnObject = sayHello
    returnObject.sayGoodBye = sayGoodBye
    returnObject.on = eventAddListener
    returnObject.use = middlewareAddListener

    return returnObject
}()
```
The scope safe memory set is mandatory to not have memory leaks with the code. This point will not be explained further in this presentation.
The functions events.addListener and middleware.addFunction are described in the next section.

### How to listen and interact with a independent module

The code to allow a module to fire an event was descripted in the previous section. It needs a string to target a specific event and call the fire function. 
Here is the code to register to a specific event: 
```javascript
function functionToExecute(someParameter){
    console.log("Function executed with parameters: ", someParameter)
}
var event = "events1"

events.addListener(event, functionToExecute);
```
When events1 will be fire, the function functionToExecute will be processed.

And the code to register to a middleware event:
```javascript
function functionToExecute(someParameter,next){
    console.log("Function executed with parameters: ", someParameter)
    next()
}
var event = "events1"

middleware.addFunction(event, functionToExecute);
```
When events1 will be fire, the function functionToExecute will be processed. The next parameter is used to signal the event emitter that the processing is finished and it can continue its own workflow.

Here is an implementation with a module coded as described in the previous section:
```javascript
var aModuleToListen = require("aModuleToListen")("name")

aModuleToListen.use("hello", function (params, next) {
    /// some code
    next()
})
aModuleToListen.on("bye",function(params){
    /// some code
})
```

Because the module is coded in singleton, the module will stay the same if another require of this module is made. Both caller will have access to the same events and same memory scope.

# Installation
The NodeJS version used is 6.9.5
To install all the server run the following command:
```sh
$ cd "your folder"
$ npm install
```
# Commands
Here is describe all the commands needed to run the server with its options
## Runtime
### Basic setup

```sh
$ cd "your folder"
$ npm start [options]
```

Check the dedicated section for the description of the options

Written by David Robertaud for IBM. Software designed and coded by David Robertaud

