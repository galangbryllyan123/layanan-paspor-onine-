app.controller('PendaftaranCtrl', function (_Permission, _grantPermission, $http, _Esri, _user, $rootScope, $scope, $state, $ionicHistory, $cordovaGeolocation, $cordovaDevice, _loading, _Sweet, _user, _store, _wilayah, _datePickerDefault) {
  window.dateP = _datePickerDefault = _datePickerDefault;
  window.loading = _loading = _loading;
  $scope.user = {};
  $scope.$watch('registration.Email', function(email){
    $scope.registration.EmailMedsos = email;
  });
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    
    $scope.fromMedsosReg = false;
    /* Permission address */
    if (window.hasInitCalled) {
      $rootScope.init()
    }
    _wilayah.Provinsi().then(function (response) {
      $scope.dataObjProvinsi = response.data.adminarea;
    });
    /* Variable */
    $scope.registration = {};
    $scope.modalSelected = {};
    $scope.registrationValid = {};


    /* Get type and email from localstorage */
    $scope.RegisType = _store.get("RegisType");
    if ($scope.RegisType == "Google" || $scope.RegisType == "Facebook") {
      $scope.registration.EmailMedsos = _store.get("Email");
      $scope.registration.Email = _store.get("Email");
      $scope.fromMedsosReg = true;
    } else {}

    /* Get province, district and city */
    $scope.$watch("modalSelected.Provinsi", function (provinsi) {
      _wilayah.Kota().then(function (response) {
        try {
          $scope.registration.Provinsi = provinsi.id;
          var kota = response.data.cities;
          $scope.dataObjKabupaten = kota.filter(function (s) {
            return s.admin_area_id == $scope.registration.Provinsi;
          });
          $scope.modalSelected.Kabupaten = {};
          $scope.modalSelected.Kecamatan = {};
        } catch (err) {}
      });
    });
    $scope.$watch("modalSelected.Kabupaten", function (kabupaten) {
      _wilayah.Kecamatan().then(function (response) {
        try {
          $scope.registration.Kabupaten = kabupaten.id;
          var kecamatan = response.data.district;
          $scope.dataObjKecamatan = kecamatan.filter(function (s) {
            return s.city_id == $scope.registration.Kabupaten;
          })
        } catch (err) {}
      });
    });
    $scope.$watch("modalSelected.Kecamatan", function (kecamatan) {
      try {
        $scope.registration.Kecamatan = kecamatan.id;
      } catch (err) {}
    });
  });

  /* GET DATA NIK, AGAMA, TANGGAL LAHIR */
  // $scope.$watchCollection("[registration.NIK,registration.Tanggal_Lahir]", function (newVal) {
  //   try {
  //     $rootScope.params = {};
  //     $rootScope.params.NIK = newVal[0];
  //     $rootScope.params.TANGGAL_LAHIR = moment(newVal[1]).format("YYYY-MM-DD");
  //     _store.put("NIK", $rootScope.params.NIK);
  //     _store.put("TANGGAL_LAHIR", $rootScope.params.TANGGAL_LAHIR);
  //     var date = new Date();
  //     $scope.today = moment(date).format("YYYY-MM-DD");
  //     if ($rootScope.params.TANGGAL_LAHIR !== $scope.today && $rootScope.params.NIK.length == 16) {
  //       _loading.show('Mohon Tunggu');
  //       _user.admInduk().then(function (response) {
  //         if (!response.data.SUCCESS) {
  //           $scope.registration.Nama_Lengkap = "";
  //           $scope.registration.Alamat = "";
  //           _Sweet({
  //             title: 'Mohon Maaf',
  //             text: 'NIK Tidak Ditemukan',
  //             type: 'warning',
  //             confirmButtonText: 'Ok',
  //           }).then(function (result) {
  //             if (result.value) {
  //               $scope.aktif = false;
  //               _loading.hide();
  //             } else {
  //               $scope.aktif = false;
  //               _loading.hide();
  //             }
  //           });
  //         } else if (response.data.SUCCESS == null) {
  //           $scope.registration.Nama_Lengkap = "";
  //           $scope.registration.Alamat = "";
  //           _Sweet({
  //             title: 'Mohon Maaf',
  //             text: 'NIK Tidak Ditemukan',
  //             type: 'warning',
  //             confirmButtonText: 'Ok',
  //           }).then(function (result) {
  //             if (result.value) {
  //               $scope.aktif = false;
  //               _loading.hide();
  //             } else {
  //               $scope.aktif = false;
  //               _loading.hide();
  //             }
  //           });
  //         } else if (response.data.SUCCESS) {
  //           $scope.aktif = false;
  //           $scope.dataDukcapil = []
  //           $scope.dataDukcapil = response.data.DATA.content;
  //           angular.forEach($scope.dataDukcapil, function (response) {
  //             $scope.registration.Nama_Lengkap = response.NAMA_LGKP;
  //             $scope.registration.Alamat = response.ALAMAT + " RT/RW " + response.NO_RT + "/" + response.NO_RW + " Kel/Desa " + response.KEL_NAME;
  //             _loading.hide();
  //           });
  //         } else {
  //           $scope.aktif = true;
  //           $scope.registration.Nama_Lengkap = "";
  //           $scope.registration.Alamat = "";
  //           _store.put("SUKSES_DUKCAPIL", response.data.SUCCESS);
  //           _loading.hide();
  //         }
  //       }, function errorCallback(response) {
  //         $scope.aktif = true;
  //         $scope.registration.Nama_Lengkap = "";
  //         $scope.registration.Alamat = "";
  //         _store.put("SUKSES_DUKCAPIL", false);
  //         _loading.hide();
  //       })
  //     }
  //   } catch (err) {}
  // })
  $scope.changeDate = function () {
    _datePickerDefault.show($scope.TanggalLahir).then(function (date) {
      $scope.TanggalLahir = moment(date).format("YYYY-MM-DD");
      $scope.registration.Tanggal_Lahir = moment(date).format("DD/MM/YYYY");
    });
  }

  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  $scope.Daftar = function (ConfirmPassword) {
    _loading.show('Mohon Tunggu');
    setTimeout(function(){
      $scope.doDaftar(ConfirmPassword);
    }, 250);
  }
  $scope.doDaftar = function (ConfirmPassword) {
    function dataValid(valid) {
      if (!valid) {
        // message = message.slice(0, -2);
        _Sweet({
          title: 'Mohon Maaf',
          html: "<div style='font-size: 20px'>" + message + "</div>",
          type: "warning"
        });
        _loading.hide();
      } else {
        var deviceId = _store.get("UUID");
        if ($scope.RegisType == "Registration") {
          /* Parameter registration without medsos */
          var IP_ADDRESS = _store.get("IP_ADDRESS"),
          LATITUDE = _store.get("LATITUDE"),
          LONGITUDE = _store.get("LONGITUDE"), messageAlert = "", allPass = true;
          var cond = [null, undefined, ""]
          var callbackAlert = function(){}
          if (cond.Contains(LONGITUDE) || cond.Contains(LATITUDE)){
            messageAlert = "Mohon maaf, lokasi tidak terdeteksi<br>Silahkan aktifkan lokasi anda";
            callbackAlert = $rootScope.putLatLong;
            allPass = false;
          } else if (cond.Contains(IP_ADDRESS)) {
            messageAlert = "Mohon maaf, IP Address tidak terdeteksi<br>Sistem kami akan mengambil IP Address Anda terlebih dahulu";
            callbackAlert = $rootScope.putIpAdress;
            allPass = false;
          }
          if (allPass){
            var param = {
              CUSTOMER_USERNAME: $scope.registration.Username,
              CUSTOMER_PASSWORD: $scope.registration.Kata_Sandi,
              CUSTOMER_FULLNAME: $scope.registration.Nama_Lengkap,
              CUSTOMER_ID: $scope.registration.NIK.toString(),
              EMAIL: $scope.registration.Email,
              MOBILE_PHONE: 0 + $scope.registration.Nomor_Handphone.toString(),
              DEVICE_ID: deviceId,
              BORN_DATE: $scope.registration.Tanggal_Lahir,
              CUSTOMER_ADDRESS: $scope.registration.Alamat,
              GENDER: $scope.registration.Jenis_Kelamin,
              ADMIN_AREA_ID: $scope.registration.Provinsi,
              CITY_ID: $scope.registration.Kabupaten,
              DISTRICT_ID: $scope.registration.Kecamatan,
              IP_ADDRESS: IP_ADDRESS,
              LATITUDE: LATITUDE,
              LONGITUDE: LONGITUDE
            }
            /* API consume without medsos */
            _user.registration(param).then(function (response) {
              if (response.data.SUCCESS == "true" || response.data.SUCCESS || response.data.CODE == "200") {
                _Sweet({
                  title: 'Berhasil',
                  text: 'Registrasi Berhasil Silahkan Cek Email Anda Mohon Periksa Folder Spam Anda Apabila Belum Menerima E-mail Konfirmasi Akun Pada Kotak Masuk',
                  type: 'success',
                  confirmButtonText: 'Ok',
                }).then(function (succ) {
                  _loading.hide();
                  $state.go('login');
                });
              } else {
                var msg = response.data.MESSAGE;
                if (response.data.CODE == "400") {
                  _Sweet('Mohon Maaf', msg, 'error')
                  _loading.hide();
                } else {
                  _Sweet({
                    title: 'Error',
                    text: msg,
                    type: 'error',
                    confirmButtonText: 'OK',
                  });
                  _loading.hide();
                }
              }
            }, function () {
              _Sweet('Gagal', 'Periksa Koneksi Internet Anda', 'error');
              _loading.hide();
            });
          }else{
            _Sweet({
              title: "PERHATIAN",
              msg: messageAlert
            }).then(callbackAlert);
          }
        } else {
          /* Parameter registration with medsos */
          var params = {
            CUSTOMER_USERNAME: $scope.registration.Username,
            CUSTOMER_PASSWORD: $scope.registration.Kata_Sandi,
            CUSTOMER_FULLNAME: $scope.registration.Nama_Lengkap,
            CUSTOMER_ID: $scope.registration.NIK.toString(),
            EMAIL: $scope.registration.EmailMedsos,
            MOBILE_PHONE: 0 + $scope.registration.Nomor_Handphone.toString(),
            DEVICE_ID: deviceId,
            BORN_DATE: $scope.registration.Tanggal_Lahir,
            CUSTOMER_ADDRESS: $scope.registration.Alamat,
            GENDER: $scope.registration.Jenis_Kelamin,
            ADMIN_AREA_ID: $scope.registration.Provinsi,
            CITY_ID: $scope.registration.Kabupaten,
            DISTRICTS_ID: $scope.registration.Kecamatan,
            API_INTEGRATION: $scope.RegisType,
            IP_ADDRESS: _store.get("IP_ADDRESS"),
            LATITUDE: _store.get("LATITUDE"),
            LONGITUDE: _store.get("LONGITUDE")
          }
          /* API consume with medsos */
          _user.registrationWithMedsos(params).then(function (response) {
            if (response.data.SUCCESS == "true" || response.data.SUCCESS) {
              _Sweet({
                title: 'Berhasil',
                text: 'Registrasi Berhasil',
                type: 'success',
                confirmButtonText: 'Ok',
              }).then(function (succ) {
                _loading.hide();
                $scope.user.USERNAME = $scope.registration.Username;
                _store.putObj({
                  username: $scope.user.USERNAME,
                  token: response.data.TOKEN
                });
                _user.loginMedsos($scope.registration.EmailMedsos).then(function (response) {
                  _store.put("token", response.data.TOKEN);
                  _store.put("RegisType", "medsos");
                  _store.put("hasLoggedIn", true);
                  var token = _store.get("token");
                  _user.getData(token).then(function (response) {
                    _store.put("DataUser", response.data.USER);
                    $rootScope.DataUser = response.data.USER;
                    var img = response.data.USER.IMAGE;
                    _store.put("UserImage", img);
                    $scope.CountryCode = _store.get("CountryCode");
                    if ($scope.CountryCode == "IDN") {
                      _store.put("loggedInAs", "dalamNegeri");
                      $state.go('menu.home');
                    } else {
                      _store.put("loggedInAs", "luarNegeri");
                      $state.go('LaporDiri');
                    }
                  });
                  _loading.hide();
                })
              })
            } else {
              var msg = response.data.MESSAGE;
              if (response.data.CODE == "400") {
                _Sweet('Mohon Maaf', msg, 'error')
                _loading.hide();
              } else {
                _Sweet({
                  title: 'Error',
                  text: msg,
                  type: 'error',
                  confirmButtonText: 'OK',
                });
                _loading.hide();
              }
            }
          }, function () {
            _Sweet('Gagal', 'Periksa Koneksi Internet Anda', 'error');
            _loading.hide();
          });
        }
      }
      _loading.hide();
    }
    /* Validation registration without medsos */
    if ($scope.RegisType == "Registration") {
      var message = "",
        valid = true,
        dataNotNull = ["NIK", "Nama_Lengkap", "Username", "Kata_Sandi", "Tanggal_Lahir", "Email", "Nomor_Handphone", "Jenis_Kelamin", "Provinsi", "Kabupaten", "Kecamatan", "Alamat"]
      for (var i = 0; i < dataNotNull.length; i++) {
        var index = dataNotNull[i]
        if (!$scope.registration[index]) {
          message += index.replace(/_/g, " ") + " Tidak Boleh Kosong<br>";
          valid = false;
        }
      }
      if (re.test($scope.registration.Email) == false) {
        message += "Email Yang Anda Masukkan Tidak Benar<br>";
        valid = false;
      }

      if (ConfirmPassword != $scope.registration.Kata_Sandi) {
        message += "Password Tidak Sama<br>";
        valid = false;
      }
      // var Dukcapil = _store.get("SUKSES_DUKCAPIL");
      // if (Dukcapil == false || Dukcapil == "false") {
      if ($scope.registration.NIK && $scope.registration.NIK.length != 16) {
        message += "Masukkan NIK Dengan 16 Digit<br>";
        valid = false;
      }
      if ($scope.registration.NIK && !$scope.registration.NIK.isValidNik($scope.registration.Tanggal_Lahir, $scope.registration.Jenis_Kelamin)) {
        message += "NIK Tidak Sesuai<br>";
        valid = false;
      }
      // }
    } else {
      /* Validasi with medsos */
      var message = "",
        valid = true,
        dataNotNull = ["NIK", "Nama_Lengkap", "Username", "Kata_Sandi", "Tanggal_Lahir", "EmailMedsos", "Nomor_Handphone", "Jenis_Kelamin", "Provinsi", "Kabupaten", "Kecamatan", "Alamat"]
      dataNotNull2 = ["NIK", "Nama_Lengkap", "Username", "Kata_Sandi", "Tanggal_Lahir", "Email", "Nomor_Handphone", "Jenis_Kelamin", "Provinsi", "Kabupaten", "Kecamatan", "Alamat"]
      for (var i = 0; i < dataNotNull.length; i++) {
        var index = dataNotNull[i];
        var namaIndex = dataNotNull2[i];
        if (!$scope.registration[index]) {
          message += namaIndex.replace(/_/g, " ") + " Tidak Boleh Kosong<br>";
          valid = false;
        }
      }
      var Dukcapil = _store.get("SUKSES_DUKCAPIL");
      if (Dukcapil == false || Dukcapil == "false") {
        if ($scope.registration.NIK && $scope.registration.NIK.length != 16) {
          message += "Masukkan NIK Dengan 16 Digit<br>";
          valid = false;
        }
        if ($scope.registration.NIK && !$scope.registration.NIK.isValidNik($scope.registration.Tanggal_Lahir, $scope.registration.Jenis_Kelamin)) {
          message += "NIK Tidak Sesuai<br>";
          valid = false;
        }
      }else{
        if ($scope.registration.NIK && $scope.registration.NIK.length != 16) {
          message += "Masukkan NIK Dengan 16 Digit<br>";
          valid = false;
        }
        if ($scope.registration.NIK && !$scope.registration.NIK.isValidNik($scope.registration.Tanggal_Lahir, $scope.registration.Jenis_Kelamin)) {
          message += "NIK Tidak Sesuai<br>";
          valid = false;
        }
      }
      if (ConfirmPassword != $scope.registration.Kata_Sandi) {
        message += "Password Tidak Sama<br>";
        valid = false;
      }
    }
    dataValid(valid);
  }

  // Button Kembali
  $scope.Kembali = function () {
    // window.plugins.googleplus.logout();
    // window.facebookConnectPlugin.logout();
    $rootScope.Logout();
  };

})
