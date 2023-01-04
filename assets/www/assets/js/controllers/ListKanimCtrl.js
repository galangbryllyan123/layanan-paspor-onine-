app.controller('ListKanimCtrl', function (service_office, _user, _booking, $templateCache, $scope, $ionicHistory, $rootScope, $stateParams, $interval, $state, $ionicSideMenuDelegate, esriLoader, $http, _MRZ, _http, _store, _map, _Sweet, _loading) {

  $scope.$on("$ionicView.afterEnter", function () {
    if (!$rootScope.locationIsEnabled){
      _Sweet("Perhatian", "GPS tidak aktif, daftar hanya akan menampilkan Kanim yang berada di Indonesia saja. Jika anda berada di luar negeri, harap mengaktifkan GPS Anda").then(function(){
        $scope.getIosOffice({
          name: "Indonesia",
          code: "IDN"
        });
      });
    }
  });
  $scope.$on("$ionicView.beforeEnter", function () {
    window.scope = $scope = $scope;
    $scope.Map = _map = _map;
    $scope.map = _map.map = _map.map;
    $scope.mapLoaded = _map.mapLoaded;
    $scope.map.Offices = []
    $scope.iosObject = {}
    $scope.listCountryRegion = []
    $scope.htmlListKanim = $templateCache.get("html-list-kanim");
    for (var key in _MRZ.countryCode){
      $scope.listCountryRegion.push({
        code: key,
        name: _MRZ.countryCode[key]
      });
    }
    if ($rootScope.deviceIos){
      $scope.iosObject.officeNotSet = true;
    }else{
      $scope.iosObject.officeNotSet = false;
    }
  });

  $scope.$watch('iosObject.selectedCountry', function(country){
    if (country) {
      getIosOffice(country);
    }
  });

  $scope.condition = function(a){
    return a;
  }

  $scope.getIosOffice = function(set){
    if (set){
      $rootScope.setIosAdress({
        REGION: set.name,
        CountryCode: set.code
      }, $scope.getIosOffice);
    }else{
      _loading.show("Harap tunggu...");
      service_office.query({
        total: 50
      }).then(function (result) {
        for (var i = result.length - 1; i >= 0; i--) {
          $scope.map.Offices.push({
            attributes: result[i]
          });
        }
        _loading.hide();
      });
    }
  }
  $rootScope.convert = function (obj) {
    return JSON.stringify(obj);
  }

  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.getQuotaAvail = function (ID, data) {
    function broadcast(){
      var type = "EMPTY_QUOTA";
      _user.broadcast(type).then(function (response) {
        _loading.hide();
        $scope.broadcast = {};
        $scope.broadcast = response.data.BROADCAST;
        angular.forEach($scope.broadcast, function (result) {
          _Sweet({
            title: result.TITLE,
            text: result.CONTENT,
            type: 'warning',
            confirmButtonText: 'OK',
          });
        });
      });
    }
    _loading.show("Harap tunggu...");
    _http.post(config.api + "/layanan/wni/quota/availability", {
      BUSINESS_UNIT_ID: ID,
      TOKEN: _store.get("token")
    }).then(function (response) {
      if (!response.data.SUCCESS) {
        _loading.hide();
        _Sweet({
          title: 'Mohon Maaf',
          text: response.data.MESSAGE,
          type: 'warning',
          confirmButtonText: 'OK',
        }).then(function (succ) {
          _store.removeAll();
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
          $state.go('login', {}, {
            reload: true
          });
        });
      } else if (response.data.SUCCESS && response.data.AVAILABLE == undefined) {
        broadcast();
      } else if (response.data.SUCCESS && response.data.AVAILABLE != undefined) {
        var availCount = []
        for (var i = 0; i < response.data.AVAILABLE.length; i++) {
          var avail = response.data.AVAILABLE[i]
          availCount.push(Number(avail.AVAIL_TOTAL) > 0);
        }
        if (availCount.Contains(true)){
          _loading.hide();
          $scope.permohonan(data, response);
        }else{
          broadcast();
        }
      }
    });
  }

  $scope.permohonan = function (data, response) {
    _booking.getQueueCount().then(function (success) {
      $rootScope.JumlahPemohon = success.data.QUEUE_COUNT || 0;
      if ($rootScope.JumlahPemohon < 5) {
        _Sweet({
          title: 'PERHATIAN',
          text: 'AKUN ANDA TELAH DIGUNAKAN, ANDA DAPAT MENGAJUKAN PERMOHONAN PENDAFTARAN ANTRIAN ONLINE KEMBALI TERHITUNG 30 HARI SEJAK TANGGAL ANTRIAN TERAKHIR YANG TELAH ANDA TENTUKAN',
          type: ''
        }).then(function () {
          $state.go("menu.listkanim");
        })
      } else {
        response = JSON.stringify(response);
        data = JSON.stringify(data);
        console.log(response, data)
        $state.go('menu.permohonan', {
          data: data,
          response: response
        });
      }
    });
  };
})
