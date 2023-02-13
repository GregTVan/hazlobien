app.service('dynamicValuesService', function($http, $q) {

	var vals = {};

	this.loadData = function(tables) {
		var request = {
			method: 'GET',
			url: 'canchek/rest/dynamic_values?tables='
		}
		var data = '';
		for(var i=0;i<(tables || []).length;i++) {
			if(typeof vals[tables[i]] == 'undefined') {
				if(data) {
					data += ';';
				}
				data += tables[i];
			}
		}
		if(data) {
			request.url += data;
			var that = this;
			return $http(request).then(function(reply) {
				for(var i=0;i<(tables).length;i++) {
					var table = tables[i];
					if(typeof reply.data[table] == 'undefined') {
						vals[table] = [];
					} else {
						vals[table] = reply.data[table];
					}
				}
				return vals;
			});
		} else {
			return vals;
		}
	}

	this.getData = function() {
		return vals;
	}

});