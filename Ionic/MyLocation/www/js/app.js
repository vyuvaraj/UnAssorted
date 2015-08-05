/*
App's Entry point
This application is my experiement with Ionic and Google Maps JS Api. 
Kindly ensure to change the Google API Key..

@author: Yuvaraj V
*/

angular.module('myLocation', ['ionic', 'myLocation.controller','myLocation.home.controller','myLocation.geo.controller','myLocation.settings.controller','settings'])
.run(function($ionicPlatform, $state, $ionicPopup, settings) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		if (window.Connection) {
			if (navigator.connection.type == Connection.NONE) {
				$ionicPopup.confirm({
					title : 'No Internet Connection',
					content : 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
				}).then(function(result) {
					if (!result) {
						ionic.Platform.exitApp();
					}
				});
			}
		}
		settings.initialize();
		$state.go("app.settings");
	});
}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('bottom');
	$stateProvider.state('app', {
		url : "/app",
		abstract : true,
		templateUrl : "templates/menu.html",
		controller : "AppCtrl"
	}).state('app.home', {
		url : "/home",
		views : {
			'menuContent' : {
				templateUrl : "templates/home/home.html",
				controller : "HomeCtrl"
			}
		}
	}).state('app.settings', {
		url : "/settings",
		views : {
			'menuContent' : {
				templateUrl : "templates/settings/settings.html",
				controller : "SettingsCtrl"
			}
		}
	}).state('app.destination', {
		url : "/destination",
		views : {
			'menuContent' : {
				templateUrl : "templates/geo/destination.html",
				controller : "GeoCtrl"
			}
		}
	});

});
