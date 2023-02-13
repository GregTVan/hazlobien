app.service('userConfigurationService', function($http) {

	this.user;

	this.get = function(always) {
		if(always || typeof this.user === 'undefined') {
			var request = {
				method: 'GET',
				url: 'canchek/rest/user'
			}
			var that = this;
			return $http(request).then(function(reply) {
				that.user = reply.data;
				return that.user;
			});
		} else {
			return this.user;
		}
	}

});