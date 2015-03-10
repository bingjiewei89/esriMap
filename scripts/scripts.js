
 /*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	esriMap

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/
 var map;
 var geocoder;
 var basemapgallery;

 require(["esri/map","esri/dijit/Geocoder","esri/dijit/BasemapGallery","esri/arcgis/utils","dojo/parser","dojo/domReady!"],
	 function(Map, Geocoder, BasemapGallery, arcgisUtils, parser ) {

		 parser.parse();

		 map = new Map("map", {
			 basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
			 center: [ -114.08529, 51.05011], // longitude, latitude
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
	 });

 var currentMousePos = {x: -1, y: -1};
 $(document).mousemove(function(event) {
	 currentMousePos.y = event.pageY;

	 if (currentMousePos.y > $(document).height() - 10) {
		 console.log("near bottom");
		 $("#basemap-gallery-dropdown #basemap-gallery-dashboard").slideToggle({
			 direction: "up"
		 }, 100);
	 }
 });
