app.controller('signUpController', function($scope, $location, $translate, $http, $rootScope, configuration) {

    $scope.amlPlanType = 'FREE';
    $scope.amlFee = 0;
    $scope.eidPlanType = 'FREE';
    $scope.eidFee = 0;
    $scope.showPayment = false;
    $scope.showYourInformation = true;
    
    // use to identify logged in user
    if(configuration.getIsLoggedIn()) {
		// if user refreshes (eg. F5) instead of doing a proper login, _sometimes_ the 
		// previous function returns FALSE and we show fields that we shouldn't. Is this
		// a timing problem?
        $scope.showYourInformation = false;
        $scope.showPayment = true;
    }
    
	$scope.uiChange = function() {
		$scope.error = [];
	}

    $scope.changeAmlPlanType = function() {
		$scope.error = [];
        for(var i=0;i<$scope.amlPlanList.length;i++) {
            var amlPlan = $scope.amlPlanList[i];
            if(amlPlan.planType === $scope.amlPlanType) {
                $scope.amlFee = amlPlan.fee;
                $scope.fee = $scope.amlFee + $scope.eidFee;
                $scope.showPayment = $scope.fee > 0;
                $scope.amlPlanDescriptionLong = amlPlan.descriptionLong;
                break;
            }
        }
    }
    
    $scope.changeEidPlanType = function() {
		$scope.error = [];
        for(var i=0;i<$scope.eidPlanList.length;i++) {
            var eidPlan = $scope.eidPlanList[i];
            if(eidPlan.planType === $scope.eidPlanType) {
                $scope.eidFee = eidPlan.fee;
                $scope.fee = $scope.amlFee + $scope.eidFee;
                $scope.showPayment = $scope.fee > 0;
                $scope.eidPlanDescriptionLong = eidPlan.descriptionLong;
                break;
            }
        }
    }

    $scope.signUpClick = function() {
        $scope.error = {
			message: 'Please wait while we setup your account...'
		}
		$scope.sendToServer();
    }
    
    $scope.sendToServer = function() {
        var request = {
			email: $scope.user_email || '',
			firmName: $scope.firm_name,
			firstName: $scope.firstName || '',
			lastName: $scope.lastName || '',
			amlPlanType: $scope.amlPlanType || '',
            eidPlanType: $scope.eidPlanType || '',
			title: $scope.title || ''
		}
        $http({
			data: request,
            method: 'POST',
			url: 'canchek/rest/signup'
        }).then(function(response) {
			// TODO handle multiple errors
			$scope.error = response.data[0];
			if($scope.error) {
				$scope.showError = true;
			}
		}, function(response) {
			// TODO: should be defining error on all $http calls?
			$scope.error = {
				message: response.data.messages[0]
			}
			if($scope.error.message) {
				$scope.showError = true;
			}
		})
    }
    
    $scope.getSignUpConfiguration = function() {
        $scope.translations = translations_en;
        $http({
            method: 'GET',
            url: 'canchek/rest/plans'
        }).then(function(response) {
            $scope.amlPlanList = response.data.amlPlanList;
            $scope.amlPlanType = $scope.amlPlanList[configuration.getIsLoggedIn() ? 1 : 0].planType;
            $scope.eidPlanList = response.data.eidPlanList;
            $scope.eidPlanType = $scope.eidPlanList[configuration.getIsLoggedIn() ? 1 : 0].planType;
            $scope.changeAmlPlanType();
            $scope.changeEidPlanType();
        });
    }
    
    $scope.getSignUpConfiguration();
   
});
