app.controller('configureSearchController', function(userConfigurationService, $http, $scope, $timeout) {

	$scope.openListener = function() {
		$scope.messages = [];
		// true means, get from server every time, even if it's in cache
		var response = userConfigurationService.get(true);
		if(response.then) {
			response.then($scope.setSearchConfiguration);
		} else {
			$scope.setSearchConfiguration(response);
		}
	}

    $scope.setSearchConfiguration = function(response) {
		$scope.userConfiguration = response;
		// Some inscrutable Angular weirdness requires this when the response in openListener comes from the service
		// without doing a HTTP call. Force a digest or the update to $scope.userConfiguration is not visible until some 
		// other UI event occurs.
		$timeout(function() {
			$scope.$apply();
		})
     }

    $scope.saveSearchConfiguration = function() {
		$scope.messages = [];
		var data = {
			dataSets: $scope.userConfiguration.dataSets,
			resolvedItemTracking: $scope.userConfiguration.resolvedItemTracking,
		}
		var request = {
			data: data,
			method: 'PATCH',
			url: 'canchek/rest/user'
		}
		var that = this;
		return $http(request).then(function(reply) {
			$scope.processUpdateReply(reply.data);
		});
	}

	$scope.processUpdateReply = function(messages) {
		$scope.messages = messages;
	}

})