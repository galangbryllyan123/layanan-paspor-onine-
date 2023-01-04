app.controller('HomeCtrl', function ($scope, $state, _Sweet, _store, _Camera, _user) {
  $scope.$on("$ionicView.beforeEnter", function () {
    $scope.date = moment().locale('id').format('LL');
    $scope.DataUser = _store.get('DataUser');
    $scope.profileImage = _Camera.data + _store.get('UserImage');
  });

  $scope.Antrian = function () {
    $state.go('menu.listkanim');
  };

  $scope.Profil = function () {
    $state.go('menu.profil');
  };

  $scope.Panduan = function () {
    $state.go('menu.panduanHome');
  };

  $scope.Informasi = function () {
    $state.go('menu.informasi');
  };

  $scope.LaporDiri = function () {
    _Sweet('Mohon Maaf', 'Fitur Ini Hanya Dapat Digunakan Ketika Anda Sedang Berada Di Luar Negeri', 'info');
  }

})
