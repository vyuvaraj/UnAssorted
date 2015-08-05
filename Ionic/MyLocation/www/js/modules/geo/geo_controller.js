/*
GeoLocation Controller..
@author: Yuvaraj V
*/
angular.module('myLocation.geo.controller', ['settings']).controller('GeoCtrl', function($ionicPlatform, $scope, $ionicLoading, $ionicPopover,settings) {
	var userSettings = settings.getSettings();
	$scope.timerCnt = 0.0001;
	$scope.currentPosUpdateTimeInMins = parseFloat(userSettings.refreshInMins);
	$scope.geoPositionMaxAge = parseFloat(userSettings.geoMaxAgeInMins);
	$scope.popover = null;
	$scope.currentPos, $scope.destPos;
	$scope.currentLocMarker = null;
	$scope.destinationLocMarker = [];
	$scope.mapOptions = {
		zoom : 18
	};
	$scope.directionsDisplay = new google.maps.DirectionsRenderer();
	$scope.directionsService = new google.maps.DirectionsService();
	$scope.distanceService = new google.maps.DistanceMatrixService();
	$scope.map = new google.maps.Map(document.getElementById('map-canvas'), $scope.mapOptions);

	$scope.calculateDistance = function() {
		console.log("Inside calculate Distance..");
		var currentPos = new google.maps.LatLng($scope.currentLocMarker.position.A, $scope.currentLocMarker.position.F);
		var destPos = new google.maps.LatLng($scope.currentLocMarker.position.A, $scope.currentLocMarker.position.F);
		$scope.distanceService.getDistanceMatrix({
			origins : [$scope.currentLocMarker.position],
			destinations : [$scope.destinationLocMarker.position],
			travelMode : google.maps.TravelMode.DRIVING,
			unitSystem : google.maps.UnitSystem.METRIC,
			avoidHighways : false,
			avoidTolls : false
		}, $scope.distanceServiceCallBack);
	};

	$scope.distanceServiceCallBack = function(response, status) {
		if (status != google.maps.DistanceMatrixStatus.OK) {
			console.dire('Error was: ' + status);
		} else {
			var origins = response.originAddresses;
			var destinations = response.destinationAddresses;
			if (navigator.notification)
				navigator.notification.alert("Distance:" + response.rows[0].elements[0].distance.text + " duration:" + response.rows[0].elements[0].duration.text, null);
			else
				alert("Distance:" + response.rows[0].elements[0].distance.text + " duration:" + response.rows[0].elements[0].duration.text);
		}
	};

	$scope.movedMarker = function() {
		console.log($scope.destinationLocMarker.position);
		var request = {
			origin : $scope.currentLocMarker.position,
			destination : $scope.destinationLocMarker.position,
			travelMode : google.maps.TravelMode.DRIVING
		};
		$scope.directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				console.log(result);
				console.log(status);
				$scope.directionsDisplay.setDirections(result);
			}
		});
		$scope.calculateDistance();
	};

	$scope.toggleBounce = function() {
		if ($scope.currentLocMarker.getAnimation() != null) {
			$scope.currentLocMarker.setAnimation(null);
		} else {
			$scope.currentLocMarker.setAnimation(google.maps.Animation.BOUNCE);
		}
	};

	$scope.currentPositionTimer = function() {
		console.log("Calling Current Position Timer");
		$scope.currentPosition($scope.movedMarker);
	};

	$scope.currentPosition = function(callback) {
		$ionicLoading.show({
			template : 'Loading...'
		});

		navigator.geolocation.getCurrentPosition(function(position) {
			console.log(position);
			$scope.currentPos = position;
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			if (!$scope.currentLocMarker) {
				$scope.currentLocMarker = new google.maps.Marker({
					position : pos,
					draggable : false,
					animation : google.maps.Animation.DROP,
					map : $scope.map,
					title : ''
				});
			} else {
				//var pos = new google.maps.LatLng(position.coords.latitude-$scope.timerCnt, position.coords.longitude+$scope.timerCnt);
				//$scope.timerCnt+= 0.0003;
				$scope.currentLocMarker.setPosition(pos);
			}
			$scope.map.setCenter(pos);
			
			$ionicLoading.hide();
			if (callback) {
				callback();
			}
		}, function(e) {
			console.dir(e);
		}, {
			timeout : 30000,
			enableHighAccuracy : true,
			maximumAge : $scope.geoPositionMaxAge*60000
		});

	};

	$scope.setDestination = function() {
		var pos = new google.maps.LatLng($scope.currentPos.coords.latitude - 0.0004, $scope.currentPos.coords.longitude - 0.0004);
		var image = 'img/beachflag.png';
		$scope.destinationLocMarker = new google.maps.Marker({
			position : pos,
			draggable : true,
			animation : google.maps.Animation.DROP,
			map : $scope.map,
			icon : image,
			title : 'Your Destination'
		});

		google.maps.event.addListener($scope.destinationLocMarker, 'click', $scope.toggleBounce);
		google.maps.event.addListener($scope.destinationLocMarker, 'dragend', $scope.movedMarker);

		$scope.popover.hide();
	};

	$scope.clearDestination = function() {
		$scope.destinationLocMarker.setMap(null);
		$scope.directionsDisplay.setMap(null);
		$scope.popover.hide();
	};

	$ionicPopover.fromTemplateUrl('templates/popover.html', {
		scope : $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

	//Have platform ready at the end after defining every method
	$ionicPlatform.ready(function() {
		if($scope.currentPosUpdateTimeInMins <0){
			$scope.currentPosUpdateTimeInMins = 2;
		}
		if($scope.geoPositionMaxAge <0){
			$scope.geoPositionMaxAge = 1.5;
		}
		//Initialize directionDisplay
		$scope.directionsDisplay.setMap($scope.map);
		//Get the current Position for the firstTime
		$scope.currentPosition(null);
		//Schedule the Timer to update Current Position every 2 minutes..
		$scope.currentPosTimer = setInterval($scope.currentPositionTimer, $scope.currentPosUpdateTimeInMins * 60000);
	});

});
