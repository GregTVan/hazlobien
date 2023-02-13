app.controller('manageUsersTableController', function(manageUsersService, $http, $rootScope, $scope) {

	$scope.uiDisabled = true;
	$scope.showRow = [];

	//

	$scope.addClick = function() {
		$scope.showRow = [];
		manageUsersService.clearMessages();
		manageUsersService.setShow('add');
		$rootScope.$broadcast('show');
	}

	$scope.changeFirm = function() {
		$scope.showRow = [];
		manageUsersService.clearMessages();
		manageUsersService.clearData();
		manageUsersService.setFirm($scope.firm);
		$scope.load();
	}

	$scope.rowClick = function(idx, action) {
		if(action === 'log') {
			$scope.showRow[idx] = !$scope.showRow[idx];
			if($scope.showRow[idx]) {
				$scope.getActivity(idx);
			}
		} else {
			$scope.showRow = [];
			manageUsersService.clearMessages();
			manageUsersService.setShow(action);
			manageUsersService.setActiveRecord(idx);
			$rootScope.$broadcast('show');
		}
	}

	// should be in service???


    $scope.getActivity = function(index) {
		var key = $scope.data[index].userId;
		// omg, so hackticious!
		$scope.activityWip = index;
		if(key) {
			$http({
				contentType: false,
				headers: {'Content-Type': undefined},
				method: 'GET',
				processData: false,
				transformRequest: angular.identity,
				url: 'canchek/rest/user_activity/' + key
			}).then($scope.updateActivityTable);
		}
    }

	$scope.updateActivityTable = function(response) {
		if(response.data.length > 0) {
			outer:
			for(var i=0;i<response.data.length;i++) {
				for(var j=0;j<$scope.data.length;j++) {
					if(response.data[i].userIdAffected === $scope.data[j].userId) {
						$scope.data[j].activity = response.data;
						continue outer;
					}
				}
			}
		} else {
			// default in case of empty reply
			$scope.data[$scope.activityWip].activity = [{formattedActivity: 'No records found.'}];
		}
	}		

	$scope.refreshActivityClick = function(index) {
		$scope.getActivity(index);
	}

	$scope.refreshClick = function() {
		$scope.showRow = [];
		manageUsersService.clearMessages();
		manageUsersService.clearData();
		$scope.load();
	}

	//

	$scope.load = function() {
		$scope.messages = manageUsersService.getMessages();
		var loadingMessage = 'Loading...';
		if(typeof $scope.user === 'undefined') {
			manageUsersService.setInfoMessage(loadingMessage);
		}
		manageUsersService.loadData().then(function(reply) {
			$scope.data = reply.data;
			$scope.firms = reply.values.firms;
			$scope.messages = reply.messages;
			$scope.user = reply.user;
			// generate default when first arriving
			$scope.uiDisabled = false;
			if(typeof $scope.firm === 'undefined') {
				if($scope.data && $scope.data.length > 0) {
					$scope.firm = $scope.data[0].firm;
					manageUsersService.setFirm($scope.firm);
				} else {
					$scope.firm = $scope.firms[0];
				}
			}
			if($scope.messages.length == 1 && $scope.messages[0].message === loadingMessage) {
				manageUsersService.clearMessages();
			}
		});
	};

	$scope.$on('show', function (event, arg) { 
		if(manageUsersService.getShow() === 'table') {
			$scope.load();
		}
	});

});