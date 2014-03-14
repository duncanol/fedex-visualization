ZoomablePane = function(config) {


  this.width = config.width;
  this.height = config.height;
  this.domNode = config.domNode;

  var color = d3.scale.category20();

  var zoom = d3.behavior.zoom().size([this.width, this.height]);
  zoom.previousScale = zoom.scale();
  zoom.scaleChanged = function() {
    return zoom.scale() != zoom.previousScale;
  };

  var svg = d3.select(this.domNode)
    .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .call(zoom.on("zoom", redraw)).on("dblclick.zoom", null);

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
  };

  this.svg = svg;
  this.zoom = zoom;
};