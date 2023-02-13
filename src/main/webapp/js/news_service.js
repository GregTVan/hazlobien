app.service('newsService', function($http) {

	var url = 'canchek/rest/news';
	
	this.delete = function(key, replyHandler, errorHandler) {
		$http({
			method: 'DELETE',
			url: 'canchek/rest/news/' + key
		}).then(replyHandler, errorHandler);
	}
	
	this.getOne = function(id) {
		return $http({
			method: 'GET',
			url: url + '/' + id
		})
	}

	/* Long = includes entire news story, used in Manage News screen.
	   Short = omits body of story, used in home page. */

	this.getAllLong = function(replyHandler) {
		$http({
			method: 'GET',
			url: url + '?format=long'
		}).then(replyHandler);
	}

	this.getAllShort = function(replyHandler) {
		$http({
			method: 'GET',
			url: url + '?format=short'
		}).then(replyHandler);
	}
	
	this.postPut = function(mode, addedDateString, caption, content, contentType, key, attachment, replyHandler, errorHandler) {
        var fd = new FormData();
        var request = {
			addedDateString: addedDateString,
			caption: caption,
			contentType: contentType
		}			
		if(contentType === 'FILE' && attachment) {
			request.fileName = attachment.name;
			fd.append('file', attachment);
		}
		if(contentType === 'TEXT') {
			request.content = content;
		}
		var method = '';
		if(mode === 'ADD') {
			method = 'POST'
		}
		if(mode === 'CHANGE') {
			method = 'PUT';
			request.key = key;
		}
		fd.append('request', JSON.stringify(request));
		$http({
            contentType: false,
			data: fd,
			headers: {'Content-Type': undefined},
			method: method,
            processData: false,
			transformRequest: angular.identity,
			url: 'canchek/rest/news'
		}).then(replyHandler, errorHandler);
		
	}

});