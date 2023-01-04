app.controller('ProfilCtrl', function ($ionicLoading, $ionicHistory, $scope, $rootScope, $compile, $ionicSideMenuDelegate, $state, _Camera, _http, _user, _Sweet, _store, _loading, _wilayah) {
  $scope.$on("$ionicView.beforeEnter", function () {
    _user.getData().then(function (resp) {
      var img = resp.data.USER.IMAGE;
      _store.put("UserImage", img);
      $scope.profileImage = _Camera.data + _store.get('UserImage');
    });
    
    _wilayah.Provinsi().then(function (response) {
      $scope.dataObjProvinsi = response.data.adminarea;
    });
    $scope.textCommand = 'UBAH';
    $scope.modalSelected = {};
    $scope.$watch("modalSelected.Provinsi", function (newVal) {
      try {
        if (Object.size(newVal) > 2) {
          $scope.modalSelected.Kabupaten = $scope.modalSelected.Kecamatan = "";
          $scope.DataUser.Provinsi = newVal.id;
          console.log(newVal.id)
        }
        _wilayah.Kota().then(function (response) {
          var kota = response.data.cities;
          $scope.dataObjKabupaten = kota.filter(function (s) {
            return s.admin_area_id == $scope.DataUser.Provinsi;
          })
        });
      } catch (err) {}
    });
    $scope.$watch("modalSelected.Kabupaten", function (newVal) {
      try {
        if (Object.size(newVal) > 2) {
          $scope.modalSelected.Kecamatan = "";
          $scope.DataUser.Kabupaten = newVal.id;
        }
        _wilayah.Kecamatan().then(function (response) {
          var kecamatan = response.data.district;
          $scope.dataObjKecamatan = kecamatan.filter(function (s) {
            return s.city_id == $scope.DataUser.Kabupaten;
          })
        });
      } catch (err) {}
    });
    $scope.$watch("modalSelected.Kecamatan", function (newVal) {
      try {
        if (Object.size(newVal) > 2) {
          $scope.DataUser.Kecamatan = newVal.id;
        }
      } catch (err) {}
    });
    $scope.modalSelected.Provinsi = {
      id: $scope.DataUser.ADMIN_AREA_ID,
      area_name: $scope.DataUser.AREA_NAME
    }
    $scope.modalSelected.Kabupaten = {
      id: $scope.DataUser.CITY_ID,
      city_name: $scope.DataUser.CITY_NAME
    }
    $scope.modalSelected.Kecamatan = {
      id: $scope.DataUser.DISTRICTS_ID,
      district_name: $scope.DataUser.DISTRICT_NAME
    }
  });
  window.http = _http = _http;

  $scope.Kembali = function () {
    if ($rootScope.currentState == 'mainmenu.ProfilLuarNegeri') {
      $state.go('mainmenu.beranda');
    } else {
      $state.go('menu.home');
    }
  }

  $rootScope.changePassword = function (DataPassword) {
    $scope.Password = DataPassword || {}
    _Sweet({
      title: 'UBAH PASSWORD',
      html: "<html-alert />",
      confirmButtonText: "GANTI",
      onOpen: function () {
        var html = ['<div class="list">',
          '<div class="left">',
          '<label for="Password" class="label-password">Password</label>',
          '<input id="Password" placeholder="Password" class="input-costum-password" type="password" ng-model="Password.Password"/>',
          '<label for="KonfirmasiPassword" class="label-password">Konfirmasi Password</label>',
          '<input id="KonfirmasiPassword" placeholder="Konfirmasi Password" class="input-costum-password" type="password" ng-model="Password.KonfirmasiPassword"/>',
          '</div>',
          '</div>'
        ].join("");
        setTimeout(function () {
          jQuery("html-alert").html($compile(html)($scope));
          $scope.$apply();
        }, 50);
      }
    }).then(function (response) {
      function reOpen(){
        $rootScope.changePassword($scope.Password);
      }
      if (!response.dissmiss){
        var Password = $scope.Password;
        if (!$scope.Password.Password) {
          _Sweet("Mohon Maaf", "Password Tidak Boleh Kosong", "warning").then(reOpen);
        } else if (!$scope.Password.KonfirmasiPassword) {
          _Sweet("Mohon Maaf", "Konfirmasi Password Tidak Boleh Kosong", "warning").then(reOpen);
        } else {
          _loading.show("Harap tunggu...");
          _user.updatePassword($scope.Password.Password).then(function (response) {
            _loading.hide();
            if (Password.KonfirmasiPassword != Password.Password) {
              _Sweet("Mohon Maaf", "Password Tidak Sama", "warning").then(reOpen);
            } else if (!response.data.SUCCESS && response.data.CODE == "1407") {
              _Sweet("Mohon Maaf", "Password Tidak Boleh Kosong", "warning").then(reOpen);
            } else if (!response.data.SUCCESS && response.data.CODE == "401") {
              _Sweet("Mohon Maaf", "Sesi Anda Telah Berakhir Silahkan Login Kembali", "error").then($rootScope.Logout);
              // .then(function (response) {
              //   _store.removeAll();
              //   $ionicHistory.clearHistory();
              //   $ionicHistory.clearCache();
              //   $state.go('splashscreen', {}, {
              //     reload: true
              //   });
              // });
            } else {
              _Sweet("Berhasil", "Password Anda Berhasil Di Ubah", "success");
            }
          });
        }
      }
    });
  }

  $scope.updateData = function (confirmPass) {
    if ($scope.textCommand == 'UBAH') {
      $scope.textCommand = 'SIMPAN';
    } else {
      if (confirmPass == $scope.DataUser.CUSTOMER_PASSWORD) {
        _loading.show("Harap Tunggu...");
        $scope.DataUser.MOBILE_PHONE = $scope.DataUser.MOBILE_PHONE.toString();
        $scope.DataUser.ADMIN_AREA_ID = $scope.modalSelected.Provinsi.id;
        $scope.DataUser.CITY_ID = $scope.modalSelected.Kabupaten.id;
        $scope.DataUser.DISTRICTS_ID = $scope.modalSelected.Kecamatan.id;
        _user.updateData($scope.DataUser).then(function (succ) {
          _loading.hide();
          if (succ.data.SUCCESS) {
            _Sweet("Berhasil", "Update Data Berhasil", "success");
            _user.getData().then(function (response) {
              _store.put("DataUser", response.data.USER);
              var img = response.data.USER.IMAGE;
              _store.put("UserImage", img);
            });
          } else {
            _Sweet("Gagal", "Update Data Gagal", "error");
          }
          $scope.textCommand = 'UBAH';
        });
      } else {
        _Sweet("", "Password Tidak Sama", "error");
      }
    }
  }

  $scope.takePicture = function () {
    function callback(data) {
      var img = _Camera.data + data;
      _store.put("UserImage", data);
      $scope.profileImage = img;
      _loading.show("Harap Tunggu...");
      _user.uploadImage(data).then(function (resp) {
        _loading.hide();
      }, function (err) {
        _loading.hide();
      });
    }
    _Sweet({
      title: "PILIH",
      showCancelButton: true,
      cancelButtonText: "Gallery",
      confirmButtonText: "Foto"
    }).then(function (resp) {
      if (resp.value) {
        _Camera.getPicture().then(callback);
      } else {
        _Camera.fromGallery().then(callback);
      }
    });
  }

})
