var mapApp = angular.module('mapApp',["leaflet-directive"]); 

mapApp.filter('filterMarkers', function() {
	return function(data, year, gender, cause, age, category) {
		var filtered = [];
		for (var i=0; i<data.length; i++) {
			if ((year === undefined || year === null || data[i].properties.year == year) && 
			     (gender === undefined || gender === null || data[i].properties.gender == gender) &&
		   	     (cause === undefined || cause === null || data[i].properties.cause == cause) &&
			     (age === undefined || age === null || data[i].properties.age == age) &&
			     (category === undefined || category === null || data[i].properties.category == category)) {
				filtered.push(data[i]);
			}
		}
		return filtered;
	};
});

mapApp.controller('MapController', [ '$scope' , '$filter' , function($scope, $filter) {
	$scope.years = [];
	for (var i=2000;i<=2015;i++){
		$scope.years.push(i);
	}
	$scope.genders = [
		'Male','Female'
	];
	$scope.causes = [
		'Asphyxiation', 'Blunt Force', 'Shooting', 'Stabbing', 'Tasering', 'Unknown', 'Vehicle'
	];
	$scope.ages = [];
	for (var i=0;i<=90;i++){
		$scope.ages.push(i);
	}
	$scope.categories = ['Accident', 'Homicide', 'Justifiable Homicide', 'Negligent Homicide', 'Officer-Involved Homicide', 'Unincorporated Homicide'];

	angular.extend($scope, {
		vallejo: {
			lat: 38.1139,
			lng: -122.2241,
			zoom: 13
		},
		defaults: {
			tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
			scrollWheelZoom: false 
		}
	});
	
		angular.extend($scope, {
		geojson: {
			data: data
		}
	});
	$scope.$watchGroup(['yearSelect', 'genderSelect', 'causeSelect', 'ageSelect', 'categorySelect'], 
		function(newValues, oldValues, scope) {
			var filtered = $filter('filterMarkers')(data,$scope.yearSelect,$scope.genderSelect,$scope.causeSelect,$scope.ageSelect,$scope.categorySelect);
			$scope.geojson = {
				data:filtered
			};
		});
}]);

