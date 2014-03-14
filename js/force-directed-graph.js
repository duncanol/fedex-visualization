ForceDirectedGraph = function(config) {

	this.svg = config.svg;
	this.pane = config.pane;
	this.nodes = [];
	this.links = [];

	this.nodeGroup = this.svg.append('g');
	this.textGroup = this.svg.append('g');

	this.force = d3.layout.force()
	    .charge(-100)
	    .linkDistance(100)
	    .size([this.pane.width, this.pane.height]);

  this.force
    .nodes(this.nodes)
    .links(this.links);
};

ForceDirectedGraph.prototype.addNodes = function(nodes, links) {

	var _this = this;
	
	this.nodes = this.nodes.concat(nodes);
	    
	var edges = [];

	links.forEach(function(e) { 
	    // Get the source and target nodes
	    var sourceNode = _this.nodes.filter(function(n) { return n.rid === e.osource; })[0],
	        targetNode = _this.nodes.filter(function(n) { return n.rid === e.otarget; })[0];

	    // Add the edge to the array
	    edges.push({source: sourceNode, target: targetNode});
	});

	this.links = this.links.concat(edges);

	this.refresh();
};

ForceDirectedGraph.prototype.refresh = function() {

	var nodeGroup = this.nodeGroup;
	var textGroup = this.textGroup;

	var color = d3.scale.category20();

	this.force
    .nodes(this.nodes)
    .links(this.links);

  var link = nodeGroup.selectAll(".link")
    .data(this.links);

  var node = nodeGroup.selectAll(".node")
    .data(this.nodes);

  link.enter()
    .append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  link.exit()
    .remove();

  node.enter()
    // .append("circle")
    .append("svg:image")
      .attr("xlink:href", function(d) {
      	if (d.classname == "User") {
      		return "/images/user.svg";
      	} else if (d.classname == "Group") {
					return "/images/network.svg";
      	} else if (d.classname == "UserGroup") {
					return "/images/usergroup.svg";
      	} else {
					return "/images/org.svg";
      	}
      })
      .attr("id", function(d) { return d.rid; })        
      .attr("class", function(d) { return "node node_" + d.rid; })
      .attr("r", function(d) {
      	if (d.classname == "User") {
      		return 15 + (Math.sqrt(Math.sqrt(d.edgesout)) * 2);
      	} else {
      		return 15 + (Math.sqrt(Math.sqrt(d.edgesin)) * 2);
      	}
      })
      .attr("width", function(d) {
      	if (d.classname == "User") {
      		return 15 + (Math.sqrt(Math.sqrt(d.edgesout)) * 2);
      	} else {
      		return 15 + (Math.sqrt(Math.sqrt(d.edgesin)) * 2);
      	}
      })
      .attr("height", function(d) {
      	if (d.classname == "User") {
      		return 15 + (Math.sqrt(Math.sqrt(d.edgesout)) * 2);
      	} else {
      		return 15 + (Math.sqrt(Math.sqrt(d.edgesin)) * 2);
      	}
      })
      .attr("charge", function(d) {
      	if (d.classname == "User") {
      		return -(Math.sqrt(d.edgesout) * 2);
      	} else {
      		return -(Math.sqrt(d.edgesin) * 2);
      	}
      })
      .style("fill", function(d) { return color(d.group); })
      .call(this.force.drag);


  node.exit()
    .remove();

  node.each(function(thisData) {
    var thisD3Node = nodeGroup.select(".node_" + thisData.rid);
    thisData.originalR = thisD3Node.attr("r");
    thisData.originalWidth = thisD3Node.attr("width");
    thisData.originalHeight = thisD3Node.attr("height");
  });


  this.clickNode(node);
  // this.dblclickNode(node);
  // this.mouseupNode(node);
  this.mouseoverNode(node);
  this.mouseoutNode(node);
  // this.mouseoverLink(link);

  

  this.force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("x", function(d) { return (d.x - d.originalWidth / 2); })
        .attr("y", function(d) { return (d.y - d.originalHeight / 2); });
  });

  this.force.start();
};


