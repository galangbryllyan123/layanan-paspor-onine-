window.config = {
  // api: "http://192.168.0.20:7003"
  api: "http://mobile.imigrasi.go.id",
  devapi: "http://devmobile.imigrasi.go.id:7004",
  apiGetIP: "http://mobile.imigrasi.go.id:8080"
}
var app = angular.module('starter.controllers', []);
angular.module('starter', ['ionic', 'dcbImgFallback', 'angular-bind-html-compile', '720kb.tooltips', 'starter.controllers', 'starter.controllerss', 'esri.map', 'monospaced.qrcode', 'angularReverseGeocode', 'ngCordova', 'ionic-datepicker', 'starter.services', 'ionic-modal-select'])

  .run(function ($ionicPlatform, $ionicPopup, _user, $ionicHistory, $cordovaDevice, _modal, $rootScope, _grantPermission, _Sweet, $state, ionicDatePicker, _http, _datePicker, _store, _grantPermission, _File, _Esri, _Sweet, $cordovaGeolocation) {
    window.httpAngular = _http = _http;
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
      $rootScope.currentState = toState.name;
    });

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      if (_store.get("hasLoggedIn") == "true") {
        var loginAs = _store.get("loggedInAs");
        if (['lupapassword', 'login', 'pendaftaran'].Contains(toState.name)) {
          if (loginAs == 'dalamNegeri') {
            $state.go('menu.home');
          } else if (loginAs == 'luarNegeri') {
            // $state.go('LaporDiri');
            $state.go('mainmenu.beranda');
          } else {
            _store.removeObj(['token', 'username', 'hasLoggedIn', 'DataUser', 'UserImage', 'loggedInAs']);
            $state.go('login')
          }
        }
      } else {
        // $state.go('login');
      }
    });

    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($(".swal2-shown").length > 0) {
        $(".swal2-shown").click();
      } else {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else if ($ionicHistory.backView()) {
          if ($rootScope.currentState == 'login') {
            $rootScope.backButtonPressedOnceToExit = true;
          } else {
            $ionicHistory.goBack();
          }
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          // $toastCtrl.showShortBottom("Press back button again to exit");
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }
      e.preventDefault();
      return false;
    }, 101);

    var notificationOpenedCallback = function (jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    // window.plugins.OneSignal.startInit("0455e38f-f12f-41fc-9e42-ced0906387b8").handleNotificationOpened(notificationOpenedCallback).endInit();

    $rootScope.setDates = function (data) {
      return _datePicker.setDateCustomAttribute(data);
    }
    $ionicPlatform.ready(function () {

      window.Diagnostic;
      window.map_getAddress;
      window.map_non_interactive_getLocation;
      window.rootScope = $rootScope = $rootScope;

      $rootScope.typeof = function (variable, type) {
        return typeof variable == type;
      }
      $rootScope.DataUser = _store.get("DataUser");

      localStorage.setItem("hasStartedAnyline", false);
      // window._http = _http;
      if (navigator.splashscreen) {
        navigator.splashscreen.hide();
      }
      if (window.cordova) window.cordova.plugins.Diagnostic;
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString('#D11418');
      }
      /* Get IP, Latitude dan Longitude */
      window.hasInitCalled = true;
      /* Permission Storage */
      _grantPermission.allowStorage().then(function () {
        _File.createFolder();
      });

      _user.getIP().then(function (response) {
        _store.put("IP_ADDRESS", response.data.ip);
      });

      var posOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };

      /* Permission Geolocation */
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        _store.put("LATITUDE", lat);
        _store.put("LONGITUDE", long);
      }, function (err) {
        console.log(err)
      });

      var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false
      };
      var watch = $cordovaGeolocation.watchPosition(watchOptions);

      watch.then(
        null,

        function (err) {
          console.log(err)
        },

        function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          _store.put("LATITUDE", lat);
          _store.put("LONGITUDE", long);
        }
      );
      watch.clearWatch();

      /* Get UUID */
      try {
        $rootScope.uuid = $cordovaDevice.getUUID();
        _store.put("UUID", $rootScope.uuid);
      } catch (err) {
        console.log("Error " + err.message);
      }

      /* Get Address */
      _Esri.getAddress().then(function (event) {
        var address = event.address;
        window.scope = $rootScope = $rootScope;
        _store.put("REGION", address.Region);
        _store.put("SUBREGION", address.Subregion);
        _store.put("KECAMATAN", address.City);
        _store.put("CountryCode", address.CountryCode);
        _store.put("ADDRESS", address.Match_addr);
      });
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider

      // MAIN ROUTE
      // PENDAFTARAN PROVIDER
      .state('pendaftaran', {
        url: '/pendaftaran',
        templateUrl: 'templates/pendaftaran.html',
        controller: 'PendaftaranCtrl'
      })

      // LOGIN PROVIDER
      .state('splashscreen', {
        url: '/splashscreen',
        templateUrl: 'templates/splashscreen.html',
        controller: 'SplashScreenCtrl'
      })

      // LUPA PASSWORD PROVIDER 
      .state('lupapassword', {
        url: '/lupapassword',
        templateUrl: 'templates/lupa-password.html',
        controller: 'LupaPasswordCtrl'
      })

      // AKTIVASI PROVIDER 
      .state('aktivasi', {
        url: '/aktivasi',
        templateUrl: 'templates/aktivasi.html',
        controller: 'AktivasiCtrl'
      })

      // LOGIN PROVIDER
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })


      // DALAM NEGERI ROUTE
      //MAIN MENU PROVIDER
      .state('menu', {
        url: '/menu',
        abstract: true,
        controller: 'MenuDalamNegeriCtrl',
        templateUrl: 'templates/DalamNegeri/main-menu.html'
      })

      //MENU JADWAL PROVIDER
      .state('menu.jadwal', {
        url: '/jadwal',
        params: {
          data: "{}"
        },
        views: {
          'menu-jadwal': {
            cache: false,
            templateUrl: 'templates/DalamNegeri/menu-jadwal.html',
            controller: 'JadwalCtrl'
          }
        }
      })

      .state('menu.jadwaldetail', {
        url: '/jadwaldetail',
        params: {
          data: "{}"
        },
        views: {
          'menu-jadwal': {
            cache: false,
            templateUrl: 'templates/DalamNegeri/jadwal-detail.html',
            controller: 'JadwalDetailCtrl'
          }
        }
      })

      // MENU LIST KANIM PROVIDER
      .state('menu.listkanim', {
        url: '/listkanim',
        views: {
          'menu-listkanim': {
            cache: false,
            templateUrl: 'templates/DalamNegeri/menu-listkanim.html',
            controller: 'ListKanimCtrl'
          }
        }
      })

      .state('menu.permohonan', {
        url: '/permohonan',
        params: {
          data: "{}",
          response: "{}"
        },
        views: {
          'menu-listkanim': {
            cache: false,
            templateUrl: 'templates/DalamNegeri/permohonan.html',
            controller: 'PermohonanCtrl'
          }
        }
      })

      .state('menu.permohonandetail', {
        url: '/permohonandetail',
        params: {
          form: "{}",
          kanim: "{}",
          jumlah: 0,
          kantorTerpilih: "{}",
          response: "{}"
        },
        views: {
          'menu-listkanim': {
            cache: false,
            templateUrl: 'templates/DalamNegeri/permohonan-detail.html',
            controller: 'PermohonanDetailCtrl'
          }
        }
      })

      // MENU HOME PROVIDER
      .state('menu.home', {
        url: '/home',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/DalamNegeri/menu-home.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('menu.panduan', {
        url: '/panduan',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Panduan/PanduanPembuatanBaru.html',
            controller: 'PanduanCtrl'
          }
        }
      })

      .state('menu.panduanPerpanjangan', {
        url: '/panduanPerpanjangan',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Panduan/PanduanPerpanjanganPaspor.html',
            controller: 'PanduanPerpanjanganCtrl'
          }
        }
      })

      .state('menu.panduanHome', {
        url: '/panduanMenu',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Panduan/PanduanMenu.html',
            controller: 'PanduanMenuCtrl'
          }
        }
      })

      .state('menu.pengaduan', {
        url: '/pengaduan',
        views: {
          'menu-pengaduan': {
            cache: false,
            templateUrl: 'templates/DalamNegeri/pengaduan.html',
            controller: 'PengaduanCtrl'
          }
        }
      })

      .state('menu.profil', {
        url: '/profil',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/profil.html',
            controller: 'ProfilCtrl'
          }
        }
      })

      .state('menu.informasi', {
        url: '/informasi',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/MenuInformasi.html',
            controller: 'MenuInformasiCtrl'
          }
        }
      })

      .state('menu.persyaratan', {
        url: '/persyaratan',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiPersyaratan.html',
            controller: 'PersyaratanCtrl'
          }
        }
      })

      .state('menu.umum', {
        url: '/umum',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiUmum.html',
            controller: 'MenuInformasiUmumCtrl'
          }
        }
      })

      .state('menu.prosedur', {
        url: '/prosedur',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiProsedur.html',
            controller: 'MenuInformasiProsedurCtrl'
          }
        }
      })

      .state('menu.biaya', {
        url: '/biaya',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiBiaya.html',
            controller: 'MenuInformasiBiayaCtrl'
          }
        }
      })

      .state('menu.perubahan', {
        url: '/perubahan',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiPerubahan.html',
            controller: 'MenuInformasiPerubahanCtrl'
          }
        }
      })

      .state('menu.pembatalan', {
        url: '/pembatalan',
        views: {
          'menu-home': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiPembatalan.html',
            controller: 'MenuInformasiPembatalanCtrl'
          }
        }
      })





























      // LUAR NEGERI ROUTE
      // MAIN MENU PROVIDER
      .state('mainmenu', {
        url: '/mainmenu',
        abstract: true,
        controller: 'MainMenuCtrl',
        templateUrl: 'templates/LuarNegeri/main-menu.html'
      })

      // LAPOR DIRI PROVIDER
      .state('mainmenu.pengaduan', {
        url: '/PengaduanLuar',
        views: {
          'mainmenu-pengaduan': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/menu-pengaduan.html',
            controller: 'PengaduanLuarNegeriCtrl'
          }
        }
      })

      // MENU JADWAL PROVIDER
      .state('mainmenu.jadwal', {
        url: '/JadwalLuar',
        params: {
          data: "{}"
        },
        views: {
          'mainmenu-jadwal': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/menu-jadwal.html',
            controller: 'JadwalLuarCtrl'
          }
        }
      })

      .state('mainmenu.JadwalDetailLuarNegeri', {
        url: '/JadwalLuar/JadwalDetailLuar',
        params: {
          data: "{}"
        },
        views: {
          'mainmenu-jadwal': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/jadwal-detail.html',
            controller: 'JadwalDetailLuarNegeriCtrl'
          }
        }
      })

      // MENU BERANDA PROVIDER
      .state('mainmenu.beranda', {
        url: '/beranda',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/menu-home.html',
            controller: 'BerandaLuarCtrl'
          }
        }
      })

      // SUBMENU BERANDA PROVIDER
      .state('mainmenu.panduan', {
        url: '/panduan',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Panduan/PanduanPembuatanBaru.html',
            controller: 'PanduanCtrl'
          }
        }
      })

      .state('mainmenu.panduanPerpanjangan', {
        url: '/panduanPerpanjangan',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Panduan/PanduanPerpanjanganPaspor.html',
            controller: 'PanduanPerpanjanganCtrl'
          }
        }
      })

      .state('mainmenu.panduanHome', {
        url: '/panduanMenu',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Panduan/PanduanMenu.html',
            controller: 'PanduanMenuCtrl'
          }
        }
      })

      .state('mainmenu.ProfilLuarNegeri', {
        url: '/ProfilLuarNegeri',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/profil.html',
            controller: 'ProfilCtrl'
          }
        }
      })

      .state('mainmenu.LaporDiriDetail', {
        url: '/LaporDiriDetail',
        views: {
          'mainmenu-lapordiri': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/lapor-diri-detail.html',
            controller: 'LaporDiriCtrl'
          }
        }
      })

      .state('mainmenu.ListKBRI', {
        url: '/ListKBRI',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/listkbri.html',
            controller: 'ListKBRICtrl'
          }
        }
      })

      .state('mainmenu.PermohonanLuarNegeri', {
        url: '/PermohonanLuarNegeri',
        params: {
          data: "{}",
          response: "{}"
        },
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/permohonan.html',
            controller: 'PermohonanLuarNegeriCtrl'
          }
        }
      })

      .state('mainmenu.InformasiLuarNegeri', {
        url: '/InformasiLuarNegeri',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/MenuInformasi.html',
            controller: 'MenuInformasiCtrl'
          }
        }
      })

      .state('mainmenu.InformasiBiaya', {
        url: '/InformasiBiaya',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiBiaya.html',
            controller: 'MenuInformasiBiayaCtrl'
          }
        }
      })

      .state('mainmenu.InformasiPembatalan', {
        url: '/InformasiPembatalan',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiPembatalan.html',
            controller: 'MenuInformasiPembatalanCtrl'
          }
        }
      })

      .state('mainmenu.InformasiPersyaratan', {
        url: '/InformasiPersyaratan',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiPersyaratan.html',
            controller: 'MenuInformasiPersyaratanCtrl'
          }
        }
      })

      .state('mainmenu.InformasiPerubahan', {
        url: '/InformasiPerubahan',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiPerubahan.html',
            controller: 'MenuInformasiPerubahanCtrl'
          }
        }
      })

      .state('mainmenu.InformasiProsedur', {
        url: '/InformasiProsedur',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiProsedur.html',
            controller: 'MenuInformasiProsedurCtrl'
          }
        }
      })

      .state('mainmenu.InformasiUmum', {
        url: '/InformasiUmum',
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/Content/Informasi/InformasiUmum.html',
            controller: 'MenuInformasiUmumCtrl'
          }
        }
      })

      .state('mainmenu.PermohonanDetailLuarNegeri', {
        url: '/PermohonanDetailLuarNegeri',
        params: {
          form: "{}",
          kanim: "{}",
          jumlah: 0,
          kantorTerpilih: "{}",
          response: "{}"
        },
        views: {
          'mainmenu-beranda': {
            cache: false,
            templateUrl: 'templates/LuarNegeri/permohonan-detail.html',
            controller: 'PermohonanDetailLuarNegeriCtrl'
          }
        }
      })

      // LAPOR DIRI LUAR NEGERI PROVIDER
      .state('LaporDiri', {
        url: '/LaporDiri',
        templateUrl: 'templates/LuarNegeri/lapor-diri.html',
        controller: 'LaporDiriCtrl'
      })
      .state('first-app-look', {
        url: '/first-app-look',
        templateUrl: 'templates/first-app-look.html',
        controller: 'FirstAppLookCtrl'
      })

    $urlRouterProvider.otherwise('/first-app-look');
    // $urlRouterProvider.otherwise('/splashscreen');

  });
