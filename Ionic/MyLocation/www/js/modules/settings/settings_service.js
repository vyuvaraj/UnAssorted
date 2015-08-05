/*
Settings Service to store configured values.
@author: Yuvaraj V
*/
angular.module('settings', []).factory('settings', function() {

	var db = window.localStorage;
	var keys = {
		initialize : "initialize",
		settings : "settings",
		destination : "destination"
	};
	var defaultValue = {
		settings : {
			refreshInMins : 2,
			geoMaxAgeInMins : 1.5
		},
		destination : []
	};

	function initialize() {
		var dbInitialized = db.getItem('isDBInitied');
		if (!dbInitialized) {
			setSettings(defaultValue.settings);
			setDestination(defaultValue.destination);
			db.setItem("isDBInitied","Y");
		}
	}

	function setSettings(settings) {
		console.dir("saving settings");
		console.dir(settings);
		db.setItem(keys.settings, JSON.stringify(settings));
	};
	
	function getSettings() {
		var settings = JSON.parse(db.getItem(keys.settings));
		if (_.isEmpty(settings)) {
			return {};
		} else {
			return settings;
		}
	};
	
	function setDestination(destination){
		console.dir("saving destination");
		console.dir(destination);
		db.setItem(keys.destination, JSON.stringify(destination));
	}
	
	function getDestination() {
		var destination = JSON.parse(db.getItem(keys.destination));
		if (_.isEmpty(destination)) {
			return {};
		} else {
			return destination;
		}
	};
	
	return {
		initialize : initialize,
		setSettings : setSettings,
		getSettings : getSettings
	};
});
