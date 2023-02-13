app.service('fileDownloadService', function($http) {

	function createUserFileName(fileName, title) {
		var suffix = '';
		if(fileName) {
			var fileNameParts = fileName.split('.');
			if(fileNameParts[1]) {
				suffix = '.' + fileNameParts[1];
			}
		}
		if(title) {
			return title + suffix;
		} else {
			return 'Canchek Search Result' + suffix;
		}
	}
	
	this.getFile = function(jobKey, fileName, callback, title) {
		// https://stackoverflow.com/questions/14215049/how-to-download-file-using-angularjs-and-calling-mvc-api		
		$http({
            method: 'GET',
			responseType: 'arraybuffer',
            url: 'canchek/rest/output/' + jobKey + '/' + fileName,
        }).success(function (data, httpStatusCode, headers, config) {
			var file = new Blob([data], {});
			var fileURL = URL.createObjectURL(file);
			var a = document.createElement('a');
			a.href = fileURL;
			a.target = '_blank';
			a.download = createUserFileName(fileName, title);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			if(callback) {
				callback(httpStatusCode);
			}
		}).error(function(reply, httpStatusCode) {
			if(callback) {
				callback(httpStatusCode);
			}
		});
	};
	
});