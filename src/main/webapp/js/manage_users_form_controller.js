app.controller('manageUsersFormController', function(manageUsersService, $http, $rootScope, $scope) {

	$scope.changeFirm = function(firm) {
		for(var i=0;i<$scope.activeRecord.dataSets.length;i++) {
			var dataSet = $scope.activeRecord.dataSets[i];
			// TODO how to unhardcodeify these
			if(dataSet.dataSetInfo.code === 'adverseMedia') {
				dataSet.isAvailableToUser = firm.adverseMediaLimit > 0;
			} else if(dataSet.dataSetInfo.code === 'foreignPoliticalPersons') {
				dataSet.isAvailableToUser = firm.foreignPoliticalPersons;
			} else {
				dataSet.isAvailableToUser = true;
			}
		}
		$http.get('canchek/rest/firm/defaults/' + firm.firm).then($scope.populateDefaults);
	}

	$scope.populateDefaults = function(response) {
		// reset
		for(var i=0;i<$scope.activeRecord.dataSets.length;i++) {
			$scope.activeRecord.dataSets[i].isSelectedByUser = false;
		}
		if(response && response.data) {
			for(i=0;i<response.data.length;i++) {
				for(var j=0;j<$scope.activeRecord.dataSets.length;j++) {
					if(response.data[i] == $scope.activeRecord.dataSets[j].dataSetInfo.code) {
						$scope.activeRecord.dataSets[j].isSelectedByUser = true;
					}
				}
			}
		}
	}

	$scope.saveClick = function() {
		if($scope.mode === 'delete') {
			manageUsersService.deleteActiveRecord();
		} else {
			manageUsersService.saveActiveRecord();
		}
	}

	$scope.cancelClick = function() {
		// clear on cancel but not on success
		manageUsersService.clearMessages();
		// to revert any unsaved changes
		manageUsersService.clearData();
		$scope.closeForm();
	}

	$scope.$on('show', function (event, arg) { 
		// get reference once at startup vs. getShow ???
		$scope.mode = manageUsersService.getShow();
		if($scope.mode !== 'table') {
			manageUsersService.loadData().then($scope.processReply);
			switch($scope.mode) {
				case 'add':
					$scope.buttonMessage = 'Add';
					break;
				case 'change':
					$scope.buttonMessage = 'Save';
					break;
				case 'delete':
					$scope.buttonMessage = 'Delete';
					manageUsersService.setInfoMessage("Please click 'Delete' below to confirm deletion.");
					break;
			}
		}
	});

	$scope.processReply = function(reply) {
		$scope.messages = reply.messages;
		$scope.activeRecord = reply.activeRecord;
		$scope.user = reply.user;
		$scope.values = reply.values;
		// set initial values
		$scope.changeFirm($scope.activeRecord.firm);
	}

	$scope.mode = manageUsersService.getShow();
	
	$scope.closeForm = function() {
		manageUsersService.setShow('table');
		$rootScope.$broadcast('show');
	}

});