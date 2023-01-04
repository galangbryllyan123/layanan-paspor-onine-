app.controller('MainMenuCtrl', function (_Permission, _grantPermission, _File, _Esri, $scope, $rootScope, $state, _Camera, _store, _Sweet, _user, $ionicHistory) {

  $scope.$on("$ionicView.beforeEnter", function () {
    $scope.DataUser = _store.get("DataUser");
    $scope.Tanggallahir = moment($scope.DataUser.BORN_DATE).locale('id').format('LL');
    _user.getData().then(function (resp) {
      var img = resp.data.USER.IMAGE;
      _store.put("UserImage", img);
      $scope.profileImage = _Camera.data + _store.get('UserImage');
    });
    $scope.profileImage = _Camera.data + _store.get('UserImage');
  });

  $scope.pengaduan = function () {
    $state.go('mainmenu.pengaduan');
  };

  $scope.LaporDiri = function () {
    $state.go('mainmenu.LaporDiriDetail')
  };

  $scope.antrian = function () {
    $state.go('mainmenu.ListKBRI');
  };

  $scope.Informasi = function () {
    $state.go('mainmenu.InformasiLuarNegeri');
  };

  $scope.panduan = function () {
    $state.go('mainmenu.panduanHome');
  };

  $scope.profil = function () {
    $state.go('mainmenu.ProfilLuarNegeri');
  };

  $scope.takePicture = function () {
    function callback(data) {
      var img = _Camera.data + data;
      _store.put("UserImage", data);
      $scope.profileImage = img;
      _loading.show("Harap Tunggu...");
      _user.uploadImage(data).then(function (resp) {
        _loading.hide();
        console.info(resp);
      }, function (err) {
        _loading.hide();
        console.error(err);
      });
    }
    _Sweet({
      title: "PILIH",
      showCancelButton: true,
      cancelButtonText: "Gallery",
      confirmButtonText: "Selfie"
    }).then(function (resp) {
      if (resp.value) {
        _Camera.getPicture().then(callback);
      } else {
        _Camera.fromGallery().then(callback);
      }
    });
  }

  // $scope.Logout = function () {
  //   _store.removeObj(['token', 'username', 'hasLoggedIn', 'DataUser', 'UserImage', 'loggedInAs']);
  //   window.plugins.googleplus.logout();
  //   facebookConnectPlugin.logout();
  //   $rootScope.init();
  //   $state.go('login');
  // }
})
