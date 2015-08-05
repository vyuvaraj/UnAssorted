/*
Controller Impl

@author: Yuvaraj V
*/
angular.module('myLocation.controller', ['ionic']).controller('AppCtrl', function($scope, $state) {
	$scope.allowSlideMenu = true;
	$scope.redirect = function(state) {
		$state.go(state);
	};
	
	$scope.exit = function(){
		ionic.Platform.exitApp();
	};
}); 