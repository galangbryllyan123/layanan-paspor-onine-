app.controller('PanduanMenuCtrl', function ($scope, $state, _store) {
      
      $scope.loggedInAs = _store.get('loggedInAs');
      console.log($scope.loggedInAs)
      if ($scope.loggedInAs == "dalamNegeri") {
        $scope.kembali = function () {
          $state.go('menu.home');
        };
      } else {
        $scope.kembali = function () {
          $state.go('mainmenu.beranda');
        };
      }

      $scope.PanduanPembuatanBaru = function () {
        if ($scope.loggedInAs == "dalamNegeri") {
          $state.go('menu.panduan');
        } else {
          $state.go('mainmenu.panduan');
        }
      }

      $scope.PanduanPerpanjangan = function () {
        if ($scope.loggedInAs == "dalamNegeri") {
          $state.go('menu.panduanPerpanjangan');
        } else {
          $state.go('mainmenu.panduanPerpanjangan');
        }
      }
    })