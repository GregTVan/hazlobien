app.controller('zohoController', function($scope, $location, $translate, $http, configuration) {

    $scope.sendContactToZoho = function() {
        // TODO: do character escaping here eg. '&' (we do it but do it PROPERLY!)
        $scope.showError = false;
		var request = {
			email: $scope.thisIsTerrible($scope.email),
			firmName: $scope.thisIsTerrible($scope.firmName),
			firstName: $scope.thisIsTerrible($scope.firstName),
			lastName: $scope.thisIsTerrible($scope.lastName),
			message: $scope.thisIsTerrible($scope.message)
		}
        $http({
            data: request,
            method: 'POST',
            url: 'canchek/rest/crm'
        }).then(function(response) {
            if(response.data.messages) {
                $scope.error = response.data.messages[0];
                $scope.showError = true;
            }
        });
    }
    
    $scope.thisIsTerrible = function(str) {
        // so brackets in Description won't cause a barf
        // $sanitize didn't work, there must be a proper way though
        // and we are losing data FFS
        // and anyway this could be handled server-side
        // but escaping SS didn't work and we are OUT OF TIME so Buckit
        if(!str) return '';
        return str.replace('<', ' ').replace('>', ' ').replace('&', ' ').replace('%', ' ');
    }
    
    $scope.resetForm = function() {
        $scope.showError = false;
        $scope.email = '';
        $scope.error = '';
        $scope.firmName = '';
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.message = '';
    }
   
});