app.controller('falsePositiveReportController', function($scope, $http, configuration, fileDownloadService) {

    $scope.okClick = function() {
		$scope.error = 'Generating report...';
		var request = {
			method: 'GET',
			url: 'canchek/rest/report/false_positives?format=' + $scope.outputType.value
		}
        $http(request).then($scope.getOutputFile, $scope.handleError);
    }

	$scope.getOutputFile = function(reply) {
		// TODO should be from server?
		$scope.error = 'Report complete.';
		for(var i=0;i<(reply.data.files || []).length;i++) {
			fileDownloadService.getFile(reply.data.jobKey, reply.data.files[i]);
		}
	}

	$scope.handleError = function(reply) {
		if(reply.data.messages && reply.data.messages.length > 0) {
			$scope.error = reply.data.messages[0];
		} else {
			$scope.error = 'Internal error. Contact customersupport@canchek.com.';
		}
	}

	$scope.availableOutputTypes = [{
		name: 'PDF',
		value: 'PDF'
	},{
		name: 'Excel',
		value: 'EXCEL'
	}]
	
	$scope.outputType = $scope.availableOutputTypes[0];
	
});