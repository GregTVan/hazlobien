app.controller('administrationController', function($scope, $http, configuration) {

    $scope.getAdministrationOptions = function() {
		// prevent token missing error when refreshing from Admin page
		// TODO could probably happen from other places too, consider handling SS somehow
		if(typeof $http.defaults.headers.common.Authorization !== 'undefined') {
			$http({
				method: 'GET',
				url: 'canchek/rest/administrationOptions'
			}).then($scope.updateAdministrationOptions);
		}
    };
    
    $scope.updateAdministrationOptions = function(reply) {
        $scope.administrationOptions = reply.data;
    };
    
    $scope.getURL = function(url) {
        // It appears if you do the Math.round() in each call, ng infintely repeats the request to get each file, which causes mass havoc.
        // Setting the cacheBuster only once seems to solve this.
        // We should be cacheBusting ALL our static HTTP requests, not just in this file;
        // Look into how $templateCache works
        return 'html/dynamic_language/' + url + '?cacheBuster=' + $scope.cacheBuster;
    }
    
    $scope.cacheBuster = Math.round(new Date().getTime() / 1000);
    
    $scope.getAdministrationOptions();
	
});

app.directive('collapseOpenListener', function() {
	return {
		link: function(scope, element, attrs, ctrl) {
			element.on('shown.bs.collapse', function() {
				if(scope.openListener) {
					scope.openListener();
				}
			})
		}
	}
});
