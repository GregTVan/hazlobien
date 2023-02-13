app.controller('uploadController', function($http, $scope, configuration) {
    $scope.translations = translations_en;
    if(configuration.getLanguage() == 'fr') {
        $scope.translations = translations_fr;
    }
    $scope.upload = function() {
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('action', 'upload');
        fd.append('content', $scope.content);
        fd.append('file', $scope.myFile);
        fd.append('format', $scope.format);
        //TODO: French
        $scope.feedback = [$scope.translations.APP.PLEASE_WAIT]; //'Please wait while database is updated...'
        var promise = $http({
            url: configuration.getServletUrl(),
            data: fd,
            processData: false,
            contentType: false,
            method: 'POST',
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        promise.then($scope.displayFeedback);        
    }
    $scope.displayFeedback = function(ret) {
        $scope.feedback = ret.data.messages;
    }
    $scope.clicked = function() {
        $scope.feedback = [];
    }
});
