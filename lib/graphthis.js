"use strict"
//edge and endpoints

//we will use an edge object which contains 2 endpoints(originator and destination).
//this is different from many other implementations since each node can calculate it's own
//in or out ratio
const endpointType = {destination:"destination", originator:"originator", none:"none"};


//exceptions
function InvalidNode(){};
var edge = function(nodeA, nodeB, label, value) {
	this.originator  = new originatorEndpoint(this, nodeA);
	this.destination = new destinationEndpoint(this, nodeB);
	this.label = label;
	this.value = value;
}
edge.prototype.getEndpointType = function(nodeA) {
	if(this.originator.node === nodeA) {
		return endpointType.originator;
	}
	else if(this.destination.node === nodeA)
	{
		return endpointType.destination;
	}
	else
	{
		return endpointType.none;
	}
}

edge.prototype.getBothNodes = function() {
    return [this.originator.node, this.destination.node];
}

edge.prototype.getOther = function(nodeA) {
    var _endpointType = this.getEndpointType(nodeA);
    if(_endpointType === endpointType.originator) {
        return this.destination.node;
    }
    else if(_endpointType === endpointType.destination) {
        return this.originator.node;
    }
    else {
        //corner case, somehow nodeA does not belong to the Edge
        throw new InvalidNode();
    }

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
	
	this.edges = []
	
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
node.prototype.addEdge = function(edge) {
	this.edges.push(edge);
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

	//adding the edge to the coresponding nodes
	nodeA.addEdge(_edge);
	nodeB.addEdge(_edge);


	return _edge;
}

graph.prototype.addToGroup = function(groupName, nodes) {
	for(var i =0;i<nodes.length ;i++) {
		nodes[i].addGroup(groupName);
	}
}

graph.prototype.adjacent = function(nodeA, nodeB) {
    //we will iterate over nodeA edges and we will check the endpoint Type of B
    for(var i=0;i<nodeA.edges.length;i++){
        var edge = nodeA.edges[i];
        var _endpointType = edge.getEndpointType(nodeB);
        if(_endpointType!==endpointType.none) {
           return true;
        }
    }
    //we didn't find anything
    return false;
}

graph.prototype.neighbors = function(nodeA) {
    debugger;
    var _returnList =[];
    //add both nodes of the edge to the return list, we don't care at this moment
    for(var i=0;i<nodeA.edges.length;i++) {
       var _other = nodeA.edges[i].getOther(nodeA); 
       if(_returnList.indexOf(_other) < 0) {
           _returnList.push(_other);
       }
    }
    return _returnList;

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
module.exports.endpointType = endpointType;
