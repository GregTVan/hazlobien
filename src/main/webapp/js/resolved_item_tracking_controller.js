/*
 * This shares way too much with batchsearch.
 * Common logic should be separated into a service, or whatever.
 */

app.controller('resolvedItemTrackingController', function($http, $scope, configuration) {

    $scope.showError = false;
    
    $scope.searchDisabled = false;
    
    $scope.displayFeedback = function(reply) {
        $scope.showError = false;
        $scope.error = '';        
        if(reply.data.messages && reply.data.messages.length > 0) {
            $scope.showError = true;
            // TODO: first only?
            $scope.error = reply.data.messages[0];
        }
    }

    $scope.batchSearchClick = function() {
        $scope.showError = false;
		var batchRequest = {
			email: $scope.email
		}
		var formData = new FormData();
        formData.append('file', $scope.myFile);
		formData.append('request', JSON.stringify(batchRequest));
        var promise = $http({
            url: 'canchek/rest/resolved_item/batch',
            data: formData,
            method: 'POST',
			
			// Hope this works!
            contentType: false,
			headers: {'Content-Type': undefined},
            processData: false,
			transformRequest: angular.identity

        });
        promise.then($scope.displayFeedback);        
    }

    var fd = new FormData();
    fd.append('action', 'getUserEmail');
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
        if(reply.data.messages) {
            $scope.displayFeedback(reply);
            if(reply.data.user.planType == 'FREE') {
                $scope.searchDisabled = true;
            }
            return;
        }
        if(reply.data.user) {
            $scope.email = reply.data.user.email;
        }
    });

});