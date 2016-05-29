# graphthis
graphthis is practical library which stores information in graph format


## Features
 - Nodes can be part of groups.
 - Nodes have name and value
 - Nodes have payload. The payload was created to carry the application context for that specific node. In conjuction with groups, it provides more flexibility.
All nodes from a group, have a specific set of payload

## Usage
```
var graphthis = require("./graphthis");

var graph = new graphthis.graph("Test Graph");
var nodeA = new graphthis.node("nodeA",5,null);
var nodeB = new graphthis.node("nodeB",5,null); 

graph.addNode(nodeA);
graph.addNode(nodeB);

//creating an edge
graph.createEdge(nodeA,nodeB, "labelME");

//add a set of nodes to a group
graph.addToGroup("Villains", [nodeA,nodeB]);

//getters for node and edge lists
graph.nodeList;
graph.edgeList;

//node list filtered by group
var nodeList = graph.getNodesByGroup("groupName");


```

## Caveat
Each edge contains an originator and an destination object. These objects are set on the appropiate nodes.
So given an edge A --> B, node A will have an originatorEndpoint object and b will have an destinationEndpoint object.
Each endpoint has a reference to the actual edge. I did this to be easy to calculate the node weight(outbound - inbound)
and also distribute the information to nodes.

## Future

1. add all the basic operations for [graphs](https://en.wikipedia.org/wiki/Graph_%28abstract_data_type%29)
2. add support for multiple types of graphs and.


