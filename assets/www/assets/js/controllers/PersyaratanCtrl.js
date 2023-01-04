app.controller('PersyaratanCtrl', function ($scope, $state) {

      // Button Kembali
      $scope.kembali = function () {
        $state.go('menu.informasi');
      };

    })