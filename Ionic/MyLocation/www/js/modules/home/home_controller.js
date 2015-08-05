/*
Home Controller..
@author: Yuvaraj V
*/
angular.module('myLocation.home.controller', []).controller('HomeCtrl', function($ionicPlatform, $ionicPopup, $scope, $state) {
	$scope.travelChoice = {};
	$scope.pos = {
		lattitude : 'Please wait ...',
		longtitude : 'Please wait ...'
	};

	$scope.destination = {
		lattitude : '',
		longtitude : ''
	};

	$scope.setDestination = function() {
		$state.go("app.destination");
	};
	$scope.setPosition = function(position) {
		console.log(position);
		$scope.$apply(function() {
			$scope.pos = {
				lattitude : position.coords.latitude,
				longtitude : position.coords.longitude
			};
		});
	};

	$scope.showGeoPopup = function(title, content, successCallback, failureCallback) {
		$ionicPopup.confirm({
			title : title,
			content : content
		}).then(function(result) {
			if (result && successCallback) {
				successCallback();
			} else if (!result && failureCallback) {
				failureCallback();
			}
		});
	};

	$scope.positionError = function(error) {
		switch(error.code) {
		case error.PERMISSION_DENIED:
		case error.UNKNOWN_ERROR:
			$scope.showGeoPopup("Location Error", 'Couldnt identify your location, either GPS is off or weak signal. Please try again', null, ionic.Platform.exitApp);
			break;
		case error.POSITION_UNAVAILABLE:
			$scope.showGeoPopup("Location Error", 'Location information is unavailable. Do you want to Retry?', $scope.getCurrentPosition, null);
			break;
		case error.TIMEOUT:
			$scope.showGeoPopup("Location Error", 'The request to get user location timed out. Do you want to Retry?', $scope.getCurrentPosition, null);
			break;
		}
	};

	$scope.getCurrentPosition = function() {
		var options = {
			timeout : 5000,
			enableHighAccuracy : false,
			maximumAge : 0
		};
		navigator.geolocation.getCurrentPosition($scope.setPosition, $scope.positionError, options);
	};

	$ionicPlatform.ready(function() {
		$scope.getCurrentPosition();
	});
}); 