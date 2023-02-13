app.controller('approveCTOController', function($scope, $http, configuration) {
	
	$scope.openListener = function() {
		$scope.nextClick();		
	}
	
    $scope.showError = false;
    //
    $scope.entities = '';
    $scope.id = -1;
    $scope.individuals = '';
    $scope.key_count_message = 'Loading CTOs...';
    $scope.persons = '';
    //
    $scope.nextClick = function() {
        $scope.showError = false;
        var fd = new FormData();
        fd.append('action', 'getNextUnapprovedCTO');
        fd.append('lastId', $scope.id);
        fd.append('sort', $scope.sort || 1); // default to 1 on first iteration
        var promise = $http({
            url: configuration.getServletUrl(),
            data: fd,
            processData: false,
            contentType: false,
            method: 'POST',
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        // what if failure? OR success but output URL is malformed, OR parameters were effed
        promise.then($scope.processNextReply);
    }
    $scope.saveClick = function() {
        $scope.showError = false;
        if($scope.entities) {
            var entities_arr = $scope.entities.split(String.fromCharCode(10));
        }
        if($scope.individuals) {
            var individuals_arr = [];
            var individuals_temp = $scope.individuals.split(String.fromCharCode(10));
            for(var i=0;i<individuals_temp.length;i++) {
                var indiv_names = individuals_temp[i].split(',');
                var indiv = {
                    firstName: indiv_names[1],
                    lastName: indiv_names[0]
                }
                individuals_arr.push(indiv);
            }
        }
        var fd = new FormData();
        var updateCTORequest = {
            entities: entities_arr,
            id: $scope.id,
            individuals: individuals_arr,
            issuerName: $scope.issuerName,
            remarks: $scope.remarks
        }
        fd.append('action', 'approveCTO');
        // TODO: this, more
        fd.append('approveCTO', JSON.stringify(updateCTORequest));
        var promise = $http({
            url: configuration.getServletUrl(),
            data: fd,
            processData: false,
            contentType: false,
            method: 'POST',
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        // what if failure? OR success but output URL is malformed, OR parameters were effed
        promise.then($scope.processSaveReply);
    }
    $scope.processNextReply = function(reply) {
        if(reply.data.unapprovedCTO && (typeof reply.data.unapprovedCTO.persons !=  'undefined')) {
            $scope.persons = reply.data.unapprovedCTO.persons;
            $scope.entities = '';
            for(var i=0;i<reply.data.unapprovedCTO.entities.length;i++) {
                $scope.entities += reply.data.unapprovedCTO.entities[i];
                if(i < reply.data.unapprovedCTO.entities.length -1) {
                    $scope.entities += String.fromCharCode(10);
                }
            }
            $scope.individuals = '';
            for(var i=0;i<reply.data.unapprovedCTO.individuals.length;i++) {
                // TODO LOOK FOR COMMAS HERE
                // MAYBE LOOK FOR CHR 10's ALSO
                $scope.individuals += reply.data.unapprovedCTO.individuals[i].lastName + ', ' + reply.data.unapprovedCTO.individuals[i].firstName;
                if(i < reply.data.unapprovedCTO.individuals.length -1) {
                    $scope.individuals += String.fromCharCode(10);
                }
            }
            // TODO French?
            $scope.id = reply.data.unapprovedCTO.id;
            $scope.sort = reply.data.unapprovedCTO.sort;
            $scope.key_count_message = 'Key #' +  $scope.sort + "-" + $scope.id + ', there are ' + reply.data.unapprovedCTO.count + ' CTO\'s waiting to be approved.';
            $scope.remarks = reply.data.unapprovedCTO.remarks;
            $scope.issuerName = reply.data.unapprovedCTO.issuerName;
            // TODO next button
        } else {
            // TODO FR
            $scope.key_count_message = 'Error loading unapproved CTOs';
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
