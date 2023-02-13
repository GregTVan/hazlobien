app.service('firmService', function($http, configuration) {
	
	this.getAllFirmCodes = function(replyHandler, filter) {
		if(!filter) {
			filter = 'ALL';
		}
        var promise = $http({
            url: 'canchek/rest/firm?filter=' + filter,
            method: 'GET'
        });
        promise.then(function(reply) {
			var ret = [];
			for(var i=0;i<reply.data.length;i++) {
				ret.push(reply.data[i].firm);
			}
			// server returns sorted by NAME, which make sense in the main Firms display, but not in
			// a drop-down, so, resort it here
			ret.sort(function(a, b) {
				if(a < b) return -1;
				else return 1;
			});
			replyHandler(ret);
		})
	}

	this.getFirms = function(replyHandler, filter) {
		if(!filter) {
			filter = 'ALL';
		}
        var promise = $http({
            url: 'canchek/rest/firm?filter=' + filter,
            method: 'GET'
        });
        promise.then(function(reply) {
			var ret = [];
			for(var i=0;i<reply.data.length;i++) {
				ret.push(reply.data[i]);
			}
			// server returns sorted by NAME, which make sense in the main Firms display, but not in
			// a drop-down, so, resort it here
			ret.sort(function(a, b) {
				if(a.firm < b.firm) return -1;
				else return 1;
			});
			replyHandler(ret);
		})
	}

});