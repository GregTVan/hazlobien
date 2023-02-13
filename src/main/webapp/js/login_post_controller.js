app.controller('loginPostController', function(auth0Service, $location, $scope) {

    $scope.show_body = true;

	auth0Service.handleAuthentication('app.html');
	
	$scope.logout = function() {
		auth0Service.logout();
	}
	
});