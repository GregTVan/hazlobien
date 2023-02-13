var app = angular.module('canchek', ['ui.router', 'pascalprecht.translate']);
app.config(function($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: true
	});
});