app.controller('manageDocumentsController', function($http, $scope, configuration, $httpParamSerializer) {

	$scope.openListener = function() {
		$scope.getInitialData();
	}

    $scope.processGetReply = function(reply) {
		$scope.data = reply.data;
    }

	$scope.getInitialData = function() {
		$http({
			method: 'GET',
			url: 'canchek/rest/documents/' + $scope.documentType.value + '/' + $scope.language.value
		}).then($scope.processGetReply, $scope.errorHandler);
	}

	//
	
	$scope.processPostReply = function(reply) {
		$scope.resetPage();
		$scope.getInitialData();
		// TODO; what if more than one
		if(reply.data.messages && reply.data.messages.length > 0) {
			$scope.error = reply.data.messages[0];
			$scope.showError = true;
		}
	}
	
	$scope.addOkClick = function() {
		var file = $scope.myFile;
        var fd = new FormData();
		fd.append('file', $scope.myFile);
		$scope.error = '';
		$scope.showError = false;
		$http({
            contentType: false,
			data: fd,
			headers: {'Content-Type': undefined},
			method: 'POST',
            processData: false,
			transformRequest: angular.identity,
			url: 'canchek/rest/documents/' + $scope.documentType.value + '/' + $scope.language.value
		}).then($scope.processPostReply, $scope.errorHandler);
	}
	
	//

	$scope.addCancelClick = function() {
		$scope.resetPage();
	}
	
	$scope.addClick = function() {
		$scope.showTable = false;
		$scope.showAddForm = true;
	}
	
    $scope.availableDocumentTypes = [{
            name: 'Regulations',
            value: 'regulations'
        },{
            name: 'News',
            value: 'news'
        }
    ];
	
    $scope.availableLanguages = [{
            name: 'English',
            value: 'en'
        },{
            name: 'French',
            value: 'fr'
        }
    ];
	
	$scope.documentType = $scope.availableDocumentTypes[0];
	
	$scope.language = $scope.availableLanguages[0];
	
	$scope.deleteClick = function(index) {
		$http({
			method: 'DELETE',
			url: 'canchek/rest/documents/' + $scope.documentType.value + '/' + $scope.language.value + '/' + $scope.data[index].fileName
		// TODO misnomer, not a POST
		}).then($scope.processPostReply, $scope.errorHandler);
	}
	
	$scope.refreshClick = function() {
		$scope.error = [];
		$scope.showError = false;
		$scope.getInitialData();
	}
	
	//
	
	$scope.resetPage = function() {
		$scope.showTable = true;
		$scope.showAddForm = false;
		$scope.showError = false;
	}
	
	$scope.errorHandler = function(reply) {
		if(reply.data.messages && reply.data.messages.length > 0) {
			$scope.error = reply.data.messages[0];
			$scope.showError = true;
		} else {
			$scope.error = 'An unexpected error has occurred. Please contact customersupport@canchek.com for assistance.';
			$scope.showError = true;
		}
    }
	
	//
	
	$scope.resetPage();
	
})