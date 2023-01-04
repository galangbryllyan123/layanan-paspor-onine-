app.controller('JadwalLuarCtrl', function (_Sweet, $scope, $ionicSideMenuDelegate, $state, _booking, _store, $rootScope) {

  $scope.$on("$ionicView.beforeEnter", function () {
    _booking.getQueueCreate().then(function (success) {
      if (success.data.QUEUE_CREATE == undefined) {
        $scope.PermohonanNull = true;
      } else {
        $scope.JadwalDataCreate = success.data.QUEUE_CREATE || [];
        var data = JSON.stringify(success.data.QUEUE_CREATE);
        $scope.PermohonanNull = false;
      }
    });
    _booking.getQueueUpdate().then(function (success) {
      if (success.data.QUEUE_UPDATE == undefined) {
        $scope.PermohonanGantiNull = true;
      } else {
        $scope.JadwalDataUpdate = success.data.QUEUE_UPDATE || [];
        var data = JSON.stringify(success.data.QUEUE_UPDATE);
        $scope.PermohonanGantiNull = false;
      }
    });
  });

  $scope.timeMeet = function (start, end) {
    start = String(start);
    end = String(end);
    return start.substr(0, start.length - 2) + ":" + start.slice(-2) + " - " + end.substr(0, end.length - 2) + ":" + end.slice(-2);
  }

  $scope.JadwalDetailBaru = function (data) {
    // _Sweet('', 'SILAHKAN SCREENSHOOT JADWAL ANDA ATAU GUNAKAN TOMBOL (SIMPAN PDF) UNTUK MENYIMPAN JADWAL ANDA KE PENYIMPANAN INTERNAL HANDPHONE ANDA', 'success');
    _Sweet({
      type: 'info',
      title: '',
      text: 'SILAHKAN SCREENSHOOT JADWAL ANDA ATAU GUNAKAN TOMBOL (SIMPAN PDF) UNTUK MENYIMPAN JADWAL ANDA KE PENYIMPANAN INTERNAL HANDPHONE ANDA',
    })
    $state.go('mainmenu.JadwalDetailLuarNegeri', {
      data: JSON.stringify(data)
    });
    _store.put('JadwalType', 'PembuatanBaru');
  };

  $scope.JadwalDetailPenggantian = function (data) {
    // _Sweet('', 'SILAHKAN SCREENSHOOT JADWAL ANDA ATAU GUNAKAN TOMBOL (SIMPAN PDF) UNTUK MENYIMPAN JADWAL ANDA KE PENYIMPANAN INTERNAL HANDPHONE ANDA', 'success');
    _Sweet({
      type: 'info',
      title: '',
      text: 'SILAHKAN SCREENSHOOT JADWAL ANDA ATAU GUNAKAN TOMBOL (SIMPAN PDF) UNTUK MENYIMPAN JADWAL ANDA KE PENYIMPANAN INTERNAL HANDPHONE ANDA',
    })
    $state.go('mainmenu.JadwalDetailLuarNegeri', {
      data: JSON.stringify(data)
    });
    _store.put('JadwalType', 'Penggantian');
  };

})
