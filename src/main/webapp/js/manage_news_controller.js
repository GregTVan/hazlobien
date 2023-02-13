/*
 * Important! News is paged client-side because I couldn't get NG-Router to work with
 * dynamically created routes. It seemed to work but didn't in all cases. So now we
 * get all the news once at startup, do all the routing once, and then page it by hiding
 * the DIV's that are outside the selected page. It's actually elegant enough, but will
 * be less efficient as news grows. Oh well.
 */

app.controller('manageNewsController', function($http, $scope, newsService, utilService) {

	$scope.openListener = function() {
		$scope.get();
	}

	$scope.availableContentTypes = utilService.makeSelectOptions('PDF', 'FILE', 'Text', 'TEXT');
	$scope.contentType = $scope.availableContentTypes[0];
	$scope.fileUploadLabel = 'Choose File';
	$scope.mode = 'QUERY';
	$scope.showTextArea = true;
	$scope.showUploadButton = true;
	
	//
	
	$scope.postPutReply = function(reply) {
		// TODO; what if more than one
		$scope.setMode('QUERY');
		$scope.get();
		if(reply.data.messages && reply.data.messages.length > 0) {
			$scope.error = reply.data.messages[0];
			$scope.showError = true;
		}
	}
	
	$scope.postPut = function() {
		$scope.clearMessages();
		newsService.postPut($scope.mode, $scope.addedDateString, $scope.caption, $scope.content, $scope.contentType.value, $scope.key, $scope.myFile, $scope.postPutReply, $scope.serverError);
	}
	
	//
	
	$scope.deleteReply = function (reply) {
		$scope.postPutReply(reply);
		$scope.get();
	}
	
	$scope.delete = function(index) {
		$scope.clearMessages();
		newsService.delete($scope.data[index].key, $scope.deleteReply, $scope.serverError);
	}

	//
	
    $scope.getReply = function(reply) {
		$scope.data = reply.data;
    }

	$scope.get = function() {
		$scope.clearMessages();
		newsService.getAllLong($scope.getReply);
	}

	//

	$scope.clickContentType = function() {
		$scope.showTextArea = ($scope.contentType.value == 'TEXT');
		$scope.showUploadButton = ($scope.contentType.value == 'FILE');
	}

	$scope.setAttachmentIcon = function(index)  {
		var visibility = 'hidden';
		if($scope.data[index].fileName) {
			visibility = 'visible';
		}
		return { visibility: visibility };
	}

	//

	$scope.clearMessages = function() {
		$scope.error = '';
		$scope.showError = false;
	}
	
    $scope.serverError = function(reply) {
		if(reply.data.messages && reply.data.messages.length > 0) {
			$scope.error = reply.data.messages[0];
			$scope.showError = true;
		} else {
			$scope.error = 'An unexpected error has occurred. Please contact customersupport@canchek.com for assistance.';
			$scope.showError = true;
		}
    }

	$scope.setMode = function(mode, index) {
		if(mode === 'ADD' || mode === 'CHANGE') {
			$scope.clearMessages();
			$scope.mode = mode;
			$scope.showAddForm = true;
			$scope.showTable = false;
		}
		if(mode === 'ADD') {
			$scope.addedDateString = '';
			$scope.caption = '';
			$scope.content = '';
			$scope.contentType = $scope.availableContentTypes[0];
			$scope.fileUploadLabel = 'Choose File';
			$scope.key = -1;
			$scope.modeMessage = 'You are adding a new story';
			$scope.clickContentType();
		}
		if(mode === 'CHANGE') {
			$scope.addedDateString = utilService.convertYYYYMMDDToMMDDYYYY($scope.data[index].addedDate);
			$scope.caption = $scope.data[index].caption;
			$scope.content = $scope.data[index].content;
			$scope.key = $scope.data[index].key;
			$scope.modeMessage = 'You are changing story #' + $scope.key;
			for(var i=0;i<$scope.availableContentTypes.length;i++) {
				if($scope.availableContentTypes[i].value === $scope.data[index].contentType) {
					$scope.contentType = $scope.availableContentTypes[i];
					$scope.clickContentType();
					break;
				}
			}
			if($scope.data[index].fileName) {
				$scope.fileUploadLabel = utilService.getLastToken($scope.data[index].fileName, '/') + ' (click to change)';
			} else {
				$scope.fileUploadLabel = 'Choose File';
			}
		}
		if(mode === 'QUERY') {
			$scope.clearMessages();
			$scope.mode = mode;
			$scope.showAddForm = false;
			$scope.showTable = true;
		}
	}
	
	$scope.uploadFile = function(event){
        var files = event.target.files;
		$scope.fileUploadLabel = 'Choose File'; // default
		if(files && files[0] && files[0].name) {
			$scope.fileUploadLabel = files[0].name + ' (click to change)';
		} else {
			if($scope.mode === 'CHANGE') {
				var fileName = utilService.findInArray($scope.data, 'key', $scope.key, 'fileName');
				if(fileName) {
					$scope.fileUploadLabel = fileName + ' (click to change)';
				}
			}
		}
		$scope.$apply();
    };
	
	//
	
	$scope.setMode('QUERY');
	
})