app.controller('AktivasiCtrl', function ($state, $scope, _user, _Sweet, _loading) {
  $scope.user = {};
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  $scope.Resend = function () {
    function dataValid(valid) {
      _loading.show('Mohon Tunggu...');
      if (!valid) {
        // message = message.slice(0, -2);
        _Sweet({
          title: 'Mohon Maaf',
          html: "<div style='font-size: 20px'>" + message + "</div>",
          type: "warning"
        });
        _loading.hide();
      } else {
        $scope.SendingData = true;
        _user.resendEmail($scope.user.EMAIL).then(function (response) {
          _loading.hide();
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
    }
    var message = "",
      valid = true;
    if (re.test($scope.user.EMAIL) == false) {
      message += "Email Yang Anda Masukkan Tidak Benar<br>";
      valid = false;
    }
    dataValid(valid);
  }
})
