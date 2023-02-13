app.controller('referenceController', function(configuration, $http, $scope) {

    $scope.language = configuration.getLanguage();

    $http({
        method: 'GET',
        transformRequest: angular.identity,
        url: 'canchek/rest/reference_files'
    }).then(function(response) {
        $scope.data = response.data;
    });
});

