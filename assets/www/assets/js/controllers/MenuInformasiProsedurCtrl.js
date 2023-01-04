app.controller('MenuInformasiProsedurCtrl', function ($scope, $state, _store) {
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.roleLogin = _store.get('loggedInAs');
  });
  $scope.kembali = function () {
    if($scope.roleLogin == "dalamNegeri"){
      $state.go('menu.informasi');
    }else{
      $state.go('mainmenu.InformasiLuarNegeri');
    }
  };

})
