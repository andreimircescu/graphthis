var chai = require("chai");
var expect = chai.expect;

var graphthis = require("../lib/graphthis.js");
var endpointType = graphthis.endpointType;
describe("graphthis", function() {
	it("Checks if it can create and add 2 nodes to the graph", function() {
		var graph = new graphthis.graph("Test Graph");
		var nodeA = new graphthis.node("nodeA",5,null);
		var nodeB = new graphthis.node("nodeB",10,null);
		graph.addNode(nodeA);
		graph.addNode(nodeB);
		expect(graph.nodeList.length).to.equal(2);
	});
});

describe("graphthis", function() {
	it("Checks if we can create an edge between 2 nodes", function() {
		var graph = new graphthis.graph("Test Graph");
		var nodeA = new graphthis.node("nodeA",5,null);
		var nodeB = new graphthis.node("nodeB",10,null);
		edge = graph.createEdge(nodeA,nodeB,"EdgeLabel", 10);
		//check if nodeA is originate
		expect(edge.getEndpointType(nodeA)).to.equal(endpointType.originator);
		expect(edge.getEndpointType(nodeB)).to.equal(endpointType.destination);
	});
});

describe("graphthis", function() {
	it("Checks if addNodes work", function() {
		var graph = new graphthis.graph("Test Graph");
		var nodeA = new graphthis.node("nodeA",5,null);
		var nodeB = new graphthis.node("nodeB",10,null);
		var nodeC = new graphthis.node("nodeC",15,null);
		graph.addNodes(nodeA,nodeB,nodeC);
		expect(graph.nodeList.length).to.equal(3);

	});
});

describe("graphthis", function() {
	it("Checks if addGroup works", function() {
		var graph = new graphthis.graph("Test Graph");
		var nodeA = new graphthis.node("nodeA",5,null);
		var nodeB = new graphthis.node("nodeB",10,null);
		var nodeC = new graphthis.node("nodeC",15,null);
		nodeA.addGroup("group1");
		nodeB.addGroup("group1");
		nodeC.addGroup("group2");
		
		graph.addNodes(nodeA,nodeB,nodeC);
		expect(graph.getNodesByGroup("group1").length).to.equal(2);
		expect(graph.getNodesByGroup("group2").length).to.equal(1);

	});
});

describe("graphthis", function() {
	it("Checks if adjacent works", function() {
		var graph = new graphthis.graph("Test Graph");
		var nodeA = new graphthis.node("nodeA",5,null);
		var nodeB = new graphthis.node("nodeB",10,null);
		var nodeC = new graphthis.node("nodeC",15,null);
		nodeA.addGroup("group1");
		nodeB.addGroup("group1");
		nodeC.addGroup("group2");
		graph.addNodes(nodeA,nodeB,nodeC);

		graph.createEdge(nodeA,nodeB,"EdgeLabel", 10);
		graph.createEdge(nodeB,nodeC,"EdgeLabel2", 20);
		expect(graph.adjacent(nodeA,nodeB)).to.equal(true);
		expect(graph.adjacent(nodeB,nodeC)).to.equal(true);
		expect(graph.adjacent(nodeA,nodeC)).to.equal(false);

	});
});

describe("graphthis", function() {
	it("Checks if neighbors works", function() {
		var graph = new graphthis.graph("Test Graph");
		var nodeA = new graphthis.node("nodeA",5,null);
		var nodeB = new graphthis.node("nodeB",10,null);
		var nodeC = new graphthis.node("nodeC",15,null);
		nodeA.addGroup("group1");
		nodeB.addGroup("group1");
		nodeC.addGroup("group2");
		graph.addNodes(nodeA,nodeB,nodeC);

		graph.createEdge(nodeA,nodeB,"EdgeLabel", 10);
		graph.createEdge(nodeB,nodeC,"EdgeLabel2", 20);
		graph.createEdge(nodeB,nodeA,"EdgeLabel3", 30);
		
		expect(graph.neighbors(nodeA).length).to.equal(1);
		expect(graph.neighbors(nodeB).length).to.equal(2);



	});
});

describe("graphthis", function() {
	it("complete test 1", function() {
		var graph = new graphthis.graph("Test Graph");
		var nodeA = new graphthis.node("nodeA",5,null);
		var nodeB = new graphthis.node("nodeB",10,null);
		var nodeC = new graphthis.node("nodeC",15,null);
		var nodeD = new graphthis.node("nodeD",15,null);
		var nodeE = new graphthis.node("nodeE",15,null);
		var nodeF = new graphthis.node("nodeF",5,null);
		var nodeG = new graphthis.node("nodeG",10,null);
		var nodeH = new graphthis.node("nodeH",15,null);
		var nodeI = new graphthis.node("nodeI",15,null);
		var nodeJ = new graphthis.node("nodeJ",15,null);
		graph.addNodes(nodeA,nodeB,nodeC,nodeD, nodeE,nodeF);
		graph.addNodes(nodeG,nodeH,nodeI,nodeJ);
	        
		graph.createEdge(nodeA,nodeB,"EdgeLabel", 10);
		graph.createEdge(nodeB,nodeC,"EdgeLabel2", 20);
		graph.createEdge(nodeB,nodeA,"EdgeLabel3", 30);
		graph.createEdge(nodeA,nodeA,"EdgeLabel3", 30);
		graph.createEdge(nodeA,nodeH,"EdgeLabel3", 30);

		graph.addGroupToNodes("group1", nodeA, nodeB, nodeC);
		graph.addGroupToNodes("group2", nodeA, nodeB, nodeC);
		graph.addGroupToNodes("group3", nodeG, nodeJ, nodeI,nodeA);

		graph.getNodesByGroup("group1");
		expect(graph.neighbors(nodeA).length).to.equal(2);
		expect(graph.neighbors(nodeB).length).to.equal(2);

		expect(graph.getNodesByGroup("group1").length).to.equal(3);
		expect(graph.getNodesByGroup("group2").length).to.equal(3);
		expect(graph.getNodesByGroup("group3").length).to.equal(4);

	});
});
