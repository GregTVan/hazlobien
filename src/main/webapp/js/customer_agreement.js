var app = angular.module('canchek', []);

app.controller('customerAgreementController', function($http, $scope) {

	$scope.agreementSigned = false;
	$scope.customerName = 'Customer';
	$scope.error = '';
	
	$scope.getInitialData = function() {
		$http({
			method: 'GET',
			url: '../../canchek/rest/profile'
		}).success($scope.processGetReply);
	}
	
	$scope.processGetReply = function(reply) {
		if(reply.agreementSignedBy && reply.agreementSignedDate) {
			$scope.agreementSigned = true;
			$scope.agreementSignedBy = reply.agreementSignedBy;
			$scope.agreementSignedDate = reply.agreementSignedDate;
			$scope.customerName = reply.name || 'Customer';
		} else {
			$scope.agreementSigned = false;
		}
	}

	$scope.clickSignAgreement = function() {
		$http({
			method: 'PUT',
			url: '../../canchek/rest/profile'
		}).success($scope.processPutReply);
	}
		
	$scope.processPutReply = function() {
		$scope.getInitialData();
		// if user closes opener, the update WILL be okay, but window.opener
		// will be null, avoid a console error
		if(window.opener) {
			window.opener.updateSigned();
		}
	}

	if(window.opener && window.opener.idToken) {
		$http.defaults.headers.common.Authorization = 'Bearer ' + window.opener.idToken;
		$scope.getInitialData();
	} else {
		$scope.error = 'Unable to retrieve agreement status. Please contact customersupport@canchek.com';
	}
	
});