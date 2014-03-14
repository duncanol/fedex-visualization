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
	  

	d3.json("http://172.30.128.106:8080/node/11_5/2",
		function(error, graph) {
		// d3.json("/test2.json", function(error, graph) {
		  force.addNodes(graph.nodes, graph.links);
		}
	);

	// d3.json("http://172.30.128.106:8080/node/rid/depth")
	

	jQuery('#people-toggle').click(function() {
		var button = jQuery(this);
		if (button.hasClass('btn-success')) {
			button.removeClass('btn-success');
			button.addClass('btn-default');
			force.removePeopleFilter();
		} else {
			button.addClass('btn-success');
			button.removeClass('btn-default');
			force.addPeopleFilter();
		}
	});


});