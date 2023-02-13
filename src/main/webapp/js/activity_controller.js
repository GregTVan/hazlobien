app.controller('activityController', function($scope, $http, configuration) {
    $scope.showError = false;
    $scope.responseHasErrors = function(response) {
        if(response.data.error) {
            // clunky can't we just set ng-show equal to errorMessage ! blank
            $scope.showError = true;
            $scope.errorMessage = response.data.external_description;
            return true;
        } else {
            return false;
        }
    }
    var fd = new FormData();
    fd.append('action', 'searchActivityQuery');
    fd.append('language', configuration.getLanguage());
    $http({
        data: fd,
        processData: false,
        contentType: false,
        headers: {'Content-Type': undefined},
        method: 'POST',
        transformRequest: angular.identity,
        url: configuration.getServletUrl()
    }).then(function(response) {
        if(!$scope.responseHasErrors(response)) {
            $scope.data = response.data.activityList;
        }
    });
});