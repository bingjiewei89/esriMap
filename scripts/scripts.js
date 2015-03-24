
 /*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	esriMap

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: fix the coordinate system, how to use picturemarkersymbol
-------------------------------------------------------------------------------*/
 var map;
 var geocoder;
 var basemapgallery;
 var bottom, surface;
 var link;

 require(["esri/map",
		 "esri/request",
		 "esri/geometry/Polyline",
		 "esri/symbols/SimpleLineSymbol",
		 "esri/graphic",
		 "esri/layers/ArcGISDynamicMapServiceLayer",
		 "esri/layers/FeatureLayer",
		 "esri/layers/CSVLayer",
		 "esri/layers/GraphicsLayer",
		 "esri/Color",
		 "esri/symbols/SimpleMarkerSymbol",
		 "esri/symbols/PictureMarkerSymbol",
		 "esri/renderers/SimpleRenderer",
		 "esri/dijit/Geocoder",
		 "esri/dijit/BasemapGallery",
		 "esri/arcgis/utils",
		 "esri/urlUtils",
		 "esri/graphicsUtils",
		 "dojo/parser",
		 "dojo/domReady!"],
	function(Map,
		 esriRequest,
		 Polyline,
		 SimpleLineSymbol,
		 Graphic,
		 ArcGISDynamicMapServiceLayer,
		 FeatureLayer,
		 CSVLayer,
		 GraphicsLayer,
		 Color,
		 SimpleMarkerSymbol,
		 PictureMarkerSymbol,
		 SimpleRenderer,
		 Geocoder,
		 BasemapGallery,
		 arcgisUtils,
		 urlUtils,
		 graphicsUtils,
		 parser ) {

		 parser.parse();

		 map = new Map("map", {
			 basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
			 center: [-110.8818,57.2218], // longitude, latitude
			 zoom: 15,
			 sliderPosition: "bottom-right"
		 });

		 geocoder = new Geocoder({
			 map: map,
			 autoComplete: true,
			 arcgisGeocoder: {
				 name: "Esri World Geocoder",
				 suffix: " Calgary, AB"
			 }
		 },"search");
		 geocoder.startup();

		 basemapgallery = new BasemapGallery({
			 showArcGISBasemaps: true,
			 map: map
		 },"basemap-gallery");
		 basemapgallery.startup();
		 basemapgallery.on("error",function(msg){
			 console.log("basemap gallery error: ",msg);
		 });
/*
		//Line graphics representing the line connecting the surface and bottom well locations
		 lineLayer = new GraphicsLayer();

		var request = esriRequest({
			url: "data/wellsjson.json",
			handleAs: "json"
			});
		request.then(
			function (data){
				for(var i = 0; i < data.length; i++){
					var topLatitude = data[i]["w_top_lat"];
					var topLongitude = data[i]["w_top_lng"];
					var bottomLatitude = data[i]["w_bottom_lat"];
					var bottomLongitude = data[i]["w_bottom_lng"];
					var polyline = new Polyline([[topLongitude,topLatitude],[bottomLongitude,bottomLatitude]]);
					var lineSymbol = new SimpleLineSymbol(
						SimpleLineSymbol.STYLE_SOLID,
						new Color([0,0,0]), //black
						1 //line size
					);
					var myGraphic = new Graphic(polyline, lineSymbol);
					lineLayer.add(myGraphic);
				}
			}, function (error) {
				console.log("Error: ", error.message);
			}
		);
		map.addLayer(lineLayer);

		//well bottom locations
		csv_bottom = new CSVLayer("data/wells.csv",{
			latitudeFieldName:"w_bottom_lat",
			longitudeFieldName:"w_bottom_lng",
			objectIdField: "w_id",
			layerId:1});

		//simple marker symbols for well underground locations
		//var darkRed = new Color([88, 0, 0]); // hex is #ff4500
		//var markerBottom = new SimpleMarkerSymbol("solid", 15, null, darkRed);
		//var rendererBottom = new SimpleRenderer(markerBottom);

		//picture marker symbols for well underground locations
		var markerBottom = new PictureMarkerSymbol("resources/red-pin.png", 20, 30);
		markerBottom.setOffset(0,13);
		//console.log(markerBottom);
		var rendererBottom = new SimpleRenderer(markerBottom);
		//csv_bottom.setRenderer(rendererBottom);

		csv_top = new CSVLayer("data/wells.csv",{
			latitudeFieldName:"w_top_lat",
			longitudeFieldName:"w_top_lng",
			objectIdField: "w_id",
			layerId:2});

		//simple marker symbols for well surface locations
		//var darkGoldenrod = new Color([184, 134, 11, 1]); // hex is #ff4500
		//var markerTop = new SimpleMarkerSymbol("solid", 10, null, darkGoldenrod);
		//var rendererTop = new SimpleRenderer(markerTop);

		//picture marker symbols for well surface locations
		var markerTop = new PictureMarkerSymbol("resources/top-red-marker.png", 10, 10);
		var rendererTop = new SimpleRenderer(markerTop);
		csv_top.setRenderer(rendererTop);

		csv_top.on("update-end",function(){
			var graphics = graphicsUtils.graphicsExtent(csv_top.graphics);
			map.setExtent(graphics);
		});
		//map.addLayer(csv_bottom);
		map.addLayer(csv_top);
*/
		/*
		//picture marker symbols for well underground locations
		var markerBottom = new PictureMarkerSymbol("resources/red-pin.png", 20, 30);
		//markerBottom.setOffset(0,13);
		var rendererBottom = new SimpleRenderer(markerBottom);

		//picture marker symbols for well surface locations
		var markerTop = new PictureMarkerSymbol("resources/top-red-marker.png", 10, 10);
		var rendererTop = new SimpleRenderer(markerTop);
*/
		bottom = new FeatureLayer("http://localhost:6080/arcgis/rest/services/test/Petro/MapServer/0");
		surface = new FeatureLayer("http://localhost:6080/arcgis/rest/services/test/Petro/MapServer/1");
		link = new FeatureLayer("http://localhost:6080/arcgis/rest/services/test/Petro/MapServer/2");

		//bottom.setRenderer(rendererBottom);
		//surface.setRenderer(rendererTop);

		map.addLayer(link);
		map.addLayer(surface);
		map.addLayer(bottom);

	 });

