app.controller('LoginCtrl', function(_grantPermission, _user, _File, _Esri, _Sweet, _Permission, _UserService, $scope, $rootScope, $state, $ionicPopup, $http, $cordovaGeolocation, _http, _store, _loading, _modal) {

  $scope.user = {};

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
            title: 'No Internet Connection',
            content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
          })
          .then(function(result) {
            if (!result) {
              ionic.Platform.exitApp();
            }
          });
      }
    }


    /* Get IP, Latitude dan Longitude */
    window.state = $state = $state;
    
    var posOptions = {
      timeout: 10000,
      enableHighAccuracy: false
    };
    $rootScope.putLatLong();

    var watchOptions = {
      timeout: 3000,
      enableHighAccuracy: false
    };
    var watch = $cordovaGeolocation.watchPosition(watchOptions);

    watch.then(
      null,

      function(err) {
        console.log(err)
      },

      function(position) {
        var lat = position.coords.latitude || null;
        var long = position.coords.longitude || null;
        _store.put("LATITUDE", lat);
        _store.put("LONGITUDE", long);
        _Esri.getAddress().then(function(event) {
          var address = event.address;
          
          _store.put("REGION", address.Region);
          _store.put("SUBREGION", address.Subregion);
          _store.put("KECAMATAN", address.City);
          _store.put("CountryCode", address.CountryCode);
          _store.put("ADDRESS", address.Match_addr);
        });
      }
    );

    watch.clearWatch();


    $rootScope.init();
    _Esri.getAddress().then(function(event) {
      var address = event.address;
      
      _store.put("REGION", address.Region);
      _store.put("SUBREGION", address.Subregion);
      _store.put("KECAMATAN", address.City);
      _store.put("CountryCode", address.CountryCode);
      _store.put("ADDRESS", address.Match_addr);
    });
    /* Get IP, Latitude dan Longitude */
    function onError(error) {
      console.error("The following error occurred: " + error);
    }

    function handleLocationAuthorizationStatus(cb, status) {
      switch (status) {
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          cb(true);
          break;
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          requestLocationAuthorization(cb);
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
          cb(false);
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
          // Android only
          cb(false);
          break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
          // iOS only
          cb(true);
          break;
      }
    }

    function requestLocationAuthorization(cb) {
      if (window.cordova) cordova.plugins.diagnostic.requestLocationAuthorization(handleLocationAuthorizationStatus.bind(this, cb), onError);
    }

    function ensureLocationAuthorization(cb) {
      if (window.cordova) cordova.plugins.diagnostic.getLocationAuthorizationStatus(handleLocationAuthorizationStatus.bind(this, cb), onError);
    }

    function requestLocationAccuracy() {
      ensureLocationAuthorization(function(isAuthorized) {
        if (isAuthorized) {
          cordova.plugins.locationAccuracy.canRequest(function(canRequest) {
            if (canRequest) {
              cordova.plugins.locationAccuracy.request(function() {
                  _grantPermission.grant();
                }, function(error) {
                  onError("Error requesting location accuracy: " + JSON.stringify(error));
                  if (error) {
                    // Android only
                    onError("error code=" + error.code + "; error message=" + error.message);
                    if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                      if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                        cordova.plugins.diagnostic.switchToLocationSettings();
                      }
                    }
                  }
                }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
              );
            } else {
              // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
              // On Android, this will occur if the app doesn't have authorization to use location.
              onError("Cannot request location accuracy");
            }
          });
        } else {
          setTimeout(() => {
            _Sweet("Mohon maaf", "Aktifkan izin location pada pengaturan aplikasi di handphone anda terlebih dahulu", "warning").then(function() {
              ionic.Platform.exitApp();
            })
          }, 3000);
        }
      });
    }
    if (!$rootScope.deviceIos){
      requestLocationAccuracy();
    }
  });

  function loginCallback(data) {
    _store.putObj({
      username: $scope.user.USERNAME,
      token: data.TOKEN
    });
    if (data.SUCCESS || data.CODE == "200") {
      _store.put("hasLoggedIn", true);
      _user.getData().then(function(response) {
        _store.put("DataUser", response.data.USER);
        $rootScope.DataUser = response.data.USER;
        var img = response.data.USER.IMAGE;
        _store.put("UserImage", img);
        // $scope.CountryCode = _store.get("CountryCode");
        // if ($scope.CountryCode == "IDN") {
        _store.put("loggedInAs", "dalamNegeri");
        $state.go('menu.home');
        // } else {
        //   _store.put("loggedInAs", "luarNegeri");
        //   $state.go('LaporDiri');
        // }
      });
    } else if (data.CODE == "405") {
      _Sweet({
        title: 'Gagal',
        text: 'Username/Password Yang Anda Masukkan Salah',
        type: 'error',
        confirmButtonText: 'OK',
      });
    } else if (data.CODE == "401") {
      _Sweet({
        title: 'Gagal',
        text: 'Username/Password Yang Anda Masukkan Salah',
        type: 'error',
        confirmButtonText: 'OK',
      });
    } else if (data.CODE == "404") {
      _Sweet({
        title: 'Gagal',
        text: 'Username Tidak Ditemukan',
        type: 'error',
        confirmButtonText: 'OK',
      });
    } else if (data.CODE == "403") {
      _Sweet({
        title: 'Gagal',
        text: 'Akun Anda Telah Terkunci',
        type: 'error',
        confirmButtonText: 'OK',
      });
    } else if (data.CODE == "406") {
      _Sweet({
        title: 'Gagal',
        text: 'Akun Anda Belum Terverifikasi',
        showCancelButton: true,
        confirmButtonText: 'KIRIM ULANG',
        cancelButtonText: 'KELUAR'
      }).then(function(result) {
        if (result.value) {
          var TOKEN = data.TOKEN;
          _user.resendEmail(TOKEN).then(function(response) {
            _loading.hide();
            if (response.data.CODE == "200" || response.data.SUCCESS) {
              _Sweet({
                title: '',
                text: 'Permintaan berhasil silahkan cek kotak masuk / spam pada e-mail anda',
                type: 'success',
                confirmButtonText: 'OK',
              }).then(function(succ) {
                $state.go('login');
              });
              $scope.SendingData = false;
            } else {
              $scope.SendingData = false;
              _Sweet({
                title: 'Gagal',
                text: 'E-mail / username anda tidak terdaftar',
                type: 'error',
                confirmButtonText: 'OK',
              });
            }
          });
          _store.put('token', data.TOKEN);
        }
      })
    } else {
      _Sweet({
        title: 'Gagal',
        text: data.MESSAGE,
        type: 'error',
        confirmButtonText: 'OK',
      });
    }
    _loading.hide();
  }
  /* Facebook Login */
  function removeData(callback) {
    _store.removeObj(["Email", "Google", "token", "RegisType", "hasLoggedIn", "DataUser", "UserImage", "loggedInAs"]);
    callback();
  }
  function medSosLogin(regisType, email){
    _user.loginMedsos(email).then(function(response) {
      _store.put("token", response.data.TOKEN);
      _store.put("RegisType", regisType);
      if (response.data.SUCCESS) {
        _store.put("hasLoggedIn", true);
        _user.getData().then(function(response) {
          _store.put("DataUser", response.data.USER);
          $rootScope.DataUser = response.data.USER;
          var img = response.data.USER.IMAGE;
          _store.put("UserImage", img);
          // $scope.CountryCode = _store.get("CountryCode");
          // if ($scope.CountryCode == "IDN") {
          _store.put("loggedInAs", "dalamNegeri");
          $state.go('menu.home');
          _loading.hide();
          // } else {
          //   _store.put("loggedInAs", "luarNegeri");
          //   $state.go('LaporDiri');
          //   _loading.hide();
          // }
        });
      } else {
        _Sweet({
          title: '',
          text: 'Email anda tidak terdaftar, daftar sekarang?',
          type: 'warning',
          confirmButtonText: 'OK',
        }).then(function() {
          _loading.hide();
          $state.go('pendaftaran');
        });
      }
    }, function(){
      removeData(function(){
        _loading.hide();
        _Sweet("MOHON MAAF", "TIDAK DAPAT TERHUBUNG KE SERVER ATAU PERIKSA KEMBALI KONEKSI INTERNET ANDA DAN COBA LAGI");
      });
    });
  }
  $scope.facebookLogin = function() {
    facebookConnectPlugin.logout(function() {
      removeData($scope.doFacebookLogin);
    }, function() {
      removeData($scope.doFacebookLogin);
    })
  }
  $scope.doFacebookLogin = function() {
    facebookConnectPlugin.login(["public_profile", "email"], function(result) {
      _loading.show('Mohon Tunggu...');
      //calling api after login success
      // alert(JSON.stringify(result))
      facebookConnectPlugin.api("/me?fields=email,name,picture", ["public_profile", "email"], function(userData) {
        // alert(JSON.stringify(userData))
        //API success callback
        $scope.EmailFacebook = userData.email;
        _store.put("Email", $scope.EmailFacebook);
        medSosLogin("Facebook", $scope.EmailFacebook);
      }, function(error) {
        // alert(JSON.stringify(error))
      });
    }, function(error) {
      // alert(JSON.stringify(error))
    });
  }
  /* Google Login */
  $scope.googleLogin = function() {
    window.plugins.googleplus.logout(function(msg) {
      removeData($scope.doGoogleLogin);
    }, function() {
      removeData($scope.doGoogleLogin);
    });
  }
  window.user_ = _user;
  $scope.doGoogleLogin = function() {
    _loading.show('Mohon Tunggu...');
    window.plugins.googleplus.login({}, function(user_data) {
      $scope.EmailGoogle = user_data.email;
      _store.put("Email", $scope.EmailGoogle);
      _store.put("Google", "Aktif");
      /* Login function with google */
      medSosLogin("Google", $scope.EmailGoogle);
    },
    function(msg) {
      console.error(msg)
      _loading.hide();
    });
  }
  /* API Login */
  $scope.Pendaftaran = function(){
    $state.go('pendaftaran');
  }
  $scope.Login = function() {
    $rootScope.init();
    if (!$scope.user.USERNAME) {
      _Sweet('Mohon Maaf', 'Username tidak boleh kosong', 'warning')
    } else if (!$scope.user.PASSWORD) {
      _Sweet('Mohon Maaf', 'Password tidak boleh kosong', 'warning')
    } else {
      _loading.show('Mohon Tunggu...');
      _user.login($scope.user).then(function(response) {
        _loading.hide();
        loginCallback(response.data);
      }, function(error) {
        _Sweet({
          title: 'Gagal',
          text: 'Periksa Koneksi Internet Anda',
          type: 'error',
          confirmButtonText: 'OK',
        });
        _loadinghide();
      });
    }
  }

  $scope.Daftar = function() {
    _store.put("RegisType", "Registration");
    $state.go('pendaftaran');
  }

  $scope.LupaPassword = function() {
    $state.go('lupapassword');
  }

})
