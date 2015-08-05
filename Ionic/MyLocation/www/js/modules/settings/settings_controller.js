/*
Settings Controller..
@author: Yuvaraj V
*/
angular.module('myLocation.settings.controller', ['settings']).controller('SettingsCtrl', function($scope, $state, settings, $ionicPlatform) {
	$scope.changedFields = {};
	$scope.settings = {};
	$scope.originalSettings = {};
	$scope.settingsChanged = false;
	
	$scope.initialize = function (){
		//angular.copy(settings.getSettings(), $scope.settings);
		//angular.copy(settings.getSettings(), $scope.originalSettings);
		$scope.settings = settings.getSettings();
		$scope.originalSettings = settings.getSettings();
	};

	$scope.changeDetected = function(field) {

		console.log($scope.originalSettings);
		console.log($scope.settings);
		if(_.isEqual(field,"refreshInMins") && $scope.settings[field] <0 ){
			$scope.settings.refreshInMins = $scope.originalSettings.refreshInMins;
		}
		if (!_.isEqual($scope.originalSettings[field], $scope.settings[field]) && !_.isEqual($scope.settings[field], '')) {
			console.log($scope.originalSettings[field] + ' and ' + $scope.settings[field] + ' are different');
			$scope.changedFields[field] = true;
		} else {
			console.log($scope.originalSettings[field] + ' and ' + $scope.settings[field] + ' are same');
			$scope.changedFields[field] = false;
		}

		for (var key in $scope.changedFields) {
			if (_.isEqual($scope.changedFields[key], true)) {
				$scope.settingsChanged = true;
				return;
			}
		}

		$scope.settingsChanged = false;
	};

	$scope.skip = function(){
		
	};
	$scope.save = function(){
		console.log("save..");
		settings.setSettings($scope.settings);
		$scope.initialize();
		$scope.settingsChanged = false;
	};
	$scope.$on("$ionicView.beforeEnter", function () {
		$scope.initialize();
	});
});
