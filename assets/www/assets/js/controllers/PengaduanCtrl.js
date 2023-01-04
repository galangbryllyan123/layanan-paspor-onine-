app.controller('PengaduanCtrl', function ($scope, $state) {

  // Button Kembali
  $scope.Kembali = function () {
    $state.go('menu.home');
  };

})
