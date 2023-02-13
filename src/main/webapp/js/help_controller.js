app.controller('helpController', function($scope, help) {
    $scope.help_pages = help();
});