/*
 require(["esri/request",
 		 "esri/geometry/Polyline",
	 	 "esri/graphic"],
	 function(esriRequest,
	 	Polyline,
	 	Graphic) {
		var request = esriRequest({
			url: "data/wellsjson.json",
			handleAs: "json"
		});
		request.then(
			function (data){
				for(var i = 1; i <= data.length; i++){
					//console.log(data[i]["w_top_lat"]);
					//console.log(data[i]["w_top_lng"]);
					var topLatitude = data[i]["w_top_lat"];
					var topLongitude = data[i]["w_top_lng"];
					var bottomLatitude = data[i]["w_bottom_lat"];
					var bottomLongitude = data[i]["w_bottom_lng"];
					var polyline = new Polyline([topLongitude,topLatitude],[bottomLongitude,bottomLatitude]);
					var myGraphic = new Graphic(polyline);
					map.graphics.add(myGraphic);
				}
			}, function (error) {
					console.log("Error: ", error.message);
			}
		);
	});*/

 /*
 // Highlight wells change the color to blue
 require(["esri/map",
		 "esri/request",
		 "esri/geometry/Polyline",
		 "esri/symbols/SimpleLineSymbol",
		 "esri/graphic",
		 "esri/layers/CSVLayer",
		 "esri/layers/GraphicsLayer",
		 "esri/Color",
		 "esri/symbols/SimpleMarkerSymbol",
		 "esri/symbols/PictureMarkerSymbol",
		 "esri/renderers/SimpleRenderer",
		 "esri/dijit/Geocoder",
		//"esri/dijit/BasemapGallery",
		 "esri/tasks/query",
		"esri/arcgis/utils",
		"esri/urlUtils",
		"esri/graphicsUtils",
		"dojo/parser",
		"dojo/domReady!"],
	 function(Map,
		 esriRequest,
		 Polyline,
		 SimpleLineSymbol,
		 Graphic,
		 CSVLayer,
		 GraphicsLayer,
		 Color,
		 SimpleMarkerSymbol,
		 PictureMarkerSymbol,
		 SimpleRenderer,
		 Geocoder,
		//BasemapGallery,
		 Query,
		arcgisUtils,
		urlUtils,
		graphicsUtils,
		parser ) {
		 var markerBottomHightlighted = new PictureMarkerSymbol("resources/blue-pin.png", 20, 30);
		 markerBottomHightlighted.setOffset(0,13);
		 var rendererBottomHighlighted = new SimpleRenderer(markerBottomHightlighted);
		 csv_bottom.setRenderer(rendererBottomHighlighted);

		 var markerTopHightlighted = new PictureMarkerSymbol("resources/top-blue-marker.png", 10, 10);
		 var rendererTopHightlighted = new SimpleRenderer(markerTopHightlighted);
		 csv_top.setRenderer(rendererTopHightlighted);

		 console.log(map.graphics);

		 var query = new Query();

	 }
	 );
	 */