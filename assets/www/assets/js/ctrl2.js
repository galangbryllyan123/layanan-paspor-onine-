$(document).ready(function(){
	window.addEventListener('native.keyboardshow', function(e){
		$("esri-map").hide();
	});
	window.addEventListener('native.keyboardhide', function(e){
		$("esri-map").show();
	});
});

angular.module('starter.controllerss', [])

.directive('dropdownSearch', function($rootScope) {
	// <dropdown-search search="dataSearch" model="wow"></dropdown-search>
	$rootScope.dataSearch = [{
		name: "asd",
		data: 123
	}, {
		name: "fgh",
		data: 456
	}, {
		name: "ijk",
		data: 789
	}]
	return {
		restrict: 'AE',
		scope: { search: '=', model: '=' },
		template: ['<div ng-click="choosed(data)" ng-repeat="data in search | filter: model">',
		'{{data}}',
		'</div>'].join(""),
		link: function(scope){
			scope.choosed = function(data){
				scope.model = data;
			}
		}
	};
})