ForceDirectedGraph.prototype.clickNode = function(nodes) {
	var _this = this;
	nodes.on("click", function(d) {

	  // if (d.selected) {

	  // } esl
	  d3.json("http://172.30.128.106:8080/node/" + d.rid + "/2",
			function(error, graph) {

				var newNodes = graph.nodes.filter(function(node) {
					return _this.nodes.filter(function(n2) {return n2.rid == node.rid;}).length == 0;
				});

				var newLinks = graph.links.filter(function(link) {
					return _this.links.filter(function(l2) {return l2.rid == link.rid;}).length == 0;
				});

			  _this.addNodes(newNodes, newLinks);
			}
		);
	});
};

// ForceDirectedGraph.prototype.dblclickNode = function(nodes) {
// 	var _this = this;
// 	nodes.on("dblclick", function(d) {
// 	  _this.textGroup
// 	    .append("text")
// 	    .attr("x", d.x - 10)
// 	    .attr("y", d.y + 20)
// 	    .text("Selected!")
//   });
// };


// ForceDirectedGraph.prototype.mouseupNode = function(nodes) {
// 	var _this = this;
// 	nodes.on("mouseup", function(d) {
//   _this.textGroup
//     .append("text")
//     .attr("x", d.x - 10)
//     .attr("y", d.y + 20)
//     .text("Dragged!")
//   });
// };



ForceDirectedGraph.prototype.mouseoverNode = function(nodes) {
	var _this = this;
	nodes.on("mouseover", function(thisData) {
    
    var thisNode = this;
    var thisD3Node = _this.nodeGroup.select(".node_" + thisData.rid);

    _this.textGroup
      .selectAll("text")
      .remove();


    _this.textGroup
      .append("text")
        .text(thisData.name)
          .attr("x", thisData.x + 10)
          .attr("y", thisData.y - 10)
    
    thisD3Node
      .transition()
      .attr("r", thisData.originalR * 2)
      .attr("width", thisData.originalWidth * 2)
      .attr("height", thisData.originalHeight * 2);

  });
};


ForceDirectedGraph.prototype.mouseoutNode = function(nodes) {
	var _this = this;

  nodes.on("mouseout", function(thisData) {

    var thisNode = this;
    var thisD3Node = _this.nodeGroup.select(".node_" + thisData.rid);

    _this.textGroup
	    .selectAll("text")
	    .transition()
	    .duration(500)
	    .style('opacity', 0)
	    .each("end", function() {
	      this.remove();
	    })

    if (thisData.originalR != null) {
      thisD3Node.transition()
        .attr("r", thisData.originalR)
        .attr("width", thisData.originalWidth)
        .attr("height", thisData.originalHeight);
    }
  });
};


// ForceDirectedGraph.prototype.mouseoverLink = function(links) {
// 	var _this = this;

// 	links.on("mouseover", function(d) {
//     _this.textGroup
//       .selectAll("text")
//       .remove();

//     var node1 = d.source;
//     var node2 = d.target;
//     var midX = (node1.x + node2.x) / 2;
//     var midY = (node1.y + node2.y) / 2;

//     _this.textGroup
//       .append("text")
//         .text(d.source.name + " to " + d.target.name)
//           .attr("x", midX + 10)
//           .attr("y", midY - 10)
// 	  });
// };


ForceDirectedGraph.prototype.addPeopleFilter = function() {
	var peopleNodes = this.nodes.filter(function(node) {
		return node.class == "User";
	});

	var peopleLinks = this.links.filter(function(link) {
		return link.source.class == "User" || link.target.class == "User";
	});

	this.removeNodes(peopleNodes, peopleLinks);

};

ForceDirectedGraph.prototype.removeNodes = function(nodesToRemove, linksToRemove) {

	this.nodes = this.nodes.filter(function(node) {
		for (var i = 0; i < nodesToRemove.length; i++) {
			if (node == nodesToRemove) {
				return false;
			}
		}

		return true;
	});

	this.nodes = this.links.filter(function(links) {
		for (var i = 0; i < linksToRemove.length; i++) {
			if (links == linksToRemove) {
				return false;
			}
		}

		return true;
	});

	this.refresh();

};