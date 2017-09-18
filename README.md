# Scratch
Server made from scratch with multiple tools

# Database Description

# Main Features
Description of the server and code implementations
## Options
Different options are available for the runtime, each includes the ones under

| Option | DESCTIPTION |
| --- | --- |
| complete | add all the different libraries |
| server | launches only the server and router |
| default | Run the server |

## Event based architecture
The server is mainly based on the event architecture which means that most of the links between function is not declared in the code but after the first load.
For example, A and B are functions and B needs the data returned by A. A classic architecture would be to write in the code
```
 A(parameter,function(data){
    b(data)
 }
```
With the event based system, B has to call the event manager of A to register to a particular event with a function. When A will trigger the event, it will automatically call the function registered by B. 
This architecture makes all the modules independent and unaware of the rest of the process. Therefore it is possible to specify options when the server is launched. For example, if the remote logger system is not load, no log function will be registered to any of the event but the server will still do its job. On the opposite, if it is loaded the events with a log function registered will create a log message. 
On this server, the leaderboard manager and the logger manager are the two modules listening to other modules.
### Events
The event object offers one function to register to event (defined or not) and one to trigger the event. Each parameter put in the trigger will by passed as parameter to all the functions registered.
On this server only the object emitting the event has access to the emit function thank to a cache system.
### Middlewares
The middleware is an event which waits for all the listeners to finish their executions. It is achieved by offering to all the listener a "next" function, when all the next where called the emitter of the middleware knows it can continue its own execution. 
If any of the listener calls the next function with a parameter, the emitter will treat it as an error passed and act accordingly.
On this server only the object emitting the middleware event has access to the emit function thank to a cache system.
# Discussion

# Installation
The NodeJS version used is 6.9.5
To install all the server run the following command:
```sh
$ cd "Exercice Events"
$ npm install
```
# Commands
Here is describe all the commands needed to run the server with its options
## Runtime
### Basic setup

```sh
$ cd "Advance Server"
$ npm start [options]
```

Check the dedicated section for the description of the options
