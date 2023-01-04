app.controller('PermohonanDetailCtrl', function ($compile, _user, _loading, $templateCache, $scope, $rootScope, $stateParams, $state, $ionicLoading, _Sweet, _store, _Sweet, _MRZ, _booking, _wilayah, _toastCtrl) {
  $scope.setWatcher = function () {
    $rootScope.alertPermohonan = "templates/alert/permohonan.html";
    $scope.modalSelected = [{}, {}, {}, {}, {}]
    $scope.dataObjProvinsi = [
      [],
      [],
      [],
      [],
      []
    ]
    $scope.dataObjKabupaten = [
      [],
      [],
      [],
      [],
      []
    ]
    $scope.dataObjKecamatan = [
      [],
      [],
      [],
      [],
      []
    ]
    /* GET Service Provinsi */
    _wilayah.Provinsi().then(function (response) {
      for (var i = 0; i < 5; i++) {
        $scope.dataObjProvinsi[i] = response.data.adminarea;
      }
    });
    for (var i = 0; i < 5; i++) {
      $scope.$watch("modalSelected[" + i + "].Provinsi", function (newVal) {
        try {
          if (Object.size(newVal) > 2) {
            var i = $scope.formPermohonan.index - 1;
            $scope.formPermohonan.pemohon[i].city_id = "";
            $scope.formPermohonan.pemohon[i].district_id = "";
            $scope.formPermohonan.pemohon[i].admin_area_id = newVal.id;
            $scope.dataObjKabupaten[i] = [];
            $scope.modalSelected[i].Kabupaten = {};
            $scope.dataObjKecamatan[i] = [];
            $scope.modalSelected[i].Kecamatan = {};
            $scope.admin_area_id == undefined;
            $scope.city_id == undefined;
            /* GET Service Kota */
            _wilayah.Kota().then(function (response) {
              $scope.admin_area_id = newVal.id;
              var kota = response.data.cities;
              $scope.dataObjKabupaten[i || $scope.formPermohonan.index - 1] = kota.filter(function (s) {
                return s.admin_area_id == $scope.admin_area_id;
              })
            });
          }
        } catch (err) {}
      });
      $scope.$watch("modalSelected[" + i + "].Kabupaten", function (newVal) {
        try {
          if (Object.size(newVal) > 2) {
            var i = $scope.formPermohonan.index - 1;
            $scope.formPermohonan.pemohon[i].district_id = "";
            $scope.formPermohonan.pemohon[i].city_id = newVal.id;
            $scope.dataObjKecamatan[i] = [];
            $scope.modalSelected[i].Kecamatan = {};
            /* GET Service Kecamatan */
            _wilayah.Kecamatan().then(function (response) {
              $scope.city_id = newVal.id;
              var kecamatan = response.data.district;
              $scope.dataObjKecamatan[i || $scope.formPermohonan.index - 1] = kecamatan.filter(function (s) {
                return s.city_id == $scope.city_id;
              })
            });
          }
        } catch (err) {}
      });
      $scope.$watch("modalSelected[" + i + "].Kecamatan", function (newVal) {
        try {
          if (Object.size(newVal) > 2) {
            var i = $scope.formPermohonan.index - 1;
            $scope.formPermohonan.pemohon[i || $scope.formPermohonan.index - 1].district_id = newVal.id;
          }
        } catch (err) {}
      });
    }
  }
  $scope.$on("$ionicView.beforeEnter", function () {
    $scope.setWatcher();
    $scope.jenis = {}
    $scope.dataForm = JSON.parse($stateParams.form);
    $scope.dataKanim = JSON.parse($stateParams.kanim);
    $scope.selected = JSON.parse($stateParams.jumlah);

    $scope.dataPermohonan = {}
    $scope.keterangan = ["PRIBADI", "AYAH/IBU", "ANAK", "SUAMI/ISTRI"]
    $scope.formPermohonan = {
      index: 0,
      dataForm: $scope.dataForm,
      dataKanim: $scope.dataKanim,
      pemohon: [{}, {}, {}, {}, {}]
    }
    _store.put("QUOTA_ID", $scope.formPermohonan.dataForm.ID);
    $scope.getButton();
    $scope.jenis[0] = 0;
    $scope.checkIsPribadi(1, "PRIBADI");
    $scope.dataPermohonan["index" + 1] = true;
    $scope.formPermohonan.pemohon[0].applicant_category = "PRIBADI";
    $scope.formPermohonan.pemohon[0].SERVICE_TYPE_ID = _booking.type.baru;
  });

  /* GET DATA NIK, AGAMA, TANGGAL LAHIR */
  // for (var i = 0; i < 5; i++) {
  //   $scope.$watchCollection("[formPermohonan.pemohon[" + i + "].APPLICANT_ID,formPermohonan.pemohon[" + i + "].BORN_DATE]", function (newVal) {
  //     try {
  //       $rootScope.params = {};
  //       $rootScope.params.NIK = newVal[0];
  //       $rootScope.params.TANGGAL_LAHIR = moment(newVal[1]).format("YYYY-MM-DD");
  //       _store.put("NIK", $rootScope.params.NIK);
  //       _store.put("TANGGAL_LAHIR", $rootScope.params.TANGGAL_LAHIR);
  //       var date = new Date();
  //       $scope.today = moment(date).format("YYYY-MM-DD");
  //       if ($rootScope.params.TANGGAL_LAHIR !== $scope.today && $rootScope.params.NIK.length == 16) {
  //         _loading.show('Mohon Tunggu');
  //         _user.admInduk().then(function (response) {
  //           if (!response.data.SUCCESS) {
  //             $scope.formPermohonan.pemohon[$scope.formPermohonan.index - 1].FULL_NAME = "";
  //             _toastCtrl.show("Mohon Maaf NIK Tidak Ditemukan").then(function (result) {
  //               if (result.value) {
  //                 $scope.aktif = false;
  //                 _loading.hide();
  //               } else {
  //                 $scope.aktif = false;
  //                 _loading.hide();
  //               }
  //             });
  //           } else if (response.data.SUCCESS == null) {
  //             $scope.formPermohonan.pemohon[$scope.formPermohonan.index - 1].FULL_NAME = "";
  //             _toastCtrl.show("Mohon Maaf NIK Tidak Ditemukan").then(function (result) {
  //               if (result.value) {
  //                 $scope.aktif = false;
  //                 _loading.hide();
  //               } else {
  //                 $scope.aktif = false;
  //                 _loading.hide();
  //               }
  //             });
  //           } else if (response.data.SUCCESS) {
  //             $scope.aktif = false;
  //             $scope.dataDukcapil = []
  //             $scope.dataDukcapil = response.data.DATA.content;
  //             angular.forEach($scope.dataDukcapil, function (response) {
  //               $scope.formPermohonan.pemohon[$scope.formPermohonan.index - 1].FULL_NAME = response.NAMA_LGKP;
  //               _loading.hide();
  //             });
  //           } else {
  //             $scope.aktif = true;
  //             $scope.formPermohonan.pemohon[$scope.formPermohonan.index - 1].FULL_NAME = "";
  //             _store.put("SUKSES_DUKCAPIL", response.data.SUCCESS);
  //             _loading.hide();
  //           }
  //         }, function errorCallback(response) {
  //           $scope.aktif = true;
  //           $scope.formPermohonan.pemohon[$scope.formPermohonan.index - 1].FULL_NAME = "";
  //           _store.put("SUKSES_DUKCAPIL", false);
  //           _loading.hide();
  //         })
  //       }
  //     } catch (err) {}
  //   })
  // }
  $scope.permohonanData = function (id) {
    if (id != 1) {
      if ($scope.dataPermohonan["index" + (id - 1)]) {
        $scope.permohonanDataComplete(id);
      } else {
        _toastCtrl.show("Mohon Maaf, Silahkan Isi Data Pemohon ke-" + (id - 1) + " Terlebih Dahulu");
      }
    } else {
      $scope.permohonanDataComplete(id);
    }
  }
  $scope.permohonanDataComplete = function (index) {
    $scope.formPermohonan.index = index;
    if ($scope.dataPermohonan["index" + index]) {
      $scope.permohonanDataRequest(index);
    } else {
      var inputOptions = {}
      if (index == 1) {
        $scope.checkIsPribadi(index, "PRIBADI");
        $scope.formPermohonan.pemohon[$scope.formPermohonan.index - 1].applicant_category = "PRIBADI";
        inputOptions = {
          '0': 'PERMOHONAN PASPOR BARU'
        }
      } else {
        inputOptions = {
          '0': 'PERMOHONAN PASPOR BARU',
          '1': 'PERPANJANGAN PASPOR',
          // '2': 'PASPOR HILANG',
          // '3': 'PASPOR RUSAK'
        }
      }
      _Sweet({
        title: 'PILIH JENIS PERMOHONAN',
        input: 'select',
        inputOptions: inputOptions,
      }).then(function (result) {
        if (result.value == 0) {
          $scope.jenis[index - 1] = 0;
        } else if (result.value == 1) {
          _store.remove("hasStartedAnyline");
          $scope.jenis[index - 1] = 1;
        } else if (result.value == 2) {
          $scope.jenis[index - 1] = 2;
        } else if (result.value == 3) {
          $scope.jenis[index - 1] = 3;
        } else {
          $scope.jenis[index - 1] = 4;
        }
        $scope.permohonanDataRequest(index);
      }).catch(_Sweet.noop);
    }
  }
  $scope.permohonanDataRequest = function (index, dataValid) {
    var htmlPemohon = "";
    if ($scope.jenis[index - 1] == 0) {
      htmlPemohon = $templateCache.get("permohonanPaspor");
      $scope.formPermohonan.pemohon[index - 1].SERVICE_TYPE_ID = "5CD9317A-317A-355A-1EBE-E0531400A8C0";
      openDialog();
    } else if ($scope.jenis[index - 1] == 1) {
      htmlPemohon = $templateCache.get("penggantianPaspor");
      if ($scope.dataPermohonan["index" + index]) {
        openDialog();
      } else {
        dataValid = dataValid || false;
        if (dataValid) {
          openDialog();
        } else {
          _MRZ.scan({
            title: "Pemberitahuan",
            text: "ARAHKAN KAMERA KE PASPOR ANDA"
          }).then(function (data) {
            if (!$rootScope.mrzUnderConstruction){
              $scope.formPermohonan.pemohon[index - 1].BORN_DATE = moment(data.dayOfBirthObject).format("YYYY-MM-DD");
              $scope.formPermohonan.pemohon[index - 1].DOC_TYPE = data.documentType;
              $scope.formPermohonan.pemohon[index - 1].EXPIRED_DATE = moment(data.expirationDateObject).format("YYYY-MM-DD");
              $scope.formPermohonan.pemohon[index - 1].FULL_NAME = data.FullName;
              $scope.formPermohonan.pemohon[index - 1].GENDER = data.sex;
              $scope.formPermohonan.pemohon[index - 1].NATIONALITY = data.Nationality;
              $scope.formPermohonan.pemohon[index - 1].NATIONALITY_CODE = data.countryCode;
              $scope.formPermohonan.pemohon[index - 1].PASSPORT_NUMBER = data.documentNumber;
            }
            $scope.formPermohonan.pemohon[index - 1].SERVICE_TYPE_ID = "5CD9317A-317A-355E-1EBE-E0531400A8C0";
            openDialog();
          });
        }
      }
    } else if ($scope.jenis[index - 1] == 2) {
      _Sweet("Perhatian", "Silahkan Datang Ke Kantor Imigrasi Dengan Membawa Surat Keterangan Kehilangan Paspor Dari Kepolisian", "warning").then(function (value) {
        $scope.jenis[index - 1] = "";
      });
    } else if ($scope.jenis[index - 1] == 3) {
      _Sweet("Perhatian", "Silahkan Datang Ke Kantor Imigrasi Dengan Membawa Paspor Anda", "warning").then(function (value) {
        $scope.jenis[index - 1] = "";
      });
    } else {}

    function openDialog() {
      _Sweet({
        title: 'Data Pemohon Ke-' + index,
        html: "<tampilan-alert />",
        allowOutsideClick: false,
        confirmButtonText: "SIMPAN",
        showCancelButton: true,
        cancelButtonText: "BATAL",
        showCloseButton: false,
        reverseButtons: true,
        onOpen: function () {
          var hasPribadi = false;
          $scope.canEditPribadi = true;
          for (var i = 0; i < $scope.formPermohonan.pemohon.length; i++) {
            var temp = $scope.formPermohonan.pemohon[i]
            if (temp.applicant_category == "PRIBADI") {
              hasPribadi = true;
              if (hasPribadi && index - 1 == i) {
                $scope.canEditPribadi = true;
              } else {
                $scope.canEditPribadi = false;
              }
            }
          }
          $scope.$apply();
          setTimeout(function () {
            jQuery("tampilan-alert").html($compile(htmlPemohon)($scope));
            $scope.$apply();
          }, 50);
        }
      }).then(function (result) {
        var msg = "",
          valid = true;
        $scope.formPermohonan.pemohon[index - 1] = Object.assign($scope.formPermohonan.pemohon[index - 1]);
        data = $scope.formPermohonan.pemohon[index - 1]
        if (result.value) {
          if ($scope.jenis[index - 1] == 0) {
            var dataNotNull = [{
              APPLICANT_ID: "NIK"
            }, {
              FULL_NAME: "Nama Lengkap"
            }, {
              GENDER: "Jenis Kelamin"
            }, {
              BORN_DATE: "Tanggal Lahir"
            }, {
              admin_area_id: "Provinsi"
            }, {
              city_id: "Kabupaten / Kota"
            }, {
              district_id: "Kecamatan"
            }, {
              applicant_category: "Keterangan"
            }]
            for (var i = 0; i < dataNotNull.length; i++) {
              var temp = dataNotNull[i]
              for (var key in temp) {
                if (!data[key]) {
                  msg += "Data " + temp[key] + " Tidak Boleh Kosong, ";
                  valid = false;
                }
              }
            }
            // var Dukcapil = _store.get("SUKSES_DUKCAPIL");
            // if (Dukcapil == false || Dukcapil == "false") {
              if (data.APPLICANT_ID && data.APPLICANT_ID.length != 16) {
                msg += "Masukkan NIK Dengan 16 Digit, ";
                valid = false;
              }
              if (data.APPLICANT_ID && !data.APPLICANT_ID.isValidNik(data.BORN_DATE, data.GENDER)) {
                msg += "NIK Tidak Sesuai, ";
                valid = false;
              }
            // }
          } else {
            if (!data.applicant_category) {
              msg += "Keterangan Tidak Boleh Kosong, ";
              valid = false;
            }
          }
          if ($scope.jenis[index - 1] == 0) {
            for (var i = 0; i < $scope.formPermohonan.pemohon.length; i++) {
              var temp = $scope.formPermohonan.pemohon[i]
              if (!(index - 1 == i) && data.APPLICANT_ID == temp.APPLICANT_ID) {
                msg += "NIK Sudah Dimasukkan Sebelumnya, ";
                valid = false;
              }
            }
          } else {
            for (var i = 0; i < $scope.formPermohonan.pemohon.length; i++) {
              var temp = $scope.formPermohonan.pemohon[i]
              if (!(index - 1 == i) && data.PASSPORT_NUMBER == temp.PASSPORT_NUMBER) {
                msg += "Paspor Ini Sudah Dimasukkan Sebelumnya, ";
                valid = false;
              }
            }
          }
          if (!valid) {
            msg = msg.slice(0, -2);
            $scope.dataPermohonan["index" + index] = false;
            _Sweet("", msg, "warning").then(function () {
              $scope.permohonanDataRequest(index, true);
            });
          } else {
            $scope.dataPermohonan["index" + index] = true;
          }
          setTimeout(function () {
            $scope.$apply();
          }, 100);
        } else {
          if (index == 1) {} else {
            $scope.dataPermohonan['index' + index] = false;
            $scope.formPermohonan.pemohon[index - 1] = {};
            $scope.tanggalLahir = "";
            $scope.modalSelected[index - 1] = {};
            $scope.$apply();
          }
        }
      }).catch(_Sweet.noop);
    }
  }
  $scope.checkIsPribadi = function (index, opt) {
    var DataUser = _store.get("DataUser");
    if (opt == "PRIBADI") {
      $scope.modalSelected[index - 1].Provinsi = {
        id: DataUser.ADMIN_AREA_ID,
        area_name: DataUser.AREA_NAME
      }
      $scope.modalSelected[index - 1].Kabupaten = {
        id: DataUser.CITY_ID,
        city_name: DataUser.CITY_NAME
      }
      $scope.modalSelected[index - 1].Kecamatan = {
        id: DataUser.DISTRICTS_ID,
        district_name: DataUser.DISTRICT_NAME
      }
      $scope.formPermohonan.pemohon[index - 1].APPLICANT_ID = DataUser.CUSTOMER_ID;
      $scope.formPermohonan.pemohon[index - 1].BORN_DATE = DataUser.BORN_DATE;
      $scope.formPermohonan.pemohon[index - 1].FULL_NAME = DataUser.CUSTOMER_FULLNAME;
      $scope.formPermohonan.pemohon[index - 1].GENDER = DataUser.GENDER;
      $scope.formPermohonan.pemohon[index - 1].city_id = DataUser.CITY_ID;
      $scope.formPermohonan.pemohon[index - 1].admin_area_id = DataUser.ADMIN_AREA_ID;
      $scope.formPermohonan.pemohon[index - 1].district_id = DataUser.DISTRICTS_ID;
      $scope.formPermohonan.pemohon[index - 1].city_name = DataUser.CITY_NAME;
      $scope.formPermohonan.pemohon[index - 1].area_name = DataUser.AREA_NAME;
      $scope.formPermohonan.pemohon[index - 1].district_name = DataUser.DISTRICT_NAME;
    }
  }
  $scope.getButton = function () {
    if ($scope.selected == "1") {
      $scope.button1 = true;
      $scope.button2 = $scope.button3 = $scope.button4 = $scope.button5 = false;
      $scope.modalSelected[4] = $scope.modalSelected[3] = $scope.modalSelected[2] = $scope.modalSelected[1] = {}
      $scope.formPermohonan.pemohon[4] = $scope.formPermohonan.pemohon[3] = $scope.formPermohonan.pemohon[2] = $scope.formPermohonan.pemohon[1] = {}
      $scope.dataPermohonan["index5"] = $scope.dataPermohonan["index4"] = $scope.dataPermohonan["index3"] = $scope.dataPermohonan["index2"] = false;
    } else if ($scope.selected == "2") {
      $scope.button1 = $scope.button2 = true;
      $scope.button3 = $scope.button4 = $scope.button5 = false;
      $scope.modalSelected[4] = $scope.modalSelected[3] = $scope.modalSelected[2] = {}
      $scope.formPermohonan.pemohon[4] = $scope.formPermohonan.pemohon[3] = $scope.formPermohonan.pemohon[2] = {}
      $scope.dataPermohonan["index5"] = $scope.dataPermohonan["index4"] = $scope.dataPermohonan["index3"] = false;
    } else if ($scope.selected == "3") {
      $scope.button1 = $scope.button2 = $scope.button3 = true;
      $scope.button4 = $scope.button5 = false;
      $scope.modalSelected[4] = $scope.modalSelected[3] = {}
      $scope.formPermohonan.pemohon[4] = $scope.formPermohonan.pemohon[3] = {}
      $scope.dataPermohonan["index5"] = $scope.dataPermohonan["index4"] = false;
    } else if ($scope.selected == "4") {
      $scope.button1 = $scope.button2 = $scope.button3 = $scope.button4 = true;
      $scope.button5 = false;
      $scope.modalSelected[4] = {}
      $scope.formPermohonan.pemohon[4] = {}
      $scope.dataPermohonan["index5"] = false;
    } else if ($scope.selected == "5") {
      $scope.button1 = $scope.button2 = $scope.button3 = $scope.button4 = $scope.button5 = true;
    } else {
      $scope.button1 = true;
    }
  }
  $scope.checkIsCompletedInput = function () {
    var valid = true;
    for (var i = 0; i < $scope.selected; i++) {
      if (!$scope.dataPermohonan["index" + (i + 1)]) {
        valid = false;
        break;
      }
    }
    return valid;
  }
  $scope.simpan = function () {
    var valid = $scope.checkIsCompletedInput();
    if (valid) {
      _Sweet({
        showCancelButton: true,
        confirmButtonText: "YA, SETUJU",
        cancelButtonText: "TIDAK",
        title: "Apakah Anda Yakin Akan Membuat Permohonan",
        text: "Mohon Cek Data Anda Kembali Sebelum Melanjutkan",
        type: "question",
        reverseButtons: true
      }).then(function (resp) {
        if (resp.value) {
          $scope.simpanData();
        }
      });
    } else {
      _toastCtrl.show("Data Belum Terisi Semua");
    }
  }
  $scope.simpanData = function () {
    $ionicLoading.show({
      template: 'Mohon Tunggu...',
    });
    try {
      var param = [],
        fnSuccess = function (succ) {
          $ionicLoading.hide();
          var cond = succ.data.SUCCESS
          if (cond == "true" || cond == true) {
            _Sweet("BERHASIL", "Antrian Anda Berhasil Didaftarkan", "success").then(function () {
              $state.go('menu.jadwal');
            });
          } else if (cond == "false" || cond == false) {
            _Sweet({
              title: 'Mohon Maaf',
              text: succ.data.MESSAGE,
              type: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            _Sweet('Error', 'Silahkan Masukkan Data Dengan Benar', 'error');
          }
          $ionicLoading.hide();
        },
        fnError = function (err) {
          _Sweet('Mohon Maaf', 'Terjadi Kesalahan Konektivitas, Mohon Dicoba Kembali', 'error');
          $ionicLoading.hide();
        }
      for (var i = 0; i < $scope.formPermohonan.pemohon.length; i++) {
        if (Object.size($scope.formPermohonan.pemohon[i]) > 0) {
          $scope.formPermohonan.pemohon[i].APPLICANT_CATEGORY_ID = _booking.category[$scope.formPermohonan.pemohon[i].applicant_category];
          param.push($scope.formPermohonan.pemohon[i]);
        }
      }
      /* Inisialisasi Parameter */
      if ($scope.jenis[$scope.formPermohonan.index - 1] == 0) {
        _booking.bookBaru($scope.formPermohonan.dataForm.ID, param).then(fnSuccess, fnError);
      } else {
        _booking.bookGanti($scope.formPermohonan.dataForm.ID, param).then(fnSuccess, fnError);
      }
    } catch (err) {
      _Sweet('Error', 'Terjadi Kesalahan, Mohon Coba Kembali', 'error');
      $ionicLoading.hide();
    }
  }
  $scope.Kembali = function () {
    var data = $stateParams.kantorTerpilih;
    var response = $stateParams.response;
    _Sweet({
      title: '',
      text: 'ANDA YAKIN INGIN KEMBALI',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'YA',
      cancelButtonText: 'TIDAK',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        $state.go('menu.permohonan', {
          data: data,
          response: response
        });
      }
    });
  };
});
