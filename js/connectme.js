jQuery(document).ready(function() {

	var pane = new ZoomablePane({
		domNode: '.container-main'
	});

	var svg = pane.svg;
	var zoom = pane.zoom;

	var force = new ForceDirectedGraph({
		svg: svg,
		pane: pane
	});		
	  

	// d3.json("http://172.30.128.106:8080/sql").post("select expand(out(memberof)) from #11:1422", function(error, graph) {
	d3.json("/test.json", function(error, graph) {

	  force.addNodes(graph.nodes, graph.links);

	});
});