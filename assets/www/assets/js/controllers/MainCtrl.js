app.controller('MainCtrl', function ($state) {
  console.log('MainMenuCtrl');
  this.onTabSelected = function (_scope) {
    if (_scope.title === 'BERANDA') {
      setTimeout(function () {
        $state.go('mainmenu.beranda');
      },10);
    } else if (_scope.title === 'LAPOR DIRI') {
      setTimeout(function () {
        $state.go('mainmenu.LaporDiriDetail');
      },10);
    } else {
      setTimeout(function () {
        $state.go('mainmenu.jadwal');
      },10);
    }
  }
  this.onTabDeselected = function () {
    console.log("onTabDeselected -  main");
  }
})
