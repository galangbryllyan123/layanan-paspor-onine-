app.controller('LupaPasswordCtrl', function ($state, $scope, _user, _Sweet) {
      $scope.user = {};
      $scope.LupaPassword = function () {
        $scope.SendingData = true;
        _user.forgetPassword($scope.user).then(function (response) {
          if (response.data.CODE == "200" || response.data.SUCCESS) {
            _Sweet({
              title: '',
              text: 'Permintaan Anda Berhasil Silahkan Cek Email Anda',
              type: 'success',
              confirmButtonText: 'OK',
            }).then(function (succ) {
              $state.go('login');
            });
            $scope.SendingData = false;
          } else {
            $scope.SendingData = false;
            _Sweet({
              title: 'Gagal',
              text: 'Email / Username Anda Tidak Terdaftar',
              type: 'error',
              confirmButtonText: 'OK',
            });
          }
        });
      }
    })