var mapApp = angular.module('mapApp',["leaflet-directive"]); 

mapApp.filter('filterMarkers', function() {
	return function(data, year, gender, cause, age, category) {
		var filtered = [];
		for (var i=0; i<data.length; i++) {
			if ((year === undefined || year === null || data[i].properties.year == year) && 
			     (gender === undefined || gender === null || data[i].properties.gender == gender) &&
		   	     (cause === undefined || cause === null || data[i].properties["cause of death"] == cause) &&
			     (age === undefined || age === null || this.checkAge(data[i].properties.age,age.Range[0],age.Range[1])) &&
			     (category === undefined || category === null || data[i].properties.category == category)) {
				filtered.push(data[i]);
			}
		}
		return filtered;
	};
});

var checkAge = function(age, min, max) {
	return min <= age && age < max;
};

mapApp.controller('MapController', [ '$scope' , '$filter' , function($scope, $filter) {
	$scope.ages = [{'Name' : '0-20', 'Range' : [0,20]}, 
			{'Name' : '21-26', 'Range' : [21,26]},
			{'Name' : '27-34', 'Range' : [27,34]},
			{'Name' : '35-47', 'Range' : [35,47]},
			{'Name' : '48+', 'Range' : [48,200]}];
	$scope.genders = [
		'Male','Female'
	];
	$scope.causes = [
		'Asphyxiation', 'Blunt Force', 'Shooting', 'Stabbing', 'Tasering', 'Unknown', 'Vehicle'
	];
	$scope.years = [];
	for (var i=2000;i<=2015;i++){
		$scope.years.push(i);
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
			data: data,
			onEachFeature : function(feature, layer) {
				layer.bindPopup("<b>Date:</b> " + feature.properties.date + "<br>"
					      + "<b>Name:</b> " + feature.properties.name + "<br>"
					      + "<b>Age:</b> " + feature.properties.age + "<br>"
					      + "<b>Cause of death:</b> " + feature.properties["cause of death"] + "<br>"
					      + "<b>Category:</b> " + feature.properties.category + "<br>"
					      + "<b>Gender:</b> " + feature.properties.gender + "<br>"
					      + "<b>Location:</b> " + feature.properties.location);
			}
		}
	});
	$scope.$watchGroup(['yearSelect', 'genderSelect', 'causeSelect', 'ageSelect', 'categorySelect'], 
		function(newValues, oldValues, scope) {
			var filtered = $filter('filterMarkers')(data,$scope.yearSelect,$scope.genderSelect,$scope.causeSelect,$scope.ageSelect,$scope.categorySelect);
			$scope.geojson.data = filtered;
		});
}]);

