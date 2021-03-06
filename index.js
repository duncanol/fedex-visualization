var width = 1600,
    height = 1000;

var force = d3.layout.force()
    .charge(-30)
    .linkDistance(30)
    .size([width, height]);

var zoom = d3.behavior.zoom().size([width, height]);
zoom.previousScale = zoom.scale();
zoom.scaleChanged = function() {
  return zoom.scale() != zoom.previousScale;
};

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom.on("zoom", redraw)).on("dblclick.zoom", null);

var nodeGroup = svg.append('g');
var textGroup = svg.append('g');

function redraw() {
  
  if (zoom.scaleChanged()) {
    svg.selectAll("g")
      .transition()
      .duration(100)
      .attr("transform", 
        "translate(" + d3.event.translate + ") " +
        "scale(" + d3.event.scale + ")");
  } else {
    svg.selectAll("g")
      .attr("transform", 
        "translate(" + d3.event.translate + ") " +
        "scale(" + d3.event.scale + ")");
  }
  zoom.previousScale = d3.event.scale;
  
}

d3.json("test.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links);

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  });

  setTimeout(function() {
    graph.nodes.push({"id": 4, "name": "New Node", "group": 4}); 
    graph.links.push({"source": 0, "target": 3, "value": 4}); 
    node = nodeGroup.selectAll(".node")
    link = nodeGroup.selectAll(".link")
    start();
  }, 3000);

  var start = function() {
    
    link = nodeGroup.selectAll(".link")
      .data(graph.links);

    node = nodeGroup.selectAll(".node")
      .data(graph.nodes);

    link.enter()
      .append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    link.exit()
      .remove();

    // node.enter()
    //   .append("circle")
    //     .attr("id", function(d) { return d.id; })        
    //     .attr("class", function(d) { return "node node_" + d.id; })
    //     .attr("r", function(d) { 
    //       return d.name == 'Technology Strategy Board Network' ? 10 : 5; 
    //     })
    //     .style("fill", function(d) { return color(d.group); })
    //     .call(force.drag);


    node.enter()
      .append("circle")
      // .append("svg:image")
      //   .attr("xlink:href", "/images/1394715037_location-24.svg")
        .attr("id", function(d) { return d.id; })        
        .attr("class", function(d) { return "node node_" + d.id; })
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
        .call(force.drag);


    node.exit()
      .remove();


    node.on("dblclick", function(d) {
      textGroup
      .append("text")
      .attr("x", d.x - 10)
      .attr("y", d.y + 20)
      .text("Selected!")
    });

    node.on("mouseup", function(d) {
      textGroup
      .append("text")
      .attr("x", d.x - 10)
      .attr("y", d.y + 20)
      .text("Dragged!")
    });

    node.each(function(thisData) {
      var thisD3Node = nodeGroup.select(".node_" + thisData.id);
      thisData.originalR = thisD3Node.attr("r");
    });

    node.on("mouseover", function(thisData) {
      
      var thisNode = this;
      var thisD3Node = nodeGroup.select(".node_" + thisData.id);

      textGroup
        .selectAll("text")
        .remove();

      textGroup
        .append("text")
          .text(thisData.name)
            .attr("x", thisData.x + 10)
            .attr("y", thisData.y - 10)
      
      thisD3Node
        .transition()
        .attr("r", thisData.originalR * 2);

    });


    node.on("mouseout", function(thisData) {

      var thisNode = this;
      var thisD3Node = nodeGroup.select(".node_" + thisData.id);

      textGroup
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

    link.on("mouseover", function(d) {
      textGroup
        .selectAll("text")
        .remove();

      var node1 = d.source;
      var node2 = d.target;
      var midX = (node1.x + node2.x) / 2;
      var midY = (node1.y + node2.y) / 2;

      textGroup
        .append("text")
          .text(d.source.name + " to " + d.target.name)
            .attr("x", midX + 10)
            .attr("y", midY - 10)
    });

    force.start();
  };

  start();

});

