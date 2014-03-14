ForceDirectedGraph = function(config) {

	this.svg = config.svg;
	this.pane = config.pane;
	this.nodes = [];
	this.links = [];

	this.nodeGroup = this.svg.append('g');
	this.textGroup = this.svg.append('g');

	this.force = d3.layout.force()
	    .charge(-30)
	    .linkDistance(30)
	    .size([this.pane.width, this.pane.height]);

  this.force
    .nodes(this.nodes)
    .links(this.links);
};

ForceDirectedGraph.prototype.addNodes = function(nodes, links) {

	var nodeGroup = this.nodeGroup;
	var textGroup = this.textGroup;

	var color = d3.scale.category20();
	    
	this.nodes = nodes;
	this.links = links;

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
    .append("circle")
    // .append("svg:image")
    //   .attr("xlink:href", "/images/1394715037_location-24.svg")
      .attr("id", function(d) { return d.rid; })        
      .attr("class", function(d) { return "node node_" + d.rid; })
      .attr("r", function(d) { 
        return d.name == 'Technology Strategy Board Network' ? 10 : 5; 
      })
      .attr("width", function(d) { 
        return d.name == 'Technology Strategy Board Network' ? 30 : 15; 
      })
      .attr("height", function(d) { 
        return d.name == 'Technology Strategy Board Network' ? 30 : 15; 
      })
      .style("fill", function(d) { return color(d.group); })
      .call(this.force.drag);


  node.exit()
    .remove();

  node.each(function(thisData) {
    var thisD3Node = nodeGroup.select(".node_" + thisData.rid);
    thisData.originalR = thisD3Node.attr("r");
  });


  this.dblclickNode(node);
  this.mouseupNode(node);
  this.mouseoverNode(node);
  this.mouseoutNode(node);
  this.mouseoverLink(link);

  

  this.force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  });

  this.force.start();
};

ForceDirectedGraph.prototype.dblclickNode = function(nodes) {
	var _this = this;
	nodes.on("dblclick", function(d) {
	  _this.textGroup
	    .append("text")
	    .attr("x", d.x - 10)
	    .attr("y", d.y + 20)
	    .text("Selected!")

	  _this.pane.centre(d.x, d.y);

  });
};


ForceDirectedGraph.prototype.mouseupNode = function(nodes) {
	var _this = this;
	nodes.on("mouseup", function(d) {
  _this.textGroup
    .append("text")
    .attr("x", d.x - 10)
    .attr("y", d.y + 20)
    .text("Dragged!")
  });
};



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
      .attr("r", thisData.originalR * 2);

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
        .attr("r", thisData.originalR);
    }
  });
};


ForceDirectedGraph.prototype.mouseoverLink = function(links) {
	var _this = this;

	links.on("mouseover", function(d) {
    _this.textGroup
      .selectAll("text")
      .remove();

    var node1 = d.source;
    var node2 = d.target;
    var midX = (node1.x + node2.x) / 2;
    var midY = (node1.y + node2.y) / 2;

    _this.textGroup
      .append("text")
        .text(d.source.name + " to " + d.target.name)
          .attr("x", midX + 10)
          .attr("y", midY - 10)
	  });
};