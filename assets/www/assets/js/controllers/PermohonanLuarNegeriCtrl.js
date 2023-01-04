app.controller('PermohonanLuarNegeriCtrl', function ($scope, $compile, $ionicHistory, $rootScope, $timeout, $state, $stateParams, _datePicker, _http, _store, _booking, _Sweet) {

  $scope.swalHide = function () {
    $(".swal2-container").hide();
  }
  $scope.swalShow = function () {
    $(".swal2-container").show();
  }

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    _datePicker.dateCustom.aDate_AVAILABLE = []
    _datePicker.dateCustom.aDate_EMPTY = []
    _datePicker.dateCustom.aDate_HOLIDAY = []
    $rootScope.DataUser = _store.get("DataUser");
    $scope.kantorTerpilih = JSON.parse($stateParams.data);
    $scope.response = JSON.parse($stateParams.response);
    $scope.Date_AVAILABLE = $scope.response.data.AVAILABLE;
    $scope.Date_EMPTY = $scope.response.data.EMPTY;
    $scope.Date_HOLIDAY = $scope.response.data.HOLIDAY;
    $scope.pushDate("aDate_AVAILABLE", $scope.Date_AVAILABLE);
    $scope.pushDate("aDate_EMPTY", $scope.Date_EMPTY);
    $scope.pushDate("aDate_HOLIDAY", $scope.Date_HOLIDAY);
    $rootScope.tampilanKanimName = $scope.kantorTerpilih.UNIT_NAME;
    $rootScope.tampilanTotalKuota = 0;
    $rootScope.tampilanToDate = "";
    for (var i = 0; i < $scope.Date_AVAILABLE.length; i++) {
      $rootScope.tampilanTotalKuota += parseInt($scope.Date_AVAILABLE[i].AVAIL_TOTAL);
      if (i + 1 == $scope.Date_AVAILABLE.length) {
        $rootScope.tampilanToDate = $scope.Date_AVAILABLE[i].DATE;
      }
    }
  });

  $scope.pushDate = function (key, data) {
    for (var i in data) {
      if (data[i].hasOwnProperty("DATE")) _datePicker.dateCustom[key].push(new Date(data[i].DATE).setHours(0, 0, 0, 0));
    }
  }

  $scope.form = {
    quotaSedia: 0
  }

  /* Function Pilih Tanggal */
  $scope.pilihTanggal = function () {
    _datePicker.show().then(function (value) {
      var tampil = moment(value).locale("id").format("LL");
      value = moment(value).locale("id").format("YYYY-MM-DD");
      $scope.form.tanggalTampil = tampil;
      $scope.form.tanggal = value;
      $scope.form.waktu = "";
      $scope.form.quotaSedia = 0;
      /* Selection Radio Button */
      var today = moment().format("YYYY-MM-DD");
      var jam = moment().format("HH");
      if (today == value) {
        if (jam < 08) {
          $("#Pagi").prop("disabled", false);
          $("#Siang").prop("disabled", false);
        } else if (jam > 07 && jam < 12) {
          $("#Pagi").prop("disabled", false);
          $("#Siang").prop("disabled", false);
        } else if (jam > 12 && jam < 16) {
          $("#Pagi").prop("disabled", true);
          $("#Siang").prop("disabled", false);
        } else {
          _Sweet({
            title: 'Mohon Maaf',
            text: 'Jam Kerja Telah Berakhir Silahkan Pilih Tanggal Lain',
            type: 'warning',
            confirmButtonText: 'OK',
          }).then(function (succ) {
            $scope.pilihTanggal();
          });
        }
      } else {
        $("#Pagi").prop("disabled", false);
        $("#Siang").prop("disabled", false);
        $scope.pagiSiang();
      }
    });
  }

  $scope.Collapse = function () {
    _Sweet({
      html: '<div id="data-collapse"></div>',
      onOpen: function () {
        var html = ['<div class="row text-info header">',
          '<div class="col col-25 bold">TANGGAL</div>',
          '<div class="col col-25 bold">TOTAL KUOTA</div>',
          '<div class="col col-25 bold">PENGANTRI</div>',
          '<div class="col col-25 bold">TOTAL KUOTA TERSEDIA</div>',
          '</div>',
          '<div class="row text-info" ng-repeat="data in Date_AVAILABLE">',
          "<div class=\"col col-25\">{{data.DATE | date : 'dd/MM/yyyy'}}</div>",
          '<div class="col col-25">{{data.QUOTA_TOTAL}}</div>',
          '<div class="col col-25">{{data.PARTICIPANT}}</div>',
          '<div class="col col-25">{{data.AVAIL_TOTAL}}</div>',
          '</div>',
          '<div class="row text-info" ng-repeat="data in Date_EMPTY">',
          "<div class=\"col col-25\">{{data.DATE | date : 'dd/MM/yyyy'}}</div>",
          '<div class="col col-25">{{data.QUOTA_TOTAL}}</div>',
          '<div class="col col-25">{{data.PARTICIPANT}}</div>',
          '<div class="col col-25">{{data.AVAIL_TOTAL}}</div>',
          '</div>'
        ].join("");
        jQuery("#data-collapse").html($compile(html)($scope));
        jQuery("#data-collapse").parents(".swal2-popup").css("padding", "10px");
        $scope.$apply();
      }
    })
  }

  $scope.pagiSiang = function () {
    var tanggal = moment($scope.form.tanggal).format("YYYY-MM-DD");
    /* Selection Radio Button */
    var today = moment().format("YYYY-MM-DD");
    var jam = moment().format("HH");
    if (today == tanggal) {
      if (jam < 08) {
        var range = {
          Pagi: {
            START_TIME: 800,
            END_TIME: 1200
          },
          Siang: {
            START_TIME: 1300,
            END_TIME: 1600
          }
        };
      } else if (jam > 07 && jam < 12) {
        if (jam == 08) {
          var range = {
            Pagi: {
              START_TIME: 800,
              END_TIME: 1200
            },
            Siang: {
              START_TIME: 1300,
              END_TIME: 1600
            }
          };
        } else if (jam == 09) {
          var range = {
            Pagi: {
              START_TIME: 900,
              END_TIME: 1200
            },
            Siang: {
              START_TIME: 1300,
              END_TIME: 1600
            }
          };
        } else if (jam == 10) {
          var range = {
            Pagi: {
              START_TIME: 1000,
              END_TIME: 1200
            },
            Siang: {
              START_TIME: 1300,
              END_TIME: 1600
            }
          };
        } else {
          var range = {
            Pagi: {
              START_TIME: 1100,
              END_TIME: 1200
            },
            Siang: {
              START_TIME: 1300,
              END_TIME: 1600
            }
          };
        }
      } else if (jam > 12 && jam < 16) {
        if (jam == 13) {
          var range = {
            Siang: {
              START_TIME: 1300,
              END_TIME: 1600
            }
          };
        } else if (jam == 14) {
          var range = {
            Siang: {
              START_TIME: 1400,
              END_TIME: 1600
            }
          };
        } else {
          var range = {
            Siang: {
              START_TIME: 1500,
              END_TIME: 1600
            }
          };
        }
      } else {
        _Sweet({
          title: 'Mohon Maaf',
          text: 'Jam Kerja Telah Berakhir Silahkan Pilih Tanggal Lain',
          type: 'warning',
          confirmButtonText: 'OK',
        }).then(function (succ) {
          $scope.pilihTanggal();
        });
      }
    } else {
      var range = {
        Pagi: {
          START_TIME: 700,
          END_TIME: 1200
        },
        Siang: {
          START_TIME: 1300,
          END_TIME: 1600
        }
      };
    }
    _http.post(config.api + "/layanan/wni/quota/info", {
      BUSINESS_UNIT_ID: $scope.kantorTerpilih.ID,
      SERVICE_DATE: tanggal,
      START_TIME: range[$scope.form.waktu].START_TIME,
      END_TIME: range[$scope.form.waktu].END_TIME,
      TOKEN: _store.get("token")
    }).then(function (response) {
      if (response.data.SUCCESS && response.data.QUOTA.length > 0) {
        $scope.quotaSedia = response.data.QUOTA[0];
        $scope.form.quotaSedia = $scope.quotaSedia.AVAILABILITY;
      } else if (response.data.CODE == "404") {
        _Sweet({
          title: 'Mohon Maaf',
          text: 'Pilih Tanggal Dengan Kuota Tersedia',
          type: 'warning',
          confirmButtonText: 'OK',
        }).then(function (succ) {
          $scope.pilihTanggal();
        });
      } else if (response.data.CODE == "401") {
        _Sweet({
          title: 'Mohon Maaf',
          text: response.data.MESSAGE,
          type: 'warning',
          confirmButtonText: 'OK',
        }).then(function (succ) {
          _store.removeAll();
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
          $state.go('login', {}, {
            reload: true
          });
        });
      } else {
        $scope.quotaSedia = 0;
        $scope.form.quotaSedia = $scope.quotaSedia;
      }
    }, function () {
      $scope.quotaSedia = 0;
      $scope.form.quotaSedia = $scope.quotaSedia;
    });
  }

  

  $scope.Kembali = function () {
    $state.go('mainmenu.ListKBRI');
  };

  $scope.PermohonanDetail = function () {

    var data = Object.assign($scope.form, $scope.quotaSedia),
      kantorTerpilih = $scope.kantorTerpilih;
    try {
      var tanggal = $scope.form.tanggal;
      tanggal = new Date(tanggal).setHours(0, 0, 0, 0);
      if ($scope.form.jumlah == undefined) {
        _Sweet("Mohon Maaf", "Silahkan Pilih Jumlah Permohonan", "warning");
      } else {
        if ($.inArray(tanggal, _datePicker.dateCustom.aDate_AVAILABLE) >= 0) {
          if ($scope.form.waktu == "") {
            _Sweet("Mohon Maaf", "Silahkan Pilih Waktu Kedatangan", "warning");
          } else {
            _Sweet({
              title: '',
              text: 'SATU AKUN DAPAT MENDAFTARKAN 1 s/d 5 PERMOHONAN, DALAM SATU PROSES. APABILA PEMOHON SUDAH MENGAJUKAN PERMOHONAN, PEMOHON DAPAT MEMBUAT PERMOHONAN KEMBALI SETELAH 1 BULAN DARI JADWAL YANG TELAH DITENTUKAN SEBELUMNYA',
              type: '',
              confirmButtonText: 'OK',
            }).then(function (succ) {
              $state.go('mainmenu.PermohonanDetailLuarNegeri', {
                form: JSON.stringify(data),
                kanim: JSON.stringify(kantorTerpilih),
                jumlah: data.jumlah,
                kantorTerpilih: $stateParams.data,
                response: $stateParams.response
              });
            });
          }
        } else {
          _Sweet({
            title: 'Mohon Maaf',
            text: 'Pilih Tanggal Dengan Kuota Tersedia',
            type: 'warning',
            confirmButtonText: 'OK',
          }).then(function (succ) {
            $scope.pilihTanggal();
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  $scope.getNumber = function (num) {
    var result = []
    for (var i = 0; i < num; i++) {
      result.push(i + 1);
    }
    return result;
  }


})
