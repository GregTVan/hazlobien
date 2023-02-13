app.controller('reportsController', function(fileDownloadService, $scope, $http) {
	
	$scope.openListener = function() {
		$scope.getInitialData();
	}
	
    $scope.displayFeedback = function(reply) {
        $scope.showError = false;
        $scope.error = '';        
        if(reply.data.messages && reply.data.messages.length > 0) {
            $scope.showError = true;
            // TODO: first only?
            $scope.error = reply.data.messages[0];
        }
    }
    
    $scope.refreshClick = function() {
        $scope.showError = false;
        $scope.error = '';        
        $scope.getInitialData();
    }
	
	$scope.getFile = function(row, type) {
		$scope.showError = false;
		var fileName = '';
		if(type == 'EXCEL') {
			fileName = $scope.data[row].excelFileName;
		}
		if(type == 'PDF') {
			fileName = $scope.data[row].pdfFileName;
		}
		fileName = fileName.split('/')[2];
		fileDownloadService.getFile($scope.data[row].key, fileName, $scope.updateGetStatus);
	}
	
	$scope.updateGetStatus = function(httpStatusCode) {
		if(httpStatusCode != 200) {
			$scope.showError = true;
			$scope.error = 'This file cannot be accessed. Please contact customersupport@canchek.com for assistance.';
		}
	}
    
    $scope.getInitialData = function() {
        var promise = $http({
			method: 'GET',
            url: 'canchek/rest/job'
        });
        promise.then($scope.updateInitialData);
    };
    
    $scope.updateInitialData = function(reply) {
        $scope.data = reply.data;
    };
   
});