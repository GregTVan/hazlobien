app.service('configuration', function($http, $location, $q, $state, $translate) {
    var defer = $q.defer();
    var isLoggedIn = false;
    var servletUrl = 'canchek/CanChek';
    var servletUrl = 'canchek/CanChek';
    var that = this;
    var user = {language: 'en'};
	var loginError = 'Error logging in. Please contact customersupport@canchek.com.';
    this.getPromise = function() {
        return defer.promise;
    }
    this.resolvePromise = function() {
        var fd = new FormData();
        fd.append('action', 'getUserConfiguration');
        var promise = $http({
            contentType: false,
            data: fd,
            headers: {'Content-Type': undefined},
            method: 'POST',
            processData: false,
            transformRequest: angular.identity,
            url: servletUrl
        });
        promise.then(this.getConfiguration);
    }
    this.getConfiguration = function(response) {
		// there won't be a user if it's an inactive user, because API
		// just returns a generic error message
		if(response.data.user) {
			user = response.data.user;
			that.setLanguage(user.language);
			isLoggedIn = true;
		} else {
			if(response.data.messages && response.data.messages.length > 0) {
				loginError = response.data.messages[0];
			}
			that.setLanguage('en');
		}
        //
		if(response.data && response.data.user) {
            // default route is to 'search', so only override the special case of EID-only customers
            // only default to EID for EID-only customers
            if(response.data.user.eid && !(response.data.user.aml)) {
			    $state.go('eid');
		    } else {
                $state.go('search');
            }
		}
        //
        defer.resolve(response);
    }
    that.setLanguage = function(language) {
        user.language = language;
        $translate.use(user.language);
    }
    this.getUser = function() {
        return user;
    }
    this.getLanguage = function() {
        if(user.language) {
            return user.language;
        } else {
            return 'en';
        }
    }
    this.getIsLoggedIn = function() {
        return isLoggedIn;
    }
    this.getServletUrl = function() {
        return servletUrl;
    }
	this.getLoginError = function() {
		return loginError;
	}
});
