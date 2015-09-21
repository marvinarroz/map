var mapApp = angular.module('mapApp',["leaflet-directive", "ngSanitize", "ui.router", "angular-blocks"]);

mapApp.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/home.html',
					controller: 'MapController',
				})
			.state('articles', {
				templateUrl: '/articles.html',
				controller: 'ArticleController',
				params: ['id', 'date', 'age', 'gender', 'location', 'category', 'causeOfDeath'],
				resolve: {
					article: ['$stateParams', 'articles', function($stateParams, articles) {
						return articles.get($stateParams.id);
					}]
				}
			});
			$urlRouterProvider.otherwise('home');
		}])
.factory('articles', ['$http', function($http) {
	var fac = {};

	fac.get = function(id) {
		return $http.get("https://s3-us-west-2.amazonaws.com/vallejo/" + id)
			.success(function(response) {
				return response;
			});
	};

	return fac;
}]);

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

mapApp.controller('MapController', [ '$scope' , '$filter' , '$state' , function($scope, $filter, $state) {
	$scope.height = '900px';
	$scope.ages = [
	{'Name' : '0-20', 'Range' : [0,20]}, 
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

	$scope.vallejo = {
		lat: 38.1139,
		lng: -122.2241,
		zoom: 13
	};

	$scope.defaults = {
		tileLayer: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		scrollWheelZoom: false 
	};


	$scope.geojson = {
		data: data,
		onEachFeature : function(feature, layer) {
			layer.bindPopup("<b>" + feature.properties.name + ", " + feature.properties.age  
					, {closeButton: false, offset: L.point(0,-3)});
			layer.on('mouseover', function() { layer.openPopup()});
			layer.on('mouseout', function() {layer.closePopup()});
			layer.on('click', function() { $state.go('articles',
						{ 'id' : 'Temp.txt' , 
							'date' : feature.properties.date ,
							'age' : feature.properties.age,
							'gender' : feature.properties.gender,
							'location' : feature.properties.location,
							'category' : feature.properties.category,
							'causeOfDeath' : feature.properties["cause of death"] })});
		},
		pointToLayer: function(feature, latlng) {
			return L.circleMarker(latlng, { radius:5, fillColor:"#9a0707", color:"#000", weight:1, opacity:1, fillOpacity:0.5});
		}, 
	};

	$scope.$watchGroup(['yearSelect', 'genderSelect', 'causeSelect', 'ageSelect', 'categorySelect'], 
			function(newValues, oldValues, scope) {
				var filtered = $filter('filterMarkers')(data,$scope.yearSelect,$scope.genderSelect,$scope.causeSelect,$scope.ageSelect,$scope.categorySelect);
				$scope.geojson.data = filtered;
			});
}]);

var monthNames = [
	"January", "February", "March",
	"April", "May", "June", "July",
	"August", "September", "October",
	"November", "December"
];

mapApp.controller('ArticleController', [ '$scope', '$controller', '$stateParams', 'article', function($scope, $controller, $stateParams, article) {
	angular.extend(this, $controller('MapController', {$scope:$scope}));
	$scope.article = article.data;
	$scope.height = '400px';
	var tempDate = new Date($stateParams.date);
	$scope.date = monthNames[tempDate.getMonth()] + " " + tempDate.getDate() + ", " + tempDate.getFullYear();
	$scope.age = $stateParams.age;
	$scope.gender = $stateParams.gender;
	$scope.location = $stateParams.location;
	$scope.category = $stateParams.category;
	$scope.causeOfDeath = $stateParams.causeOfDeath;
}]);

