"use strict"
//edge and endpoints

//we will use an edge object which contains 2 endpoints(originator and destination).
//this is different from many other implementations since each node can calculate it's own
//in or out ratio

var edge = function(nodeA, nodeB, label) {
	this.originator  = new originatorEndpoint(this, nodeA);
	this.destination = new destinationEndpoint(this, nodeB);
	this.label = label;
}

var endpoint = function(edge) {
	this.edge = edge;
}


var originatorEndpoint = function(edge, node) {
	endpoint.call(edge);
	this.node = node;
}

var destinationEndpoint = function(edge, node) {
	this.node = node;
}

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
	this._asDestinationEndpoints = [];
	this._asOriginatorEndpoints = [];

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
node.prototype.addDestinationEndpoint = function(destination) {
	if(!(destination instanceof destinationEndpoint)) {
		console.error("destination is not of destinationEndpoint type");
		return;
	}
	this._asDestinationEndpoints.push(destination);
}

//maybe make them privileged method ?
node.prototype.addOriginatorEndpoint = function(originator) {
	if(!(originator instanceof originatorEndpoint)) { 
		console.error("destination is not of originatorEndpoint type");
		return;
	}
	this._asOriginatorEndpoints.push(originator);
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

graph.prototype.createEdge = function(nodeA, nodeB, edgeLabel) {
	//create an edge in direction A->B;
	var _edge = new edge(nodeA, nodeB, edgeLabel);
	//adding to the graph edge list
	this.edgeList.push(_edge);

	//adding for each node;
	nodeA.addOriginatorEndpoint(_edge.originator);
	nodeB.addDestinationEndpoint(_edge.destination);
}

graph.prototype.addToGroup = function(groupName, nodes) {
	for(var i =0;i<nodes.length ;i++) {
		nodes[i].addGroup(groupName);
	}
}

graph.prototype.getNodesByGroup = function(groupName) {
	var nodeList = [];
	for(var i = 0;i<this.nodeList.length;i++) {
		node = this.nodeList[i];
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

module.exports.graph = graph;
module.exports.node = node;