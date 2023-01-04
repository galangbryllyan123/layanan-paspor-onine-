app.controller('SplashScreenCtrl', function (_grantPermission, _user, _File, _Esri, _Sweet, _modal, _Permission, $scope, $rootScope, $state, $rootScope, _store, $http, $cordovaGeolocation, $ionicPlatform, $cordovaDevice) {
  var posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };

  var watchOptions = {
    timeout: 3000,
    enableHighAccuracy: false
  };
  var watch = $cordovaGeolocation.watchPosition(watchOptions);

  watch.then(
    null,

    function (err) {
      console.log(err)
    },

    function (position) {
      var lat = position.coords.latitude || null;
      var long = position.coords.longitude || null;
      _store.put("LATITUDE", lat);
      _store.put("LONGITUDE", long);
    }
  );

  watch.clearWatch();
  $scope.$on("$ionicView.afterEnter", function (event, data) {
    
    
    if (typeof $rootScope.putLatLong == 'function') $rootScope.putLatLong();
    setTimeout(function(){
      _modal.open($scope, {
        title: 'BACA TERLEBIH DAHULU',
        body: 'GoPendaftaran'
      });
    }, 500);
  });

  $scope.doDaftar = function () {
    _modal.hide();
    /* Get IP, Latitude dan Longitude */
    function onError(error) {
      console.error("The following error occurred: " + error);
    }

    function handleLocationAuthorizationStatus(cb, status) {
      if (window.cordova){
        switch (status) {
          case cordova.plugins.diagnostic.permissionStatus.GRANTED:
            cb(true);
            break;
          case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
            requestLocationAuthorization(cb);
            break;
          case cordova.plugins.diagnostic.permissionStatus.DENIED:
            cb(false);
            break;
          case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
            // Android only
            cb(false);
            break;
          case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
            // iOS only
            cb(true);
            break;
        }
      }
    }

    function requestLocationAuthorization(cb) {
      if (window.cordova) cordova.plugins.diagnostic.requestLocationAuthorization(handleLocationAuthorizationStatus.bind(this, cb), onError);
    }

    function ensureLocationAuthorization(cb) {
      if (window.cordova) cordova.plugins.diagnostic.getLocationAuthorizationStatus(handleLocationAuthorizationStatus.bind(this, cb), onError);
    }
    function callbackLogin (){
      _Esri.getAddress().then(function (event) {
        var address = event.address;
        _store.put("REGION", address.Region);
        _store.put("SUBREGION", address.Subregion);
        _store.put("KECAMATAN", address.City);
        _store.put("CountryCode", address.CountryCode);
        _store.put("ADDRESS", address.Match_addr);
      });
      $state.go('login');
    }
    function requestLocationAccuracy() {
      if (window.cordova){
        ensureLocationAuthorization(function (isAuthorized) {
          if (isAuthorized) {
            cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
              if (canRequest || canRequest == 1) {
                cordova.plugins.locationAccuracy.request(function () {
                    $rootScope.init();
                    callbackLogin();
                  }, function (error) {
                    onError("Error requesting location accuracy: " + JSON.stringify(error));
                    if (error) {
                      // Android only
                      onError("error code=" + error.code + "; error message=" + error.message);
                      if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                        if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                          cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                      }
                    }
                  }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
                );
              } else {
                // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
                // On Android, this will occur if the app doesn't have authorization to use location.
                onError("Cannot request location accuracy");
              }
            });
          } else {
            setTimeout(() => {
              _Sweet("Mohon maaf", "Aktifkan izin location pada pengaturan aplikasi di handphone anda terlebih dahulu", "warning").then(function () {
                ionic.Platform.exitApp();
              })
            }, 3000);
          }
        });
      }else{
        callbackLogin();
      }
    }
    if ($rootScope.deviceIos){
      callbackLogin();
    }else{
      requestLocationAccuracy();
    }
  }

});
