app.controller('PanduanPerpanjanganCtrl', function ($scope, $state, _store) {
      $scope.loggedInAs = _store.get('loggedInAs');
      if ($scope.loggedInAs == "dalamNegeri") {
        $scope.kembali = function () {
          $state.go('menu.panduanHome');
        };
      } else {
        $scope.kembali = function () {
          $state.go('mainmenu.panduanHome');
        };
      }
    })