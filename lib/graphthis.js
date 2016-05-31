"use strict"
//edge and endpoints

//we will use an edge object which contains 2 endpoints(originator and destination).
//this is different from many other implementations since each node can calculate it's own
//in or out ratio

var edge = function(nodeA, nodeB, label, value) {
	this.originator  = new originatorEndpoint(this, nodeA);
	this.destination = new destinationEndpoint(this, nodeB);
	this.label = label;
	this.value = value;
}

var endpoint = function(edge) {
	var edge = edge;
	//returning the parent as a private property to avoid
	//circular reference
	this.getParent = () => {return edge;};
}

var originatorEndpoint = function(edge, node) {
	endpoint.call(this,edge);
	this.node = node;
}
originatorEndpoint.prototype = Object.create(endpoint.prototype);
originatorEndpoint.prototype.constructor = originatorEndpoint;

var destinationEndpoint = function(edge, node) {
	endpoint.call(this,edge);
	this.node = node;
}
destinationEndpoint.prototype = Object.create(endpoint.prototype);
destinationEndpoint.prototype.constructor = destinationEndpoint;
//the node class will manadatory have a name( which can be NOT unique if you really want)
//also it can have a value( which is pretty abstract since differs more of a context) and a
//payload which should be a placeholder for any kind of information you want to store on 
//this object(such as a thread property )
//another property of the node class are the groups . A node can be part of multiple groups
//which can be used by the graph to create collections based on specific groups
var node = function(name, value, payload){
	this.name = name;
	this.value = value;
	this.payload = payload;
	this.groups = [];
	
	//privates
	this.asOriginateEndpointFor = [];
	this.asDestinationEndpointFor = [];
	
}

node.prototype.addGroup = function(groupName) {
	if(typeof groupName !== 'string') { 
		console.error("groupName is not of string type");
		return;
	}
	if(this.groups.indexOf(groupName) < 0)
	{
		this.groups.push(groupName);
	}
}
//maybe make them privileged method ?
node.prototype.addEndpointAsOriginatorForDestination = function(originator) {
	this.asOriginateEndpointFor.push(originator);
}

node.prototype.addEndpointAsDestinationForOriginator = function(destination) {
	this.asDestinationEndpointFor.push(destination);
}

// the actual graph which holds the nodes and the edges
// more info for classification to come
var graph = function(name) {
	this.name = name;

	//maybe make them private
	this.nodeList = [];
	this.edgeList = [];
}


graph.prototype.addNode = function(theNode) {
	if(!(theNode instanceof node)) { 
		console.error("node is not of node type");
		return;
	}
	this.nodeList.push(theNode);
}

graph.prototype.createEdge = function(nodeA, nodeB, edgeLabel, value) {
	//create an edge in direction A->B;
	var _edge = new edge(nodeA, nodeB, edgeLabel, value);
	//adding to the graph edge list
	this.edgeList.push(_edge);

	nodeA.addEndpointAsOriginatorForDestination(_edge.destination);
	nodeB.addEndpointAsDestinationForOriginator(_edge.originator);
	return _edge;
}

graph.prototype.addToGroup = function(groupName, nodes) {
	for(var i =0;i<nodes.length ;i++) {
		nodes[i].addGroup(groupName);
	}
}

graph.prototype.adjacent = function(nodeA, nodeB) {
	//we will just check if there is an endpoint(destination or originator) in nodeA. This should be enough
	//check if we have A->B
	for(var i =0;i<nodeA.asOriginateEndpointFor.length;i++) {
		if(nodeA.asOriginateEndpointFor[i].node === nodeB) {
			return true;
		}
	}

	//B->A
	for(var i =0;i<nodeA.asDestinationEndpointFor.length;i++) {
		if(nodeA.asDestinationEndpointFor[i].node === nodeB) {
			return true;
		}

	}
	return false;
}

graph.prototype.neighbors = function(nodeA) {
	//we need to return the unique list of nodes since there can be 
	//the multi edge case

	//concating the originators and destinations into a big array and after converting to set to remove possible duplicates and back to array

	var uniqueArray= Array.from(new Set([].concat(nodeA.asOriginateEndpointFor, nodeA.asDestinationEndpointFor)));
	//strip the array to return only nodes
	var nodeArray = [];
	for(var i=0;i<uniqueArray.length;i++) {
		nodeArray.push(uniqueArray[i].node);
	}
	return nodeArray
} 

graph.prototype.getNodesByGroup = function(groupName) {
	var nodeList = [];
	for(var i = 0;i<this.nodeList.length;i++) {
		var node = this.nodeList[i];
		for(var j =0;j<node.groups.length;j++) {
			var group = node.groups[j];
			if(group === groupName) {
				nodeList.push(node);
				//found it; let's break
				break;
			}
		}
	}
	return nodeList;
}

graph.prototype.addNodes = function() {
	for(var i =0;i<arguments.length;i++) {
		this.addNode(arguments[i]);
	}
}

module.exports.graph = graph;
module.exports.node = node;