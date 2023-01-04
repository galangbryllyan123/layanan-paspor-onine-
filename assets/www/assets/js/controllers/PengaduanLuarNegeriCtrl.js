app.controller('PengaduanLuarNegeriCtrl', function ($scope, $state) {

  $scope.kembali = function () {
    $state.go('mainmenu.beranda');
  };

})
