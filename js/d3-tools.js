ZoomablePane = function(config) {

  var width = config.width,
    height = config.height;

  var color = d3.scale.category20();

  var zoom = d3.behavior.zoom().size([width, height]);
  zoom.previousScale = zoom.scale();
  zoom.scaleChanged = function() {
    return zoom.scale() != zoom.previousScale;
  };

  var svg = d3.select("body")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
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
  this.width = config.width;
  this.height = config.height;

};