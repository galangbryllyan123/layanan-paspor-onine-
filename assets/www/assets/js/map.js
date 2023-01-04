var map,
    params;
require([
    "dojo/dom",
    "dojo/_base/array",
    "esri/Color",
    "dojo/parser",
    "dijit/registry",
    "esri/urlUtils",
    "esri/map",
    "esri/lang",
    "esri/graphic",
    "esri/InfoTemplate",
    "esri/layers/GraphicsLayer",
    "esri/renderers/SimpleRenderer",
    "esri/geometry/Point",
    "esri/layers/FeatureLayer",
    "esri/tasks/FeatureSet",
    "esri/tasks/ClosestFacilityTask",
    "esri/tasks/ClosestFacilityParameters",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/layers/GraphicsLayer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/webMercatorUtils",
    "esri/dijit/BasemapGallery",
    "esri/arcgis/utils",
    "esri/tasks/ClosestFacilityTask",
    "esri/tasks/ClosestFacilityParameters",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/topic"

], function (dom, array, Color, parser, registry, urlUtils, Map, esriLang, Graphic, InfoTemplate, GraphicsLayer, SimpleRenderer, Point, FeatureLayer, FeatureSet, ClosestFacilityTask, ClosestFacilityParameters, SimpleMarkerSymbol, SimpleLineSymbol, GraphicsLayer, PictureMarkerSymbol, webMercatorUtils, BasemapGallery, arcgisUtils, ClosestFacilityTask, ClosestFacilityParameters, Query, QueryTask, topic) {
    var incidentsGraphicsLayer,
        routeGraphicLayer,
        closestFacilityTask,
        listKanim;

    listKanim = [];
    parser.parse();

    var url = {
        map_service_kanim: "http://43.252.8.101:6080/arcgis/rest/services/imigrasi/kanim/FeatureServer/0",
        route_service: "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/Clo" +
            "sestFacility_World",
        batas_provinsi: "http://43.252.8.101:6080/arcgis/rest/services/Telkom/indonesia_provinsi/FeatureS" +
            "erver/0",
        json_service_kanim: "https://antrian.imigrasi.go.id/Antrian/api/listoffices.jsp"
    }

    urlUtils.addProxyRule({ urlPrefix: "route.arcgis.com", proxyUrl: "bridge/" });

    var initial_location = {
        indonesia: {
            longitude: 117.924227,
            latitude: -1.492326,
            zoom: 5
        },
        gps: {
            longitude: 106.824347, // akan dioverwrite oleh gps
            latitude: -6.180448, // akan dioverwrite oleh gps
            zoom: 15,
            x: 0, // akan dioverwrite oleh gps
            y: 0 // akan dioverwrite oleh gps
        }
    }

    var map = new Map("map", {
        basemap: "osm",
        center: [
            initial_location.indonesia.longitudem, initial_location.indonesia.latitude
        ],
        zoom: initial_location.indonesia.zoom,
        showInfoWindowOnClick: true
    });

    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map
    }, "basemapGallery");
    basemapGallery.startup();
    basemapGallery.on("error", function (msg) {
        console.log("basemap gallery error:  ", msg);
    });

    var infoContent = "<table style='border:none;padding:5px;' cellspacing='0px'>";
    infoContent += "<tr>";
    infoContent += "<td >Nama Kantor Imigrasi";
    infoContent += "</td>";
    infoContent += "<td >:";
    infoContent += "</td>";
    infoContent += "<td >${mo_name}";
    infoContent += "</td>";
    infoContent += "</tr>";

    infoContent += "<tr>";
    infoContent += "<td colspan='3'><hr />  ";
    infoContent += "</td>";
    infoContent += "</tr>";

    infoContent += "<tr>";
    infoContent += "<td>Alamat";
    infoContent += "</td>";
    infoContent += "<td>:";
    infoContent += "</td >";
    infoContent += "<td>${mo_address}";
    infoContent += "</td>";
    infoContent += "</tr>";

    infoContent += "<tr>";
    infoContent += "<td colspan='3'><hr />  ";
    infoContent += "</td>";
    infoContent += "</tr>";

    infoContent += "<tr>";
    infoContent += "<td>Kelas";
    infoContent += "</td>";
    infoContent += "<td >:";
    infoContent += "</td>";
    infoContent += "<td >${mo_class}";
    infoContent += "</td>";
    infoContent += "</tr>";

    infoContent += "<tr>";
    infoContent += "<td colspan='3'><hr />  ";
    infoContent += "</td>";
    infoContent += "</tr>";

    infoContent += "<tr>";
    infoContent += "<td>Telepon";
    infoContent += "</td>";
    infoContent += "<td>:";
    infoContent += "</td>";
    infoContent += "<td>${mo_telp}";
    infoContent += "</td>";
    infoContent += "</tr>";

    infoContent += "</table>";

    var template = new InfoTemplate("Attributes", infoContent);

    var kanim_layer = new FeatureLayer(url.map_service_kanim, {
        mode: FeatureLayer.MODE_AUTO,
        outFields: ["*"],
        infoTemplate: template
    });

    //Get closes Kanim
    params = new ClosestFacilityParameters();
    params.impedenceAttribute = "Miles";
    params.defaultCutoff = 50; //18.6411;
    params.returnIncidents = false;
    params.returnRoutes = true;
    params.returnDirections = true;

    map.on("layers-add-result", function (evtObj) {
        //return;
        map_getKanimAll();
    });

    function setupRoute() {
        //var map = evtObj.target; ini adalah point GPS
        var incidentPointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 16, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([89, 95, 35]), 2), new Color([130, 159, 83, 0.40]));
        incidentsGraphicsLayer = new GraphicsLayer();
        var incidentsRenderer = new SimpleRenderer(incidentPointSymbol);
        incidentsGraphicsLayer.setRenderer(incidentsRenderer);
        map.addLayer(incidentsGraphicsLayer);
        //************************* End point GPS Route polyline graphic
        routeGraphicLayer = new GraphicsLayer();
        var routePolylineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([89, 95, 35]), 4.0);
        var routeRenderer = new SimpleRenderer(routePolylineSymbol);
        routeGraphicLayer.setRenderer(routeRenderer);
        map.addLayer(routeGraphicLayer);
        // ************************* End Route polyline Graphic Lokasi kanim graphic
        // layer
        var facilities = new FeatureSet();
        //copy feature dari layer kanim
        facilities.features = listKanim.featureSet.features;
        //************************* End Route polyline Graphic

        params.facilities = facilities;
        params.outSpatialReference = map.spatialReference;

        //console.log(listKanim); console.log(facilities);
    }

    // });

    closestFacilityTask = new ClosestFacilityTask(url.route_service);
    params.defaultTargetFacilityCount = 5;

    function clearGraphics() {
        // clear graphics dom.byId("directionsDiv").innerHTML= ""; map.graphics.clear();
        routeGraphicLayer.clear();
    }

    function getObjetKanim(ID_KANIM) {
        console.log(listKanim.featureSet.features.length);
        for (i = 0; i < listKanim.featureSet.features.length; i++) {
            if (listKanim.featureSet.features[i].attributes.mo_id === ID_KANIM) {
                return listKanim.featureSet.features[i];
            }
        }
        return null;
    }

    window.map_LocateToKanim = function (ID_KANIM) {
        if (ID_KANIM != null) {
            objKanim = getObjetKanim(ID_KANIM);
            if (objKanim === null) {
                console.log("Object Kanim ID = " + ID_KANIM + " Tidak ditemukan");
                return;
            } else {
                map.centerAndZoom([
                    objKanim.geometry.x, objKanim.geometry.y
                ], initial_location.gps.zoom);
            }
        }
    }

    window.map_getRouteToKanim = function (ID_KANIM = null) {
        var location = null;
        var objKanim;

        // Jika id kanim null, gunakan semua lokasi kanim , dan cari yang terdekat Jika
        // id kanim tidak null, route ke id kanim yang dituju
        if (ID_KANIM != null) {
            objKanim = getObjetKanim(ID_KANIM);
            if (objKanim === null) {
                console.log("Object Kanim ID = " + ID_KANIM + " Tidak ditemukan");
                return;
            } else {
                //setup param menggunakan id kanim tertentu
                var facilities = new FeatureSet();
                facilities.features = [objKanim];
                params.facilities = facilities;
            }
        } else {
            //setup param menggunakan semua object kanim, cari yang sesuai param 50 miles
            var facilities = new FeatureSet();
            facilities.features = listKanim.featureSet.features;
            params.facilities = facilities;
        }

        var glGPSSymbol = map.getLayer("glGPSSymbol");
        if (glGPSSymbol) {
            location = glGPSSymbol.graphics["0"];
        }

        var features = [];
        features.push(location);
        var incidents = new FeatureSet();
        incidents.features = features;
        params.incidents = incidents;

        //solve
        closestFacilityTask.solve(params, function (solveResult) {
            array
                .forEach(solveResult.routes, function (route, index) {
                    //build an array of route info
                    var attr = array.map(solveResult.directions[index].features, function (feature) {
                        return feature.attributes.text;
                    });
                    var infoTemplate = new InfoTemplate("Attributes", "${*}");

                    route.setInfoTemplate(infoTemplate);
                    route.setAttributes(attr);

                    routeGraphicLayer.add(route);
                    console.log("Route = ");
                    console.log(routeGraphicLayer)
                    // dom.byId("directionsDiv").innerHTML = "Hover over the route to view
                    // directions";
                });

            //display any messages
            if (solveResult.messages.length > 0) {
                // dom.byId("directionsDiv").innerHTML = "<b>Error:</b> " +
                // solveResult.messages[0];
                console.log("Error getting router " + solveResult.messages[0]);
                alert("Error getting route : " + solveResult.messages[0]);
            }
        });
    }

    function map_showPosition(position = null) {
        if (position != null) {
            initial_location.gps.longitude = position.coords.longitude;
            initial_location.gps.latitude = position.coords.latitude;
        }

        map.centerAndZoom([
            initial_location.gps.longitude, initial_location.gps.latitude
        ], initial_location.gps.zoom);

        var xyFromLongLat = webMercatorUtils.lngLatToXY(initial_location.gps.longitude, initial_location.gps.latitude);
        initial_location.gps.x = xyFromLongLat[0];
        initial_location.gps.y = xyFromLongLat[1];

        var pt = new Point(initial_location.gps.x, initial_location.gps.y, map.spatialReference);
        map_drawGPSPSymbol(pt);
    }

    function map_drawGPSPSymbol(pt) {
        var glGPSSymbol = map.getLayer("glGPSSymbol");
        if (!glGPSSymbol) {
            glGPSSymbol = new GraphicsLayer({ id: "glGPSSymbol" });
            map.addLayer(glGPSSymbol);
        }
        glGPSSymbol.clear();

        var symbolPoint = new PictureMarkerSymbol();
        symbolPoint.setHeight(41);
        symbolPoint.setWidth(30);
        symbolPoint.setUrl("../img/locationicon.png");
        var attribute = {
            "Lokasi Anda ": (" " + pt.x + "," + pt.y)
        };
        var graphic = new Graphic(pt, symbolPoint, attribute);
        glGPSSymbol.add(graphic);
        //console.log(glGPSSymbol);
    }

    window.map_geGPStLocation = function () {
        if (navigator.geolocation) {
            navigator
                .geolocation
                .getCurrentPosition(map_showPosition);
        } else {
            console.warn("Geolocation is not supported by this browser.");
            //menggunakan lokasi default di monas.
            map_showPosition(null);
        }
    }

    function map_getProvince(myLocation) {
        //temporary not used
        var queryTask = new QueryTask(url.batas_provinsi);
        var query = new Query();
        query.outFields = ["*"];
        //query.multipatchOption = "xyFootprint";
        query.geometry = myLocation;
        query.returnGeometry = true;
        queryTask.on("complete", map_getProvince_queryTaskExecuteCompleteHandler);
        queryTask.on("error", map_getProvince_queryTaskErrorHandler);
        console.log(query);
        queryTask.execute(query);
    }

    function map_getProvince_queryTaskExecuteCompleteHandler(queryResults) {
        //temporary not used
        console.log("complete", queryResults);
        // Jika sukses, dapatkan semua kanim yang intersect dengan provinsi pengguna
        // berada
        if (queryResults.featureSet.features.length > 0) {
            var inputGeom = queryResults.featureSet.features["0"].geometry;
            map_getKanimByProvince(inputGeom);
        }
    }

    function map_getProvince_queryTaskErrorHandler(queryError) {
        //temporary not used
        console.log("error", queryError.error.details);
    }

    function map_getKanimByProvince(geomProvince) {
        //temporary not used
        var queryTask = new QueryTask(url.map_service_kanim);
        var query = new Query();
        query.outFields = ["*"];
        query.returnGeometry = true;
        query.where = "1=1";
        query.geometry = geomProvince;
        query.spatialRelationship = Query.SPATIAL_REL_CONTAINS;
        queryTask.on("complete", map_getKanimByProvince_Complete);
        queryTask.on("error", map_getKanimByProvince_Error);
        queryTask.execute(query);
    }

    function map_getKanimByProvince_Complete(queryResults) {
        //temporary not used
        console.log("complete", queryResults);
    }

    function map_getKanimByProvince_Error(queryError) {
        //temporary not used
        console.log("error", queryError.error.details);
    }

    function map_getKanimAll() {
        var queryTask = new QueryTask(url.map_service_kanim);
        var query = new Query();
        query.outFields = ["*"];
        query.returnGeometry = true;
        query.where = "1=1";
        queryTask.on("complete", map_getKanimAll_Complete);
        queryTask.on("error", map_getKanimAll_Error);
        queryTask.execute(query);
    }

    function map_getKanimAll_Complete(queryResults) {
        listKanim = queryResults;
        setupRoute();
    }

    function map_getKanimAll_Error(queryError) {
        console.log("error", queryError.error.details);
    }

    window.map_getListKanimAll = function () {
        return listKanim;
    }

    dojo.addOnLoad(function () {
        // attach on click to id="textDiv"
        dojo
            .query('#divGPS')
            .onclick(function (evt) {
                map_geGPStLocation();
            });
        dojo
            .query('#divRouteButton')
            .onclick(function (evt) {
                map_getRouteToKanim(null);
            });
    });

    map.addLayers([kanim_layer]);
    map_geGPStLocation();

    setTimeout(() => {
        //testing locate kanim 33 (depok)
        //map_LocateToKanim(33);
    }, 5000);
});