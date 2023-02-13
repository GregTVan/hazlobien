app.controller('manageUsersController', function(manageUsersService, $rootScope, $scope) {
	
	$scope.show = 'table';
	
	$scope.$on('show', function (event, arg) { 
		$scope.show = manageUsersService.getShow();
	});

	$scope.openListener = function() {
		$rootScope.$broadcast('show');
	}
	
});