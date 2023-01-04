app.controller('JadwalDetailLuarNegeriCtrl', function (_store, $scope, $ionicSideMenuDelegate, $state, $stateParams, _html2canvas, _booking, _Sweet, _QR, _FileProcess, _toastCtrl, _pdfCreate, _File) {
  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    
    $scope.JadwalDetail = JSON.parse($stateParams.data);
    $scope.FULLNAME = $scope.JadwalDetail.FULL_NAME;
    $scope.APPLICANT_ID = $scope.JadwalDetail.APPLICANT_ID;
    $scope.PASSPORT_NUMBER = $scope.JadwalDetail.PASSPORT_NUMBER;
    $scope.SERVICE_DATE = moment($scope.JadwalDetail.SERVICE_DATE).locale("id").format("dddd, LL");
    $scope.UNIT_NAME = $scope.JadwalDetail.UNIT_NAME;
    $scope.START_TIME = $scope.JadwalDetail.START_TIME;
    $scope.END_TIME = $scope.JadwalDetail.END_TIME;
    $scope.KODE_ANTRIAN = $scope.JadwalDetail.QUEUE_NUMBER;
    var result = $scope.JadwalDetail.QR_CODE;
    $scope.hasilQR = btoa(angular.toJson(result));
    var JadwalType = _store.get('JadwalType');
    if (JadwalType == "PembuatanBaru") {
      $scope.NIK = true;
      $scope.PasporNumber = false;
    } else {
      $scope.NIK = false;
      $scope.PasporNumber = true;
    }
  });

  $scope.timeMeet = function (start, end) {
    start = String(start);
    end = String(end);
    return start.substr(0, start.length - 2) + ":" + start.slice(-2) + " - " + end.substr(0, end.length - 2) + ":" + end.slice(-2);
  }

  $scope.Back = function () {
    $state.go('mainmenu.jadwal');
  }

  $scope.Jadwal = function () {
    _pdfCreate.toPngObj(["id-qr-code"], function (pages) {
      _pdfCreate.create(pages, 'blob').then(function (data) {
        _File.savePdf(data.data, $scope.KODE_ANTRIAN);
      });
    }, function (err) {
      console.error(err);
    });
  }

  $scope.Batal = function () {
    _Sweet({
      title: 'ANDA YAKIN AKAN MEMBATALKAN ANTRIAN',
      text: 'JIKA ANTRIAN DIBATALKAN, ANDA HANYA AKAN DAPAT MEMBUAT PERMOHONAN KEMBALI SETELAH 1 BULAN',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YA',
      cancelButtonText: 'BATAL',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        _booking.deleteQueue($scope.JadwalDetail).then(function (response) {
          if (response.data.SUCCESS) {
            _Sweet('BATALKAN!', 'JADWAL ANDA TELAH DIBATALKAN', 'success').then(function (succ) {
              $state.go('mainmenu.jadwal', {});
            });
          } else {
            _Sweet('MOHON MAAF', 'JADWAL ANDA TIDAK DAPAT DIBATALKAN 2 HARI SEBELUM KEDATANGAN', 'warning');
          }
        })
      }
    });
  }
})
