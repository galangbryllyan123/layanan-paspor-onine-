app.controller('BerandaLuarCtrl', function (_store, $scope, $state, _user, _Camera, $ionicSideMenuDelegate) {
  $scope.$on("$ionicView.beforeEnter", function () {
    $scope.date = moment().locale('id').format('LL');
    $scope.DataUser = _store.get('DataUser');
    $scope.profileImage = _Camera.data + _store.get('UserImage');
  });
  $scope.MainMenu = function () {
    $state.go('mainmenu.beranda');
  };

  $scope.HakKewajiban = function () {
    $state.go('HakDanKewajiban')
  };

  $scope.Informasi = function () {
    $state.go('mainmenu.InformasiLuarNegeri');
  };

  $scope.LaporDiri = function () {
    $state.go('mainmenu.LaporDiriDetail')
  };

  $scope.Panduan = function () {
    $state.go('mainmenu.panduanHome')
  };

  $scope.Antrian = function () {
    $state.go('mainmenu.ListKBRI')
  };

  $scope.Profil = function () {
    $state.go('mainmenu.ProfilLuarNegeri')
  };

})
