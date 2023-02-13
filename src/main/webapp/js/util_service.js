app.service('utilService', function() {

	this.convertYYYYMMDDToMMDDYYYY = function(str) {
		var parts = str.split('-');
		if(parts.length === 3) {
			return parts[1] + '/' + parts[2] + '/' + parts[0];
		}
		return '';
	}
	
	this.findInArray = function(data, key, value, field) {
		for(var i=0;i<data.length;i++) {
			if(data[i][key] === value) {
				return $scope.data[i][value];
			}
		}
	}
	
	this.getLastToken = function(str, delimiter) {
		if(str && delimiter) {
			strings = str.split(delimiter);
			return strings[strings.length - 1];
		}
	}
	
	this.makeSelectOptions = function() {
		var ret = [];
		if(arguments.length %2 == 0) {
			for(var i=0;i<arguments.length;i+=2) {
				ret.push({name: arguments[i], value: arguments[i +1]});
			}
		}
		return ret;
	}

});