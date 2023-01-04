app.controller('MenuCtrl', function ($state) {
  this.onTabSelected = function (_scope) {
    console.log("onTabSelected - main");
    // if we are selectng the home title then 
    // change the state back to the top state
    if (_scope.title === 'BERANDA') {
      setTimeout(function () {
        $state.go('menu.home', {});
      }, 10);
    } else if (_scope.title === 'ANTRIAN PASPOR') {
      setTimeout(function () {
        $state.go('menu.listkanim', {});
      }, 10);
    } else {
      setTimeout(function () {
        $state.go('menu.jadwal', {});
      }, 10);
    }
  }
  this.onTabDeselected = function () {
    console.log("onTabDeselected -  main");
  }
})
