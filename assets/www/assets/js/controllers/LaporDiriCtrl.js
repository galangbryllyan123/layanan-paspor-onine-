app.controller('LaporDiriCtrl', function ($rootScope, _Permission, $scope, _datePickerDefault, $state, _MRZ, _Sweet, _lapordiri, $ionicHistory, $ionicLoading, _store) {
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    _store.put('LaporData', $scope.laporDiri);
    $scope.laporDiri.Keterangan = _store.get("ADDRESS");
    _Sweet({
      title: '',
      text: 'Gunakan Tombol Scan Paspor & Arahkan Kamera Handphone Ke Paspor Untuk Dapat Membaca Paspor Anda',
      type: 'info',
      confirmButtonText: 'OK',
    }).then(function () {
      _MRZ.scan().then(function (data) {
        if (!$rootScope.mrzUnderConstruction){
          data.dayOfBirthObject = moment(data.dayOfBirthObject).format("YYYY-MM-DD");
          data.expirationDateObject = moment(data.expirationDateObject).format("YYYY-MM-DD");
        }
        $scope.laporDiri = data;
        $scope.laporDiri.Keterangan = _store.get("ADDRESS");
      }, function (error) {
        console.error(error);
      });
    })
  })
  
  $scope.laporDiri = {};
  $scope.Lapor = function () {
    if ($scope.laporDiri.Nationality == "Indonesia"){
      $scope.laporDiri.countryCode = "IDN";
    }else{
      $scope.laporDiri.countryCode = "null";
    }
    $ionicLoading.show({
      template: 'Mohon Tunggu...'
    });

    function dataValid(valid) {
      if (!valid) {
        $ionicLoading.hide();
        _Sweet({
          title: "Mohon Maaf",
          html: "<div style='font-size: 16px'> " + message + "</div>",
          type: "warning"
        })
      } else {
        var params = {
          NAME: $scope.laporDiri.FullName,
          PASPORT_NUMBER: $scope.laporDiri.documentNumber,
          COUNTRY_CODE: $scope.laporDiri.countryCode,
          NATIONALITY: $scope.laporDiri.Nationality,
          BORN_DATE: $scope.laporDiri.dayOfBirthObject,
          GENDER: $scope.laporDiri.sex,
          PLACE_OF_BIRTH: "null", //HARDCODE
          DATE_OF_ISSUES: "2006-08-20", //HARDCODE
          DATE_OF_EXPIRY: $scope.laporDiri.expirationDateObject,
          ISSUING_OFFICE: "null", //HARDCODE 
          REPORT_DATE: moment().format('YYYY-MM-DD'),
          LONGITUDE: _store.get("LONGITUDE"),
          LATITUDE: _store.get("LATITUDE"),
          BUSINESS_UNIT_ID: "", //HARDCODE
          TOKEN: _store.get("token")
        }

        _lapordiri.laporDiri(params).then(function (response) {
          if (response.data.SUCCESS == "true" || response.data.SUCCESS) {
            var starting = angular.element(document.querySelector('#starting'));
            var detail = angular.element(document.querySelector('#detail'));
            if (starting.attr('myattr') == "starting") {
              _Sweet({
                title: 'Berhasil',
                text: 'Laporan Terkirim',
                type: 'success',
                confirmButtonText: 'OK',
              }).then(function (succ) {
                $state.go('mainmenu.beranda');
              });
            } else {
              _Sweet({
                title: 'Berhasil',
                text: 'Laporan Terkirim',
                type: 'success',
                confirmButtonText: 'OK',
              }).then(function (succ) {
                $state.go('mainmenu.LaporDiriDetail');
                $scope.$apply(function () {
                  $scope.laporDiri = _store.get('LaporData');
                });
              });
            }
          } else if (response.data.CODE == 500) {
            _Sweet({
              title: 'Berhasil',
              text: 'Laporan Terkirim',
              type: 'success',
              confirmButtonText: 'OK',
            }).then(function (succ) {
              $state.go('mainmenu.beranda');
            });
          } else {
            _Sweet({
              title: 'Error',
              text: response.data.MESSAGE,
              type: 'error',
              confirmButtonText: 'OK',
            });
          }
          $ionicLoading.hide();
        }, function () {
          $ionicLoading.hide();
        })
      }
    }
    var message = "",
      valid = true
    if (!$scope.laporDiri.documentNumber) {
      message += "Nomor Paspor Tidak Boleh Kosong<br>";
      valid = false;
    }
    if (!$scope.laporDiri.FullName) {
      message += "Nama Lengkap Tidak Boleh Kosong<br>";
      valid = false;
    }
    if (!$scope.laporDiri.documentType) {
      message += "Tipe Paspor Tidak Boleh Kosong<br>";
      valid = false;
    }
    if (!$scope.laporDiri.countryCode) {
      message += "Kode Negara Tidak Boleh Kosong<br>";
      valid = false;
    }
    if (!$scope.laporDiri.Nationality) {
      message += "Kebangsaan Tidak Boleh Kosong<br>";
      valid = false;
    }
    if (!$scope.laporDiri.dayOfBirthObject) {
      message += "Tanggal Lahir Tidak Boleh Kosong<br>";
      valid = false;
    }
    if (!$scope.laporDiri.sex) {
      message += "Jenis Kelamin Tidak Boleh Kosong<br>";
      valid = false;
    }
    if (!$scope.laporDiri.expirationDateObject) {
      message += "Masa Berlaku Paspor Tidak Boleh Kosong<br>";
      valid = false;
    }
    if ($scope.laporDiri.countryCode != "IDN") {
      message += "Fitur ini hanya dapat digunakan pada saat berada diluar wilayah NKRI saja<br>";
      valid = false;
    }
    dataValid(valid);
  }

  $scope.ScanMRZ = function () {
    _MRZ.scan().then(function (data) {
      if (!$rootScope.mrzUnderConstruction){
        data.dayOfBirthObject = moment(data.dayOfBirthObject).format("YYYY-MM-DD");
        data.expirationDateObject = moment(data.expirationDateObject).format("YYYY-MM-DD");
      }
      $scope.laporDiri = data;
      $scope.laporDiri.Keterangan = _store.get("ADDRESS");
    }, function (error) {
      console.error(error);
    });
  }

})
