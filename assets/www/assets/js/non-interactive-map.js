//non interactive map please include jquery first and dojo

window.map_non_interactive_getProvince = function () {}

window.map_non_interactive_getOfficeByGPS = function () {}
jQuery(document).ready(function () {
  require([
    "esri/symbols/PictureMarkerSymbol",
    'esri/graphic',
    'esri/Color',
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/tasks/FeatureSet",
    "esri/geometry/Point",
    "esri/InfoTemplate",
    "esri/geometry/webMercatorUtils",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/layers/WebTiledLayer",
    "esri/geometry/geometryEngine",
    "esri/geometry/Polyline",
    "esri/SpatialReference",
    "esri/symbols/SimpleLineSymbol",
    "esri/graphicsUtils",
    "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Circle",
    "esri/tasks/locator"
  ], function (
    PictureMarkerSymbol,
    Graphic,
    Color,
    GraphicsLayer,
    FeatureLayer,
    FeatureSet,
    Point,
    InfoTemplate,
    webMercatorUtils,
    Query,
    QueryTask,
    WebTiledLayer,
    geometryEngine,
    Polyline,
    SpatialReference,
    SimpleLineSymbol,
    graphicsUtils,
    SimpleFillSymbol,
    Circle,
    Locator
  ) {

    var symbolOffice = new PictureMarkerSymbol();
    symbolOffice.setHeight(37);
    symbolOffice.setWidth(30);
    symbolOffice.setUrl("img/gedung.png");

    window.__gps = {
      x: 0,
      y: 0
    }

    //Untuk merubah coordinat menjadi alamat
    var locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    window.map_getAddress = function (longitude, latitude) {
      var mp = Point(longitude, latitude, new SpatialReference(4326));
      var deferred = new $.Deferred();
      var resolved;
      locator.locationToAddress(mp, 100);
      locator.on("location-to-address-complete", function (event) {
        if (!resolved && event.address.address) {
          var address = event.address.address;
          var location = webMercatorUtils.geographicToWebMercator(event.address.location);
          localStorage.setItem("REGION", address.Region);
          localStorage.setItem("SUBREGION", address.Subregion);
          localStorage.setItem("KECAMATAN", address.City);
          localStorage.setItem("CountryCode", address.CountryCode);
          localStorage.setItem("ADDRESS", address.Match_addr);
          deferred.resolve({
            address: address,
            location: location
          });
        }
        resolved = true;
      });
      return deferred.promise();
    }
    //End merubah koordinat menjadi alamat

    var officeTemplate = new InfoTemplate("Attributes", "*");

    var url = {
      country: "https://geoportal.imigrasi.go.id/arcgis/rest/services/imigrasi/administrative/FeatureSer" +
        "ver/1",
      region: "https://geoportal.imigrasi.go.id/arcgis/rest/services/imigrasi/administrative/FeatureSer" +
        "ver/0",
      office: "https://antrian.imigrasi.go.id/Antrian/api/listoffices.jsp"
    }

    var gpsOption = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    window.map_non_interactive_getLocation = function () {
      var deferred = new $.Deferred();
      if (navigator.geolocation) {
        navigator
          .geolocation
          .getCurrentPosition(function (position) {
            //console.log(position);
            deferred.resolve(position);
          }, function (errLog) {
            deferred.resolve(null);
          }, gpsOption);
      } else {
        console.warn("Geolocation is not supported by this browser.");
        deferred.resolve(null);
      }
      return deferred.promise();
    }

    window.map_non_interactive_getOfficeListAll = function () {
      var deferred = new $.Deferred();
      var jqxhr = $.get(url.office, function (data) {
          deferred.resolve(data.Offices);
        })
        .fail(function () {
          console.warn("Error getting office");
          deferred.resolve([]);
        });
      return deferred.promise();
    }

    function converLongLatToXY(position) {
      if (position != null) {
        var xyFromLongLat = webMercatorUtils.lngLatToXY(position.coords.longitude, position.coords.latitude);
        var x = xyFromLongLat[0];
        var y = xyFromLongLat[1];
        var pt = new Point(x, y, new SpatialReference(102100));
        return pt;
      } else {
        return null;
      }
    }

    window.map_non_interactive_getCountry = function () {
      var deferred = new $.Deferred();
      map_non_interactive_getLocation()
        .done(function (myLocation) {
          if (myLocation != null) {
            pointLocation = converLongLatToXY(myLocation);
            __gps.x = pointLocation.x;
            __gps.y = pointLocation.y;
            var queryTask = new QueryTask(url.country);
            var query = new Query();
            query.outFields = ["*"];
            query.geometry = pointLocation;
            query.returnGeometry = true;
            queryTask.on("complete", function (result) {
              var objCountry = result.featureSet.features["0"]; //.attributes;
              //console.error(objCountry)
              deferred.resolve(objCountry);;
            });
            queryTask.on("error", function (result) {
              console.error(result)
              deferred.resolve(null);;
            });
            queryTask.execute(query);
          } else {
            deferred.resolve(null);;
          }
        });
      return deferred.promise();
    }

    function getObjetKanim(ID_KANIM) {

    }

    function map_getProvince() {
      var deferred = new $.Deferred();
      map_non_interactive_getLocation().done(function (myLocation) {
        if (myLocation) {
          pointLocation = converLongLatToXY(myLocation);
          var queryTask = new QueryTask(url.region);
          var query = new Query();
          query.outFields = ["*"];
          query.geometry = pointLocation;
          query.returnGeometry = true;
          queryTask.on("complete", function (result) {
            var rs = result.featureSet.features["0"];
            deferred.resolve(rs);;
          });
          queryTask.on("error", function (error) {
            deferred.resolve(null);;
          });
          queryTask.execute(query);
        } else {
          deferred.resolve(null);;
        }
      })
      return deferred.promise();
    }

    function convertJSONKanimToFeatureSet(arrData) {
      /* 
            Fungsi konversi tipe json ke tipe graphic
            param : array dari geometry
            return : array graphic
        */
      var arrRet = [];
      for (var i = 0; i < arrData.length; i++) {
        var office = arrData[i];
        var xyFromLongLat = webMercatorUtils.lngLatToXY(office.MO_LONGITUDE, office.MO_LATITUDE);
        var gr = new Graphic(new Point(xyFromLongLat[0],
            xyFromLongLat[1],
            new SpatialReference({
              wkid: 102100
            })),
          symbolOffice,
          office,
          officeTemplate);
        arrRet.push(gr);
      }
      return arrRet;
    }

    function map_getKanimByPolygon(geomKanim, geomPolygon) {
      /* 
          Fungsi untuk mencari irisan antara posisi kanim-kanim dengan hasil query (negara , atau provinsi)
          param : object hasil query
          return : void
      */
      var administrativeBoundaries = geomPolygon
      var filteredOffice = [];


      //Cek irisan antara kanim dan batas administrative
      var arrGeom = [];
      for (var i = 0; i < geomKanim.length; i++) {
        arrGeom.push(geomKanim[i].geometry);
      };

      console.log(administrativeBoundaries);
      console.log(arrGeom);

      //dirtyIntersectedOffice berisi semua list kanim, tetapi tidak semua beririsan dengan batas wilayah
      var dirtyIntersectedOffice = geometryEngine.intersect(arrGeom, administrativeBoundaries.geometry);

      console.log(dirtyIntersectedOffice);


      //hanya mengambil kanim-kanim yang beririsan saja
      var intersectedOffice = [];
      for (var c = 0; c < dirtyIntersectedOffice.length; c++) {
        if (dirtyIntersectedOffice[c]) {
          intersectedOffice.push(dirtyIntersectedOffice[c]);
        }
      }

      console.log(intersectedOffice);
      //$scope.map.filtered.office = intersectedOffice;

      var lineSymbol = new SimpleLineSymbol();
      lineSymbol.setWidth(2);
      lineSymbol.setColor(new Color([255, 0, 0, 1]));
      var intersectedOfficeGraphic = [];

      for (var i = 0; i < geomKanim.length; i++) {
        for (var j = 0; j < intersectedOffice.length; j++) {
          if (
            geomKanim[i].geometry.x === intersectedOffice[j].x &&
            geomKanim[i].geometry.y === intersectedOffice[j].y
          ) {
            var lineGeom = new Polyline(new SpatialReference({
              wkid: 102100
            }));
            lineGeom.addPath([
              [__gps.x, __gps.y],
              [intersectedOffice[j].x, intersectedOffice[j].y]
            ]);
            //menghitung jarak antar lokasi user dan lokasi kanim
            var distance = geometryEngine.geodesicLength(lineGeom, "kilometers");

            geomKanim[i].attributes["Jarak"] = distance.toFixed(2);
            intersectedOfficeGraphic.push(geomKanim[i]);
          }
        }
      }
      return intersectedOfficeGraphic;
    }

    window.map_getOfficeByLocation = function () {
      var deferred = new $.Deferred();
      map_non_interactive_getOfficeListAll().then(function (dataAllOffice) {
        window.__dataAllKanimGraphicArray = convertJSONKanimToFeatureSet(dataAllOffice);
        if (dataAllOffice) {
          map_non_interactive_getCountry().then(function (result) {
            if (result) {
              if (result.attributes.iso3 === "IDN") {
                //Indonesia, , cari provinsinya
                map_getProvince().then(function (result) {
                  //cek irisan dengan provinsi
                  var dt = map_getKanimByPolygon(__dataAllKanimGraphicArray, result);
                  deferred.resolve(dt);;
                });
              } else {
                //bukan indonesia, cari intesect antara feature set kanwil dan negara
                var dt = map_getKanimByPolygon(__dataAllKanimGraphicArray, result);
                deferred.resolve(dt);;
              }
            } else {
              deferred.resolve(null);;
            }
          });
        } else {
          console.log("tidak ada data kanwil");
          deferred.resolve(null);;
        }
      });
      return deferred.promise();
    }

    window._createRadiusFence = function (x, y) {
      /*
          Fungsi untuk membuat radius fence
          param : x = number , koordinat longitude
                  y = number , koordinat latitude
          return : void, akan set variable window.__radiusFence dengan radius fence yang dibuat
      */
      var point = new Point([x, y]);
      var radiusFence = new Circle(
        point, {
          "radius": 50 // satuan dalam meter
        }
      )
      //console.log(radiusFence);
      window.__radiusFence = radiusFence;
    }

    window._checkLocationByRadiusFence = function (x, y) {
      /* 
          Fungsi untuk cek posisi apakah berada didalam radius fence,
          param : x = number , koordinat longitude
                  y = number , koordinat latitude
          return : true , jika  posisi berada didalam radius fence
                      false , jika posisi diluar radius fence
                      false , jika objek radius fence belum dicreate (error message di console)
      */
      console.log(window.__radiusFence);
      if (window.__radiusFence) {
        var point = new Point([x, y]);
        var isIntersected = geometryEngine.intersects(point, window.__radiusFence);
        console.log(isIntersected);
        return isIntersected;
      }
      console.error("Objek radius fence belum dibuat, panggil _createRadiusFence(x,y)")
      return false;
    }

    window.hello = function () {
      alert("hello");
    }
  });
});
