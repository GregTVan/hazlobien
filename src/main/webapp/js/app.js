var app = angular.module('canchek', ['ui.router', 'pascalprecht.translate', 'ngSanitize']);

app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider
        .translations('en', translations_en)
        .preferredLanguage('en');
    $translateProvider
        .translations('fr', translations_fr);
    // https://angular-translate.github.io/docs/#/guide/19_security
    // ANY values here (omitted, escape, sanitize) all seem to work
    // how does this even relate to the Aliases, etc. columns where we use <br> ??
    $translateProvider.useSanitizeValueStrategy('sce');
}]);

// TODO: deglobalize
var lock = null;
var is_file;
var file_name;
var gResolvedItemTracking;

// TODO: unglobalize

// http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

// http://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields
app.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
});

// Why even bother separating this out? Seems pointless!
// (But JP's :keep controllers thin!!: stuff...)
// TODO: BUT FOR SURE THE NAME IS WRONG
app.service('terroristNames', function($http, $location, configuration, $httpParamSerializer) {
    this.query = function(clientId, entityName, firstName, lastName) {
        var params = {
			'clientId': clientId || '',
			'entityName': entityName || '',
			'firstName': firstName || '',
			'language': configuration.getLanguage(),
			'lastName': lastName || ''
		}
		var serializedParams = $httpParamSerializer(params);
        return $http({
            contentType: false,
            headers: {'Content-Type': undefined},
            method: 'GET',
            processData: false,
            transformRequest: angular.identity,
			url: 'canchek/rest/search?' + serializedParams
        })
    }
});