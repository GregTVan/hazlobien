app.controller('insiderDetailController', function($scope, $http, $stateParams, $state, configuration) {
    // QUERY FOR REAL
    $scope.sediId = $stateParams.sediId;
    // QUERY FOR REAL
    $scope.updateInsiderDetails = function(response) {
        $scope.data = response.data.insiderDetailResult;
        if($scope.data && $scope.data.insiderIssuerDetailResultDTO) {
            $scope.convertArrayToString($scope.data.alInsiderIssuerDetailResultDTO, 'registeredHolders', '<br>');
            $scope.convertArrayToString($scope.data.alInsiderIssuerDetailResultDTO, 'insiderRelationshipToIssuer', '<br>');
        }
    }
    $scope.getInsiderDetails = function() {
        var fd = new FormData();
        fd.append('action', 'getInsiderDetails');
        fd.append('sediId', $scope.sediId);
        fd.append('language', configuration.getLanguage());
        var promise = $http({
            url: configuration.getServletUrl(),
            data: fd,
            processData: false,
            contentType: false,
            method: 'POST',
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        // what if failure?
        promise.then($scope.updateInsiderDetails);
    }
    $scope.getInsiderDetails();
    // COPIED FROM SEARCH CONTROLLER- and modified!! - turn this into a service AND figure out a more proper way
    $scope.convertArrayToString = function(outer_array_name, inner_array_name, delimiter) {
        for(var i=0; i<outer_array_name.length;i++) {
            // server-side returns null when the array is empty
            // TODO: change SS to just return empty string
            var inner = outer_array_name[i][inner_array_name];
            if(inner.length === 1 && inner[0] === null) {
                inner[0] = '';
            }
            var wip = '';
            for(var j=0; j<inner.length; j++) {
                if(j > 0) {
                    wip += delimiter;
                }
                wip += inner[j];
            }
            // by value
            outer_array_name[i][inner_array_name] = wip;
        }
    }
})