
 /*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	esriMap

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: fix the slide toggle and add data, how to use picturemarkersymbol
-------------------------------------------------------------------------------*/
 var map;
 var geocoder;
 var basemapgallery;
 var csv_bottom, csv_top;
 var lineLayer;

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
			 center: [-114,51.1], // longitude, latitude
			 zoom: 13,
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
					//console.log(polyline);
					var lineSymbol = new SimpleLineSymbol(
						SimpleLineSymbol.STYLE_SOLID,
						new Color([0,0,0]),
						1
					);
					var myGraphic = new Graphic(polyline, lineSymbol);
					lineLayer.add(myGraphic);
				}
			}, function (error) {
				console.log("Error: ", error.message);
			}
		);
		map.addLayer(lineLayer);

		csv_bottom = new CSVLayer("data/wells.csv",{
			latitudeFieldName:"w_bottom_lat",
			longitudeFieldName:"w_bottom_lng",
			objectIdField: "w_id",
			layerId:1});
		var darkRed = new Color([88, 0, 0]); // hex is #ff4500
		var markerBottom = new SimpleMarkerSymbol("solid", 15, null, darkRed);
		var rendererBottom = new SimpleRenderer(markerBottom);
		csv_bottom.setRenderer(rendererBottom);

		csv_top = new CSVLayer("data/wells.csv",{
			latitudeFieldName:"w_top_lat",
			longitudeFieldName:"w_top_lng",
			objectIdField: "w_id",
			layerId:2});
		var darkGoldenrod = new Color([184, 134, 11, 1]); // hex is #ff4500
		var markerTop = new SimpleMarkerSymbol("solid", 10, null, darkGoldenrod);
		var rendererTop = new SimpleRenderer(markerTop);
		csv_top.setRenderer(rendererTop);

		csv_bottom.on("update-end",function(){
			var graphics = graphicsUtils.graphicsExtent(csv_bottom.graphics);
			map.setExtent(graphics);
		});
		map.addLayer(csv_bottom);
		map.addLayer(csv_top);
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
