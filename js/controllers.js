var mapApp = angular.module('mapApp',["leaflet-directive"]); 

mapApp.controller('MapController', [ '$scope' , function($scope) {
/**	$scope.years = [
		{'name' : 2000},
		{'name' : 2001}
	];*/

	angular.extend($scope, {
		vallejo: {
			lat: 38.1139,
			lng: 138.86,
			zoom: 4
		},
		defaults: {
			tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
			scrollWheelZoom: true
		}
	});
	/**
	$scope.$watchCollection("yearSelect",
		function(newVal, oldVal){
			console.log(newVal);
			console.log(oldVal);
		});
	angular.extend($scope, {
		geojson: {
			data: data
		}
	});*/
}]);

