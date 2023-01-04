app.controller('GlobalCtrl', function ($state, _user, _Esri, _modal, _http, _Permission, $q, $scope, $ionicHistory, $rootScope, $state, $rootScope, _store, $http, $cordovaGeolocation, $cordovaDevice) {
  $rootScope.mrzUnderConstruction = false;
  $rootScope.openNativeSetting = function(setting){
    window.cordova.plugins.settings.open(setting, function() {
      console.log('opened settings');
    }, function () {
      console.log('failed to open settings');
    });
  }
  $rootScope.enablePermissions = function(callback){
    var modalTitle = 'PERHATIAN !';
    function enablePerm(){
      var q = $q.defer();
      if (window.cordova){
        if (!$rootScope.deviceIos){
          var permissions = cordova.plugins.permissions;
          var list = [permissions.ACCESS_FINE_LOCATION, permissions.CAMERA, permissions.GET_ACCOUNTS, permissions.READ_EXTERNAL_STORAGE, permissions.WRITE_EXTERNAL_STORAGE]
          permissions.hasPermission(list, function success(status) {
            if (!status.hasPermission) {
              permissions.requestPermissions(list, function(status) {
                q.resolve(status);
              }, function(){
                q.reject();
              });
            }else{
              q.resolve(status);
            }
          }, null);
        }else{
          q.resolve({
            hasPermission: true
          });
        }
      }else{
        q.reject("Not device");
      }
      return q.promise;
    }
    function openModal(){
      if (window.cordova){
        _modal.open($rootScope, {
          title: modalTitle,
          body: 'ModalPermission',
          customCss: [{
            selector: ".modal",
            css: {
              'min-height': "30%"
            }
          }]
        });
      }else{
        callback();
      }
    }
    $rootScope.underStand = function(){
      if ($rootScope.MyModal.title == modalTitle) _modal.hide();
      $rootScope.enablePermissions(callback);
    }
    $rootScope.exitApp = function(){
      ionic.Platform.exitApp();
    }
    if ($rootScope.currentState != "splashscreen"){
      enablePerm().then(function(status){
        if (!status.hasPermission){
          openModal();
        }else{
          if ($rootScope.MyModal.title == modalTitle) _modal.hide();
          callback();
        }
      }, function(){
        openModal();
      });
    }
  }
  $rootScope.Logout = function () {
    function callback(){
      _store.removeObj(['token', 'username', 'hasLoggedIn', 'Google', 'RegisType', 'DataUser', 'UserImage', 'loggedInAs']);
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
      $rootScope.init();
      $state.go('login');
    }
    try {
      window.plugins.googleplus.logout(function(){
        facebookConnectPlugin.logout(callback, callback);
      }, function(){
        facebookConnectPlugin.logout(callback, callback);
      });
    } catch(e){
      callback();
      console.error(Error(e));
    }
  }
  $scope.$on("$ionicView.afterEnter", function (event, data) {
    /* Get IP, Latitude dan Longitude */
    window.cordova.plugins.diagnostic.location.isLocationEnabled(function(isEnabled){
      $rootScope.locationIsEnabled = isEnabled;
    }, function(error){
      $rootScope.locationIsEnabled = false;
    });
    window._http = _http = _http;
    window.state = $state = $state;
    setTimeout(function(){
      if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) ionic.Platform.exitApp = navigator.app.exitApp;
    }, 500);
    $rootScope.deviceIos = ionic.Platform.isIOS() || ionic.Platform.isIPad();
    $rootScope.putLatLong = function(){
      $cordovaGeolocation.getCurrentPosition({
        timeout: 3000,
        enableHighAccuracy: false
      }).then(function (position) {
        var lat = position.coords.latitude || null;
        var long = position.coords.longitude || null;
        _store.put("LATITUDE", lat);
        _store.put("LONGITUDE", long);
      }, function (err) {
        console.log(err)
      });
    }
    $rootScope.putIpAdress = function(){
      _user.getIP().then(function (response) {
        _store.put("IP_ADDRESS", response.data.ip);
      });
    }
    $rootScope.init = function () {
      try {
        /* Get IP, Latitude dan Longitude */
        window.hasInitCalled = true;
        $rootScope.putIpAdress();
        var posOptions = {
          timeout: 3000,
          enableHighAccuracy: false
        };
        /* Permission Geolocation */
        $rootScope.putLatLong();
        var watchOptions = {
          timeout: 3000,
          enableHighAccuracy: false
        };
        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(null, function (err) {
          console.log(err)
        }, function (position) {
          var lat = position.coords.latitude || null;
          var long = position.coords.longitude || null;
          _store.put("LATITUDE", lat);
          _store.put("LONGITUDE", long);
        });
        watch.clearWatch();
        /* Get UUID */
        try {
          $rootScope.uuid = $cordovaDevice.getUUID();
          _store.put("UUID", $rootScope.uuid);
          console.warn($rootScope.uuid)
        } catch (err) {
          console.log("Error " + err.message);
        }
        /* Get Address */
        _Esri.getAddress().then(function (event) {
          var address = event.address;
          _store.put("REGION", address.Region);
          _store.put("SUBREGION", address.Subregion);
          _store.put("KECAMATAN", address.City);
          _store.put("CountryCode", address.CountryCode);
          _store.put("ADDRESS", address.Match_addr);
        });
      } catch(err){
        console.error("Init failed:", err);
      }
    }
    $rootScope.DataUser = _store.get("DataUser");
    if (_store.get("UserAgreed") == "true"){
      $rootScope.enablePermissions(function(){
      });
    }
  });
  $rootScope.setIosAdress = function(object, callback){
    _store.putObj(object);
    setTimeout(callback, 150);
  }
});