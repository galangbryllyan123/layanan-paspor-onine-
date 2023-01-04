app.controller('MenuDalamNegeriCtrl', function (_Permission, _grantPermission, _File, _Esri, _user, $rootScope, $scope, $ionicHistory, _loading, $ionicSideMenuDelegate, $state, _Camera, _Sweet, _store) {

  $scope.$on("$ionicView.beforeEnter", function () {
    
    $scope.DataUser = _store.get("DataUser");
    $scope.Tanggallahir = moment($scope.DataUser.BORN_DATE).locale('id').format('LL');
    _user.getData().then(function (resp) {
      $rootScope.img = resp.data.USER.IMAGE;
      _store.put("UserImage", $rootScope.img);
      $scope.profileImage = _Camera.data + _store.get('UserImage');
    });
    $scope.profileImage = _Camera.data + _store.get('UserImage');
  });

  $scope.profil = function () {
    $state.go('menu.profil');
  };

  $scope.Informasi = function () {
    $state.go('menu.informasi');
  };

  $scope.panduan = function () {
    $state.go('menu.panduanHome');
  };

  $scope.pengaduan = function () {
    $state.go('menu.pengaduan');
  };

  $scope.antrian = function () {
    $state.go('menu.listkanim');
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
