app.controller('loginPreController', function(auth0Service, $scope) {
    $scope.login = function() {
        auth0Service.doLogin();
    }
});