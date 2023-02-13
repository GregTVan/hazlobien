app.controller('searchActivityReportController', function($scope, $http, $httpParamSerializer, configuration, fileDownloadService) {
    $scope.promptUserScope = false;
    $scope.setUserConfiguration = function(result) {
        $scope.promptUserScope = (result.data.user.role === 'super' || result.data.user.role === 'manager');
    }
    // initialize 
    var fd = new FormData();
    fd.append('action', 'getUserConfiguration');
    var promise = $http({
        data: fd,
        processData: false,
        contentType: false,
        headers: {'Content-Type': undefined},
        method: 'POST',
        transformRequest: angular.identity,
        url: configuration.getServletUrl(),
    });
    // what if failure? OR success but output URL is malformed, OR parameters were effed
    promise.then($scope.setUserConfiguration);
    //
    $scope.showError = false;
    $scope.searchActivityClick = function() {
		$scope.error = 'Generating report...';
        $scope.showError = true;
		var params = {
			'fromDate': $scope.fromDate,
			'toDate': $scope.toDate,
			'hasHitsFilter': $scope.hasHitsFilter.value,
			'outputType': $scope.outputType.value,
			'userScope': $scope.userScope.value,
		}
		var serializedParams = $httpParamSerializer(params);
        var promise = $http({
            contentType: false,
            headers: {'Content-Type': undefined},
            method: 'GET',
            processData: false,
            transformRequest: angular.identity,
			url: 'canchek/rest/search_activity_report?' + serializedParams
        });
        promise.then($scope.getOutputFile);
    }
	$scope.getOutputFile = function(reply) {
		$scope.error = '';
        $scope.showError = false;
		if(reply.data.messages && reply.data.messages.length > 0) {
			$scope.error = reply.data.messages[0];
			$scope.showError = true;
			return;
		}
		var fileName;
		if(reply.data.excelFile) {
			fileName = reply.data.excelFile.split('/').pop();
		}
		if(reply.data.pdfFile) {
			fileName = reply.data.pdfFile.split('/').pop();
		}
		if(fileName) {
			fileDownloadService.getFile(reply.data.jobKey, fileName);
		}
	};	
	
	
	$scope.availableHasHitsFilters = [{
		name: 'All',
		value: 'ALL'
	},{
		name: 'Only with One or More Hits',
		value: 'HAS_HITS_ONLY'
	}]
	
	$scope.hasHitsFilter = $scope.availableHasHitsFilters[0];
	
	$scope.availableOutputTypes = [{
		name: 'PDF',
		value: 'PDF'
	},{
		name: 'Excel',
		value: 'EXCEL'
	}]
	
	$scope.outputType = $scope.availableOutputTypes[0];
	
	$scope.availableUserScopeOptions = [{
		name: 'Me Only',
		value: 'MY_ACTIVITY'
	},{
		name: 'Everyone',
		value: 'ALL_USERS'
	}]
	
	$scope.userScope = $scope.availableUserScopeOptions[0];

});