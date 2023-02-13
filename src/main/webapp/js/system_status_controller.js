app.controller('systemStatusController', function($scope, $http, configuration) {
	
	$scope.openListener = function() {
		$scope.showError = true;
		$scope.error = 'Please wait while we retrieve system information...';
		$scope.getInitialData();
	}
	
    $scope.translations = translations_en;
	
    if(configuration.getLanguage() == 'fr') {
        $scope.translations = translations_fr;
    }
    
    $scope.getInitialData = function() {
		$http({
			url: 'canchek/rest/status',
			method: 'GET'
		}).then($scope.updateInitialData);
    };
    
    $scope.updateInitialData = function(reply) {
        if(reply.data.messages) {
			$scope.error = '';
			$scope.info = reply.data.messages[0];
		}
	}
    
});