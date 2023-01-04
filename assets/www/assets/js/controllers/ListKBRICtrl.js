app.controller('ListKBRICtrl', function (_booking, $scope, $ionicHistory, $rootScope, $stateParams, $interval, $state, $ionicSideMenuDelegate, esriLoader, $http, $cordovaGeolocation, _http, _store, _map, _Sweet, _loading) {

  $scope.$on("$ionicView.beforeEnter", function () {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    
    $scope.Map = _map = _map;
    $scope.map = _map.map = _map.map;
    $scope.mapLoaded = _map.mapLoaded;
  });

  

  $rootScope.convert = function (obj) {
    return JSON.stringify(obj)
  }

  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.getQuotaAvail = function (ID, data) {
    _loading.show("Harap tunggu...");
    _http.post(config.api + "/layanan/wni/quota/availability", {
      BUSINESS_UNIT_ID: ID,
      TOKEN: _store.get("token")
    }).then(function (response) {
      _loading.hide();
      if (!response.data.SUCCESS) {
        _Sweet({
          title: 'Mohon Maaf',
          text: response.data.MESSAGE, //'Antrian Sudah Penuh, Anda Dapat Mengakses Setelah Petugas Membuka Antrian Pada Hari Jum\'at Pukul 18:00 s/d Minggu 09:00',
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
        var type = "EMPTY_QUOTA";
        _user.broadcast(type).then(function (response) {
          $scope.broadcast = {};
          $scope.broadcast = response.data.BROADCAST;
          angular.forEach($scope.broadcast, function (result) {
            _Sweet({
              title: result.TITLE,
              text: result.CONTENT,
              type: 'warning',
              confirmButtonText: 'OK',
            })
          })
        });
      } else if (response.data.SUCCESS && response.data.AVAILABLE != undefined) {
        $scope.permohonan(data, response);
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
          $state.go("mainmenu.ListKBRI");
        })
      } else {
        response = JSON.stringify(response);
        data = JSON.stringify(data);
        console.log(response, data)
        $state.go('mainmenu.PermohonanLuarNegeri', {
          data: data,
          response: response
        });
      }
    });
  };
})
