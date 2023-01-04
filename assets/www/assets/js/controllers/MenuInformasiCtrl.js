app.controller('MenuInformasiCtrl', function ($scope, $state, _store) {
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.roleLogin = _store.get('loggedInAs');
  });
  $scope.Persyaratan = function () {
    if ($scope.roleLogin == "dalamNegeri") {
      $state.go('menu.persyaratan');
    } else {
      $state.go('mainmenu.InformasiPersyaratan');
    }
  };

  $scope.Umum = function () {
    if ($scope.roleLogin == "dalamNegeri") {
      $state.go('menu.umum');
    } else {
      $state.go('mainmenu.InformasiUmum');
    }
  };

  $scope.Prosedur = function () {
    if ($scope.roleLogin == "dalamNegeri") {
      $state.go('menu.prosedur');
    } else {
      $state.go('mainmenu.InformasiProsedur');
    }
  };

  $scope.Biaya = function () {
    if ($scope.roleLogin == "dalamNegeri") {

      $state.go('menu.biaya');
    } else {
      $state.go('mainmenu.InformasiBiaya');
    }
  };

  $scope.Perubahan = function () {
    if ($scope.roleLogin == "dalamNegeri") {
      $state.go('menu.perubahan');
    } else {
      $state.go('mainmenu.InformasiPerubahan');
    }

  };

  $scope.Pembatalan = function () {
    if ($scope.roleLogin == "dalamNegeri") {
      $state.go('menu.pembatalan');
    } else {
      $state.go('mainmenu.InformasiPembatalan');
    }

  };

  $scope.kembali = function () {
    if ($scope.roleLogin == "dalamNegeri") {
      $state.go('menu.home');
    } else {
      $state.go('mainmenu.beranda');
    }

  };

})
