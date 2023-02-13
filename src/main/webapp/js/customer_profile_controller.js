app.controller('customerProfileController', function($scope, $http, $window, configuration) {

	$scope.adverseMediaQualifiers = '';
	$scope.customerAgreementMessage1 = '';
	$scope.customerAgreementMessage2 = '';
	$scope.eidSubscriber = false;
	$scope.error = '';
	$scope.showError = false;
	
	$scope.openListener = function() {
		$scope.getInitialData();
	}
	
	$scope.getInitialData = function() {
		$http({
            method: 'GET',
            url: 'canchek/rest/profile'
        }).success($scope.processGetReply);
	}
	
	$scope.processGetReply = function(reply) {
		$scope.subscribableServices = reply.subscribableServices;
		$scope.adverseMediaQualifiers = reply.adverseMediaQualifiers;
		// [3] = EID service
		$scope.eidSubscriber = reply.subscribableServices[3].subscribed;
		if(reply.agreementSignedBy && reply.agreementSignedDate) {
			$scope.customerAgreementMessage1 = 'Your Canchek-eID agreement was signed on ' + reply.agreementSignedDate + " by '" + reply.agreementSignedBy + "'.";
			$scope.customerAgreementMessage2 = '';
			$scope.error = '';
			$scope.showError = false;
		} else {
			$scope.customerAgreementMessage1 = 'Please review the Canchek-eID Customer Agreement by clicking below. The agreement will open in a separate tab.';
			$scope.customerAgreementMessage2 = 'After reading it, you can sign it by clicking the button at the bottom of the last page.';
			$scope.error = 'Action is required to activate your Canchek-eID subscription.';
			$scope.showError = true;
		}			
	}

	$scope.clickRead = function() {
		window.open('html/dynamic_language/customer_agreement.html', '_blank');
	}
	
	$scope.clickSave = function() {
		var data = {
			adverseMediaQualifiers: $scope.adverseMediaQualifiers
		}
		$http({
			data: data,
            method: 'PATCH',
            url: 'canchek/rest/profile'
        }).success($scope.processSaveReply);
	}
	
	$scope.processSaveReply = function() {
		$scope.error = 'Adverse media qualifiers updated';
		$scope.showError = true;
	}
	
	$scope.updateSigned = function() {
		$scope.error = 'Your Canchek-eID agreement is now complete. Thank you for your business.';
		$scope.showError = true;
		$scope.customerAgreementMessage1 = '';
		$scope.customerAgreementMessage2 = '';
		$scope.$digest();
	}
	
	$window.updateSigned = $scope.updateSigned;
    
});