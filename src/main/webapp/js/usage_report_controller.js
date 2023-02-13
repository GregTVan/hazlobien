app.controller('usageReportController', function($scope, $http, $httpParamSerializer, configuration, fileDownloadService, firmService) {

	$scope.firm;
	$scope.firms = [];
    $scope.showError = false;    

    $scope.firmReplyHandler = function(firms) {
		$scope.firms = firms;
		for(var i=0;i<$scope.firms.length;i++) {
			$scope.firms[i].name = $scope.firms[i].firm + ' (' + $scope.firms[i].name + ')';
		}
		$scope.firms.unshift({
			firm: 'INACTIVE',
			name: 'All Inactive Firms'
		})
		$scope.firms.unshift({
			firm: 'ALL',
			name: 'All Firms (Active & Inactive)'
		})
		$scope.firms.unshift({
			firm: 'ACTIVE',
			name: 'All Active Firms'
		});
		$scope.firm = $scope.firms[0]; 
	}

    firmService.getFirms($scope.firmReplyHandler, 'ALL');    

    $scope.searchActivityClick = function() {
        $scope.showError = false;
		var params = {
			firm: $scope.firm.firm,
			format: $scope.outputType.value,
			fromDate: $scope.from_date,
			toDate:  $scope.to_date
		}
		var serializedParams = $httpParamSerializer(params);
        var promise = $http({
            method: 'GET',
            url: 'canchek/rest/report/usage?' + serializedParams
        });
        // what if failure? OR success but output URL is malformed, OR parameters were effed
        promise.then($scope.getOutputFile);
    }

	$scope.getOutputFile = function(reply) {
		var fileName;
		// TODO: assumes only one file, there could be multiple (in theory)
		if(reply.data.files) {
			fileName = reply.data.files[0].split('/').pop();
		}
		fileDownloadService.getFile(reply.data.jobKey, fileName, null, 'Usage Report');
	};	

	$scope.availableOutputTypes = [{
		name: 'PDF',
		value: 'PDF'
	},{
		name: 'Excel',
		value: 'EXCEL'
	}]

	$scope.outputType = $scope.availableOutputTypes[1];

});