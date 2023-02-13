app.controller('filePickupController', function(auth0Service, fileDownloadService, $http, $location, $scope, $window) {

	$scope.getJobInfoAndFile = function(fileName, key, callback) {
		$scope.showBody = true;
		$http({
            url: 'canchek/rest/job/' + key,
            method: 'GET'
        }).success(function (reply) {
			$scope.jobInfo = reply;
			// server-side verifies that job and filename are consistent, as well as access rights
			// TODO we should return job info and file in a single multipart reply, but ... life is too short, today
			fileDownloadService.getFile(key, fileName, callback);
		}).error(function(reply, httpStatusCode) {
			callback(httpStatusCode);
		});
	};	
	
	$scope.logout = function() {
		auth0Service.logout();
	}

	$scope.redirectToCanchek = function() {
		$window.location.href = 'app.html';
	}
	
	$scope.setShowError = function(state) {
		$scope.showError = state;
		$scope.showInfo = !state;
	}

	$scope.updateMessages = function(httpStatusCode) {
		if(httpStatusCode == 200) {
			$scope.info = 'Your download is complete. Have a great day!';
		} else {
			$scope.setShowError(true);
			if(httpStatusCode == 410) {
				$scope.error = 'This file is no longer available. You must run the query again.  Please contact customersupport@canchek.com for assistance.';
			} else {
				$scope.error = 'This file cannot be accessed. Please contact customersupport@canchek.com for assistance.';
			}
		}
	}

	$scope.setShowError(false);
	$scope.showBody = false;
	$scope.info = 'Thanks for using Canchek! Your download should start shortly.';

	auth0Service.handleAuthentication('file_pickup.html', $scope.getJobInfoAndFile, $scope.updateMessages);
	
});