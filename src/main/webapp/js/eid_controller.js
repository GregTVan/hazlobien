app.controller('eidController', function(configuration, fileDownloadService, $http, $scope) {

	$scope.eidDisabled = true;
	$scope.error = '';
	$scope.requestData = [];
	$scope.showAddForm = false;
	$scope.showError = false;
	$scope.showActivityRow = [];
	$scope.showConfirmResendEmailRow = [];
	$scope.showTable = true;

	//

	$scope.addCloseClick = function() {
		$scope.showError = false;
		$scope.error = '';
		$scope.showAddForm = false;
		$scope.showTable = true;
		$scope.getRequests();
	}

	$scope.addClick = function() {
		$scope.showAddForm = true;
		$scope.showTable = false;
	}
	
	$scope.addOkClick = function() {
		$scope.showError = false;
		$scope.error = '';
		var addRequest = {
			clientId: $scope.clientId,
			email: $scope.email,
			firstName: $scope.firstName,
			lastName: $scope.lastName
		}
        $http({
			data: addRequest,
            method: 'POST',
			url: 'canchek/rest/eid_request'
        }).then($scope.processAddResponse);
	}

	$scope.archiveClick = function(index) {
		$scope.archive(index);
	}
	
	$scope.refreshActivityClick = function(index) {
		$scope.getActivity(index);
	}
	
	$scope.refreshRequestsClick = function() {
		$scope.getRequests();
	}

	$scope.getReportClick = function(index) {
		$scope.getReport(index);
	}
	
	$scope.toggleActivityClick = function(index) {
		$scope.showActivityRow[index] = !$scope.showActivityRow[index];
		if($scope.showActivityRow[index]) {
			$scope.getActivity(index);
		}
	}
	
	//

    $scope.archive = function(index) {
		var key = $scope.requestData[index].key;
		if(key) {
			$http({
				contentType: false,
				headers: {'Content-Type': undefined},
				method: 'DELETE',
				processData: false,
				transformRequest: angular.identity,
				url: 'canchek/rest/eid_request/' + key
			}).then($scope.getRequests);
		}
    }

    $scope.getActivity = function(index) {
		var key = $scope.requestData[index].key;
		if(key) {
			$http({
				contentType: false,
				headers: {'Content-Type': undefined},
				method: 'GET',
				processData: false,
				transformRequest: angular.identity,
				url: 'canchek/rest/eid_activity/' + key
			}).then($scope.updateActivityTable);
		}
    }
	
	$scope.getIsAvailable = function() {
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
		promise.then($scope.processIsAvailableResponse);
	}
	
	$scope.getReport = function(index) {
        $http({
            contentType: false,
            headers: {'Content-Type': undefined},
            method: 'GET',
            processData: false,
            transformRequest: angular.identity,
			url: 'canchek/rest/eid_report/' + $scope.requestData[index].key
        }).then($scope.getOutputFile);
	}
	
    $scope.getRequests = function() {
        $http({
            contentType: false,
            headers: {'Content-Type': undefined},
            method: 'GET',
            processData: false,
            transformRequest: angular.identity,
			url: 'canchek/rest/eid_request'
        }).then($scope.updateRequestTable);
    }

    $scope.initiateResendEmail = function(index) {
		$scope.showConfirmResendEmailRow[index] = true;
	}
		
	$scope.cancelResendEmailClick = function(index) {
		$scope.showConfirmResendEmailRow[index] = false;
	}
	
	$scope.confirmResendEmailClick = function(index) {
		var key = $scope.requestData[index].key;
		if(key) {
			$http({
				contentType: false,
				headers: {'Content-Type': undefined},
				method: 'POST',
				processData: false,
				transformRequest: angular.identity,
				url: 'canchek/rest/eid_request/resend_email/' + key
			}).then($scope.resendEmailReply);
		}
	}
	
	$scope.resendEmailReply = function(index) {
		$scope.showConfirmResendEmailRow = [];
	}
	
	//
	
	$scope.getIsResendEmailEnabled = function(index) {
		var request = $scope.requestData[index];
		return request.email && request.email !== 'ARCHIVED' && (request.scannedDocument == false || request.passedLiveness == false || request.namesMatched == false);
	}
	
	$scope.processAddResponse = function(response) {
		// TODO only shows first error
		if(response.data && response.data.length > 0) {
			$scope.showError = true;
			$scope.error = response.data[0];
		}
	}

	$scope.processIsAvailableResponse = function(response) {
		if(response.data && response.data.user && response.data.user.eid) {
			$scope.eidDisabled = false;
			$scope.showError = false;
			$scope.getRequests();
		} else {
			$scope.eidDisabled = true;
			$scope.error = 'You are not subscribed to Canchek eID. Please contact customersupport@canchek.com for assistance.';
			$scope.showError = true;
		}
	}

	$scope.getOutputFile = function(response) {
		fileDownloadService.getFile(response.data.jobKey, response.data.pdfFile.split('/').pop(), null, 'Canchek-eID Report');
	}

	$scope.updateActivityTable = function(response) {
		for(var i=0;i<$scope.requestData.length;i++) {
			if(response.data.key === $scope.requestData[i].key) {
				$scope.requestData[i].activity = response.data.eidActivityList;
			}
		}
	}		
	
	$scope.updateRequestTable = function(response) {
		$scope.requestData = response.data;		
	}		
	
	//
	
	$scope.getIsAvailable();

});