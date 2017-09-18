/*
Code Desgined and Written by David Robertaud
 */


switch (process.argv[2]) {
case "all":
	require("./app/sayGoodBye")
	require("./app/sayHello.js")
	require("./server/server.js")
	break;
case "bye":
	require("./app/sayGoodBye")
	require("./server/server.js")
	break
case "hello":
	require("./app/sayHello.js")
	require("./server/server.js")
	break;
default:
	require("./server/server.js")
}

//In addition each module is depending on the ones under, which makes them load in a backward chain
