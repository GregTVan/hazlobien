app.controller('newUserController', function($http, $location, $scope, $window) {

	$scope.enableOk = false;
	$scope.showLogin = false;
	$scope.userId;

	$scope.getInfo = function(fileName, userId, callback) {
		$scope.userId = $location.search()['user_id'];
		$http({
            method: 'GET',
            url: 'canchek/rest/password?userId=' + $scope.userId
		}).error(function(reply) {
			$scope.error = 'Error looking up user information. Please contact customersupport@canchek.com.';
			$scope.info = '';
        }).success(function (reply) {
			if(reply) {
				if(reply.error) {
					$scope.error = reply.error;
					$scope.info = '';
				} else {
					$scope.email = reply.email;
					$scope.enableOk = true;
					$scope.error = '';
					$scope.info = 'To obtain access to canchek.com, please pick a password and click OK:';
					$scope.name = reply.name;
				}
			}
		});
	};	
	
	$scope.changePassword = function(fileName, userId, callback) {
		var pw = {
			password: $scope.password
		}
		$http({
			data: pw,
            method: 'POST',
            url: 'canchek/rest/password?userId=' + $scope.userId
        }).success(function (reply) {
			if(reply && reply.error) {
				$scope.error = reply.error;
				$scope.info = '';
				if(reply.error === 'Password updated.') {
					$scope.showLogin = true;
				}
			}
		});
	};	
	
	$scope.redirectToCanchek = function() {
		$window.location.href = 'app.html';
	}
	
	$scope.okClick = function() {
		$scope.changePassword();
	}

	$scope.getInfo();

	$scope.error = 'Retrieving user details...';

});