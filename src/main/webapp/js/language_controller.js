app.controller('languageController', function($scope, $state, $translate, $rootScope) {
    $scope.language = 'en';
    $scope.switchLanguage = function() {
        if($scope.language == 'en') {
            $scope.language = 'fr';
        } else {
            $scope.language = 'en';
        }
        $translate.use($scope.language);
        $state.reload();
        // temporary until we can remove global
        lang = $scope.language;
        $rootScope.$emit('languageChanged');
    }
});

