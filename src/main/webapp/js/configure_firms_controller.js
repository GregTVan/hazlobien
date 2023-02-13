app.controller('configureFirmsController', function($scope, $http, configuration) {
	
	$scope.openListener = function() {
		$scope.getInitialData();
	}
	
    $scope.translations = translations_en;
    if(configuration.getLanguage() == 'fr') {
        $scope.translations = translations_fr;
    }
    
    $scope.showTable = true;

    // duped from batchsearch
    $scope.displayFeedback = function(reply) {
        $scope.error = '';        
        if(reply.data.messages && reply.data.messages.length > 0) {
            // TODO: first only?
            $scope.error = reply.data.messages[0];
        }
        if(reply.data.success) {
            $scope.showAddFirmForm = false;
            $scope.showTable = true;
            $scope.getInitialData();
        }        
    }
    
    $scope.refreshClick = function() {
        $scope.error = '';        
        $scope.getInitialData();
    }
    
    $scope.addNewFirmClick = function() {
		$scope.eid = $scope.availableEidOptions[1]; // NO
        $scope.foreignPoliticalPersons = $scope.availableYesNoOptions[1]; // NO
        $scope.logQueryNames = $scope.availableYesNoOptions[1]; // NO
		$scope.resolvedItemTracking = $scope.availableYesNoOptions[1]; // NO
        $scope.planType = $scope.availablePlanTypes[0];
        $scope.showAddFirmForm = true;
        $scope.showTable = false;
    }

    $scope.formCancelClick = function() {
		$scope.error = '';
        $scope.showTable = true;
    }
		
    $scope.getInitialData = function() {
        var promise = $http({
            method: 'GET',
            url: 'canchek/rest/firm?filter=' + $scope.filterOn.value
        });
        promise.then($scope.updateInitialData);
    };

	$scope.translateToSelect = function(record, available, value) {
		for(var i=0;i<$scope[available].length;i++) {
			if($scope[available][i].value === record[value]) {
				//$scope.formData[value] = $scope[available][i];
				record[value] = $scope[available][i];
				return;
			}
		}
	}
    
    $scope.updateInitialData = function(reply) {
        $scope.data = reply.data;
        for(var i=0;i<$scope.data.length;i++) {
			$scope.translateToSelect($scope.data[i], 'availableYesNoOptions', 'active');
			$scope.translateToSelect($scope.data[i], 'availableAmlPlanTypes', 'amlPlanType');
			$scope.translateToSelect($scope.data[i], 'availableEidPlanTypes', 'eidPlanType');
			$scope.translateToSelect($scope.data[i], 'availableYesNoOptions', 'resolvedItemTracking');
			$scope.translateToSelect($scope.data[i], 'availableYesNoOptions', 'foreignPoliticalPersons');
			$scope.translateToSelect($scope.data[i], 'availableYesNoOptions', 'logQueryNames');
        }
    };
   
    // TODO from server, French
    $scope.availableAmlPlanTypes = [{
            name: 'None',
            value: 'NONE'
        },{
            name: $scope.translations.APP.PLANS.FREE,
            value: 'FREE'
        },{
            name: $scope.translations.APP.PLANS.BASIC,
            value: 'BASIC'
        },{
            name: $scope.translations.APP.PLANS.ENHANCED,
            value: 'ENHANCED'
        },{
            name: 'Enterprise',
            value: 'ENTERPRISE'
        }
    ];
	
    $scope.availableEidPlanTypes = [{
            name: 'None',
            value: 'NONE'
        },{
            name: $scope.translations.APP.PLANS.FREE,
            value: 'FREE'
        },{
            name: $scope.translations.APP.PLANS.BASIC,
            value: 'BASIC'
        }
    ];

    // TODO from server, French
    $scope.availableYesNoOptions = [{
            name: $scope.translations.APP.GENERAL.YES,
            value: true
        },{
            name: $scope.translations.APP.GENERAL.NO,
            value: false
        }
    ];

    $scope.availableEidPlanTypes = [{
            name: 'None',
            value: 'NONE'
        },{
            name: 'Free',
            value: 'FREE'
        },{
            name: 'Basic',
            value: 'BASIC'
        }
    ];
	
	$scope.changeClick = function(idx) {
		$scope.formData = $scope.data[idx];
		$scope.formMode = 'CHANGE';
        $scope.showTable = false;
	}
	
	$scope.processChangeReply = function(reply) {
	}

    $scope.planType = [];
    $scope.adverseMediaLimit = [];
    $scope.adverseMediaUsed = [];
	$scope.eid = [];
    $scope.foreignPoliticalPersons = [];
    $scope.active = [];
    $scope.logQueryNames = [];
    $scope.resolvedItemTracking = [];
    
    $scope.availableFilters = [{
            name: $scope.translations.APP.GENERAL.ACTIVE_ONLY,
            value: 'ACTIVE'
        },{
            name: $scope.translations.APP.GENERAL.INACTIVE_ONLY,
            value: 'INACTIVE'
        }
    ];
    
    $scope.filterOn = $scope.availableFilters[0];

    $scope.appendFormData = function(key, i, fd) {
        fd.append(key, $scope[key][i]);
    }

    $scope.appendFormDataValue = function(key, i, fd) {
        fd.append(key, $scope[key][i].value);
    }
    
	$scope.formSaveClick = function() {
		$scope.error = '';
		var data = angular.copy($scope.formData);
		if(data) {
			$scope.checkDate(data.agreementDate, 'Agreement Date');
			$scope.checkDate(data.amlStartDate, 'AML Start Date');
			$scope.checkDate(data.eidStartDate, 'Canchek-eID Start Date');
			if($scope.error) {
				return;
			}
			$scope.checkInt(data.adverseMediaLimit, 'Adverse Media Limit');
			$scope.checkInt(data.adverseMediaUsed, 'Adverse Media Used');
			data.agreementDate = new Date(data.agreementDate);
			data.amlStartDate = new Date(data.amlStartDate);
			data.eidStartDate = new Date(data.eidStartDate);
			$scope.translateFromSelect(data, 'active');
			$scope.translateFromSelect(data, 'amlPlanType');
			$scope.translateFromSelect(data, 'eidPlanType');
			$scope.translateFromSelect(data, 'foreignPoliticalPersons');
			$scope.translateFromSelect(data, 'logQueryNames');
			$scope.translateFromSelect(data, 'resolvedItemTracking');
			var promise = $http({
				data: data,
				method: $scope.formMode == 'ADD' ? 'POST' : 'PUT',
				url: 'canchek/rest/firm'
			});
			promise.then($scope.processSaveReply);
		} else {
			$scope.error = 'Please complete all fields';
		}
	}
	
	$scope.checkDate = function(value, tag) {
		if(value) {
			var junk = new Date(value);
			// wtf, only double == works here, not triple
			if((!junk) || junk == 'Invalid Date') {
				$scope.error = tag + ' is not a valid date';
			}
		}
	}

	$scope.checkInt = function(value, tag) {
		if(isNaN(value)) {
			$scope.error = tag + ' is not a valid number';
		}
	}

	$scope.translateFromSelect = function(data, value) {
		if(data && data[value]) {
			data[value] = data[value].value;
		}
	}
	
	$scope.processSaveReply = function(reply) {
		if(reply.data && reply.data.length > 0) {
			$scope.error = reply.data[0];
		} else {
			$scope.getInitialData();
			$scope.showTable = true;
		}
	}
	
	$scope.addClick = function() {
		$scope.formData = {
			active: $scope.availableYesNoOptions[0],
			adverseMediaLimit: 0,
			adverseMediaUsed: 0,
			amlPlanType: $scope.availableAmlPlanTypes[0],
			eidPlanType: $scope.availableEidPlanTypes[0],
			foreignPoliticalPersons: $scope.availableYesNoOptions[1],
			logQueryNames: $scope.availableYesNoOptions[1],
			resolvedItemTracking: $scope.availableYesNoOptions[1]
		}
		$scope.formMode = 'ADD';
        $scope.showTable = false;
	}
    
});