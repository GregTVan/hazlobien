app.controller('approveInsiderController', function($scope, $http, configuration) {
	$scope.openListener = function() {
		$scope.nextClick();		
	}
	
    $scope.showError = false;
    //
    $scope.entities = '';
    $scope.id = -1;
    $scope.individuals = '';
    $scope.key_count_message = 'Loading Insiders...';
    $scope.persons = '';
    //
    $scope.nextClick = function() {
        $scope.showError = false;
        $http({
            method: 'GET',
            url: 'canchek/rest/unapprovedInsider/' + $scope.id
        }).then($scope.processNextReply);
    }
    $scope.saveClick = function() {
        $scope.showError = false;
        if ($scope.entities) {
            var entities_arr = $scope.entities.split(String.fromCharCode(10));
        }
        if($scope.individuals) {
            var individuals_arr = [];
            var individuals_temp = $scope.individuals.split(String.fromCharCode(10));
            for(var i=0;i<individuals_temp.length;i++) {
				if(individuals_temp[i]) {
					var indiv_names = individuals_temp[i].split(',');
					if(indiv_names.length != 2) {
						$scope.showError = true;
						$scope.error = 'Individual names must be in the format Last Name, FirstName (with exactly one comma)';
						return;
					} else {
						var indiv = {
							firstName: indiv_names[1].trim(),
							lastName: indiv_names[0].trim()
						}
						individuals_arr.push(indiv);
					}
				}
            }
        }
        var updateRequest = {
            entities: entities_arr,
            id: $scope.id,
            individuals: individuals_arr
        }
		var data = JSON.stringify({foo: 'bar'});
        $http({
            data: JSON.stringify(updateRequest),
            method: 'PUT',
            url: 'canchek/rest/unapprovedInsider'
        }).then($scope.processSaveReply);
    }
    $scope.processNextReply = function(reply) {
        if(reply.data) {
            $scope.rawEntityNames = reply.data.rawEntityNames;
            $scope.rawIndividualNames = reply.data.rawIndividualNames;
            $scope.entities = '';
			if(reply.data.entities) {
				for(var i=0;i<reply.data.entities.length;i++) {
					$scope.entities += reply.data.entities[i];
					if(i < reply.data.entities.length -1) {
						$scope.entities += String.fromCharCode(10);
					}
				}
			}
            $scope.individuals = '';
			if(reply.data.individuals) {
				for(var i=0;i<reply.data.individuals.length;i++) {
					// TODO LOOK FOR COMMAS HERE
					// MAYBE LOOK FOR CHR 10's ALSO
					$scope.individuals += reply.data.individuals[i].lastName + ', ' + reply.data.individuals[i].firstName;
					if(i < reply.data.individuals.length -1) {
						$scope.individuals += String.fromCharCode(10);
					}
				}
			}
            // TODO French?
            $scope.id = reply.data.id;
            $scope.key_count_message = 'Key #' + $scope.id + ', there are ' + reply.data.count + ' Insiders waiting to be approved.';
        } else {
            $scope.key_count_message = 'There are no unapproved Insiders';
        }
    }
    $scope.processSaveReply = function(reply) {
        if(reply.data.messages && reply.data.messages.length > 0) {
            $scope.showError = true;
            $scope.error = reply.data.messages[0];
        } else {
            //$scope.nextClick();
        }
    }
});
