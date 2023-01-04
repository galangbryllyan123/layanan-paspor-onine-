app.controller('FirstAppLookCtrl', function($scope, $rootScope, $state, $ionicHistory, _Sweet, _modal, _user, _store, _loading) {
	var serverIsMt = false;
	_loading.show("Harap tunggu...");
	$scope.$on("$ionicView.afterEnter", function() {
		if ($rootScope.deviceIos){

		}
	});
	$scope.$on("$ionicView.beforeEnter", function() {
		// $ionicPlatform.registerBackButtonAction(function(e) {
		//   var current = $state.current.name;
		//   function setT() {
		//     setTimeout(function() {
		//       canExit = false;
		//     }, 2000);
		//   }
		//   if (canExit) {
		//     ionic.Platform.exitApp();
		//   } else {
		//     if (current == "first-app-look" || current == "Login") {
		//       setT();
		//       canExit = true;
		//       Toast.showShortBottom("Tekan kembali sekali lagi untuk keluar");
		//     } else {
		//       $ionicHistory.goBack();
		//     }
		//   }
		//   e.preventDefault();
		// }, 100);
		$scope.form = {
			cbChecked: false
		}
		_user.getIP().then(function (response) {
			_loading.hide();
			_store.put("IP_ADDRESS", response.data.ip);
			if (_store.get("UserAgreed") == "true"){
				$scope.nextPage();
			}
			$scope.checkVersion = "Version_A190423.0.0.1";
      var type = "VERSION_CHECK_ANDROID";
      if ($rootScope.deviceIos){
	      $scope.checkVersion = "Version_A180820.0.0.5";
	      var type = "VERSION_CHECK";
      }
      _user.broadcast(type).then(function(response) {
        $scope.broadcast = {};
        $scope.broadcast = response.data.BROADCAST;
        angular.forEach($scope.broadcast, function(result) {
          if ($scope.checkVersion != result.TITLE) {
            _Sweet({
              title: 'Mohon Maaf',
              text: 'Versi baru telah tersedia, mohon update aplikasi layanan paspor online pada device anda! klik ok untuk mengunjungi google playstore',
              type: 'warning',
              confirmButtonText: 'OK',
            }).then(function(response) {
              location.href = result.CONTENT;
              // setTimeout(function(){
              // 	ionic.Platform.exitApp();
              // }, 500);
            });
          } else {
            $rootScope.init();
          }
        })
      });
		}, function(err){
			_loading.hide();
			_Sweet("MOHON MAAF", "TIDAK DAPAT TERHUBUNG KE SERVER ATAU PERIKSA KEMBALI KONEKSI INTERNET ANDA").then(function(){
				ionic.Platform.exitApp();   
			});
		});
		
	});
	$scope.changeIframe = function(url){
		$scope.urlIframe = url;
		$scope.showIframe = true;
	}
	$scope.hideIframe = function(){
		$scope.showIframe = false;
	}
	$scope.checkCb = function(){
		$scope.form.cbChecked = !$scope.form.cbChecked;
	}
	$scope.nextPage = function(fromModal){
		if (fromModal){
			_modal.hide();
			$state.go("splashscreen");
		}else{
			// if ($rootScope.deviceIos){
			// 	_modal.open($scope, {
			// 		title: "IOS TERDETEKSI",
			// 		body: "alert-ios-device"
			// 	});
			// }else{
			// 	$state.go("splashscreen");
			// }
			$state.go("splashscreen");
		}
	}
	$scope.Confirm = function(){
		$rootScope.enablePermissions(function(){
			_store.put("UserAgreed", true);
			$scope.nextPage();
		});
	}
});
