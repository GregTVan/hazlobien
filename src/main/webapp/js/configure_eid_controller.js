app.controller('configureEidController', function(firmService, userConfigurationService, $http, $q, $scope, configuration) {

	$scope.openListener = function() {
		// $q.all seems like a nice way to normalize functions that can return
		// promises OR data ... not sure this is the best way though
		$q.all([userConfigurationService.get()]).then(function(replies) {
			$scope.processUserReply(replies[0]);
		})
	}

	$scope.processUserReply = function(reply) {
		$scope.user = reply;
		// this will --always-- be a promise
		firmService.getFirms($scope.processFirmReply, 'ACTIVE');
	}

	$scope.processFirmReply = function(reply) {
		$scope.firms = reply;
		for(var i=0;i<$scope.firms.length;i++) {
			if($scope.firms[i].firm == $scope.user.firm) {
				$scope.firm = $scope.firms[i];
			}
		}
		var request = {
			method: 'GET',
			url: 'canchek/rest/eid_template/' + $scope.firm.firm
		}
		$http(request).then($scope.processGetReply);
	}

    $scope.processGetReply = function(response) {
		$scope.data = response.data;
    }	

	$scope.changeFirm = function(firm) {
		var request = {
			method: 'GET',
			url: 'canchek/rest/eid_template/' + $scope.firm.firm
		}
		$http(request).then($scope.processGetReply);
	}

    $scope.saveClick = function() {
		$scope.action('PATCH');
	}

    $scope.testClick = function() {
		$scope.action('POST');
	}

	$scope.action = function(verb) {
		$scope.messages = [];
		var data = {
			firm: $scope.firm.firm,
			text: $scope.data.text
		}
		var request = {
			data: data,
			method: verb,
			url: 'canchek/rest/eid_template'
		}
		return $http(request).then(function(reply) {
			$scope.processUpdateReply(reply.data);
		});
	}

	$scope.processUpdateReply = function(messages) {
		$scope.messages = messages;
	}

})