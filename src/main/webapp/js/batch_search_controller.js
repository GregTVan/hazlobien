app.controller('batchSearchController', function($http, $scope, configuration) {

    $scope.resolvedItemTracking = false;

    $scope.resolvedItemTrackingAvailable = true;

    $scope.showError = false;
    
    $scope.showDataSets = false;
    
    $scope.searchDisabled = false;
	
	$scope.dataSets = [];
	
    $scope.displayFeedback = function(reply) {
        $scope.searchDisabled = false;
        $scope.showError = false;
        $scope.error = '';        
        if(reply.data.messages && reply.data.messages.length > 0) {
            $scope.showError = true;
            // TODO: first only?
            $scope.error = reply.data.messages[0];
        }
    }
    
    $scope.showDataSetsClick = function() {
        $scope.showDataSets = !($scope.showDataSets);
    }
    
    $scope.batchSearchClick = function() {
        $scope.showError = false;
        // TODO protect no file etc.
        var file = $scope.myFile;
        if(!file) {
            $scope.showError = true;
            $scope.error = 'Please select a file before clicking OK.';
            return;
        }
        $scope.searchDisabled = true;
        if(file.size && file.size > 100000) {
            $scope.showError = true;
            $scope.error = 'Please wait while we upload this file...';
        }
        var fd = new FormData();
        fd.append('action', 'batchSearch');
        fd.append('email', $scope.email);
        fd.append('file', $scope.myFile);
        fd.append('outputExcel', $scope.outputExcel);
        fd.append('outputPdf', $scope.outputPdf);
        fd.append('resolvedItemTracking', $scope.resolvedItemTracking);
		for(var i=0;i<$scope.dataSets.length;i++) {
			fd.append($scope.dataSets[i].dataSetInfo.code, $scope.dataSets[i].isSelectedByUser);
		}
        //TODO: French
        //$scope.feedback = [{'message': 'Please wait while database is updated...'}];
        var promise = $http({
            url: configuration.getServletUrl(),
            data: fd,
            processData: false,
            contentType: false,
            method: 'POST',
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        promise.then($scope.displayFeedback);        
    }

    var fd = new FormData();
    fd.append('action', 'getUserConfiguration');
    var promise = $http({
        url: configuration.getServletUrl(),
        data: fd,
        processData: false,
        contentType: false,
        method: 'POST',
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    });

	$scope.replyHandler = function(reply) {
		$scope.dataSets = reply.data;
	}

	var promise2 = $http({
		contentType: false,
		data: null,
		headers: {'Content-Type': undefined},
		method: 'GET',
		processData: false,
		transformRequest: angular.identity,
		url: 'canchek/rest/userdatasetinfo?filter=BATCH'
	}).then($scope.replyHandler);

	//

	// get email address, TODO consolidated getuserinfo (3 calls to one)

	var fd = new FormData();
    fd.append('action', 'getUserConfiguration');
    var promise = $http({
        url: configuration.getServletUrl(),
        data: fd,
        processData: false,
        contentType: false,
        method: 'POST',
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    });
    
    promise.then(function(reply) {
        $scope.searchDisabled = false;
        if(reply.data.user) {
            // note confusing variable names, there are THREE meanings to resolvedItemTracking
            // - in effect for a specific request
            // - enabled for this user
            // - enabled for this firm <- this is the one we use here
            $scope.email = reply.data.user.email;
            $scope.resolvedItemTrackingAvailable = reply.data.user.resolvedItemTrackingAvailable;
        }
        if(reply.data.messages) {
            $scope.displayFeedback(reply);
            if(reply.data.user.planType == 'FREE') {
                $scope.searchDisabled = true;
            }
            return;
        }
    });
	
	//
	
})