// again, change to service
var savedLastName = null;
var savedInputLastName = null;
var savedFirstName = null;
var savedInputFirstName = null;
var savedEntityName = null;
var savedInputEntityName = null;
var savedClientId = null;
var savedInputClientId = null;

app.controller('searchController', function($scope, $http, $state, terroristNames, configuration, fileDownloadService, searchDataTransform) {
	
	$scope.amlDisabled = false;

	$scope.showResolvedItemTracking = configuration.getUser().resolvedItemTracking;	
	
	$scope.messages = [];	

	$scope.isArray = angular.isArray;
	
	$scope.showTable = function(idx) {
		return ($scope.data && $scope.data[$scope.tableDefinitions[idx].dataset] && $scope.data[$scope.tableDefinitions[idx].dataset].length > 0);
	}
	
	$scope.moreButtonMessage = '';

	$scope.showMoreButton = function(idx) {
		var ret = 
			$scope.resultCount &&
			$scope.data[$scope.tableDefinitions[idx].dataset] &&
			($scope.resultCount[idx] > $scope.data[$scope.tableDefinitions[idx].dataset].length);
		if(ret) {
			$scope.moreButtonMessage = $scope.data[$scope.tableDefinitions[idx].dataset].length + ' of ' + $scope.resultCount[idx] + ' ' + $scope.tableDefinitions[idx].titleLong + ' results displayed. Click here to see more.';
		}
		return ret;
	}
	
	$scope.tableDefinitions = searchDataTransform.getTableDefinitions();
	
	if(!configuration.getIsLoggedIn()) {
		// fix old bug, if user gets past Auth0 but is not in user table, we alert them to that here,
		// and prevent them from doing anything else.
		$scope.messages = [];
		$scope.messages.push(configuration.getLoginError());
		$scope.printLabel = false;
		// if not logged in, remove inaccessible stuff from DOM; should be using ng-show
		document.getElementById('input1').setAttribute('style', 'display:none');
		document.getElementById('menu1').setAttribute('style', 'display:none');
		document.getElementById('menu2').setAttribute('style', 'display:none');
		document.getElementById('menu3').setAttribute('style', 'display:none');
		document.getElementById('menu4').setAttribute('style', 'display:none');
		document.getElementById('menu5').setAttribute('style', 'display:none');
		document.getElementById('menu6').setAttribute('style', 'display:none');
		return;
	}
    // template uses this to resolve PDF path
    $scope.language = configuration.getLanguage();

    $scope.translateDataset = function(dataset) {
        if(dataset === 'WATCH_LIST') {
            return 'watchListResult';
        } else if(dataset === 'CEASE_TRADE_ORDERS') {
            return 'ceaseTradeOrderResult';
        } else if(dataset === 'DISCIPLINED_LIST') {
            return 'disciplinedListResult';
        } else if(dataset === 'DOMESTIC_PEPS') {
            return 'domesticPepResult';
        } else if(dataset === 'EU') {
            return 'euResult';
        } else if(dataset === 'GLOBAL_PEPS') {
            return 'globalPepResult';
        } else if(dataset === 'INSIDERS') {
            return 'insiderResult';
        } else if(dataset === 'NEGATIVE_NEWS') {
            return 'negativeNewsResult';
        } else if(dataset === 'NRD') {
            return 'nrdResult';
        } else if(dataset === 'OFAC') {
            return 'ofacResult';
        } else if(dataset === 'ADVERSE_MEDIA') {
            return 'adverseMediaResult';
        } else if(dataset === 'UK') {
            return 'ukResult';
        } else {
            return '';
        }
    }
    $scope.translateDataset2 = function(dataset) {
        if(dataset === 'watchListResult') {
            return 'WATCH_LIST';
        } else if(dataset === 'ceaseTradeOrderResult') {
            return 'CEASE_TRADE_ORDERS';
        } else if(dataset === 'disciplinedListResult') {
            return 'DISCIPLINED_LIST';
        } else if(dataset === 'domesticPepResult') {
            return 'DOMESTIC_PEPS';
        } else if(dataset === 'euResult') {
            return 'EU';
        } else if(dataset === 'globalPepResult') {
            return 'GLOBAL_PEPS';
        } else if(dataset === 'insiderResult') {
            return 'INSIDERS';
        } else if(dataset === 'negativeNewsResult') {
            return 'NEGATIVE_NEWS';
        } else if(dataset === 'nrdResult') {
            return 'NRD';
        } else if(dataset === 'ofacResult') {
            return 'OFAC';
        } else if(dataset === 'adverseMediaResult') {
            return 'ADVERSE_MEDIA';
        } else if(dataset === 'ukResult') {
            return 'UK';
        } else {
            return '';
        }
    }
    $scope.toggleFalsePositive = function(dataset, index) {
        var myDataSet = $scope.data[dataset][index];
        if(!myDataSet) {
            return;
        }
		dataset = $scope.translateDataset2(dataset);
        $scope.messages = [];
		$scope.printLabel = false;
		var promise;
		var url = 'canchek/rest/resolved_item';
		if(myDataSet.falsePositive) {
			promise = $http({
				url: url + '?client_id=' + $scope.clientId + '&dataset=' + dataset + '&ref=' + myDataSet.ref,
				method: 'DELETE'
			});
		} else {
			var resolvedItem = {
				clientId: $scope.clientId || '',
				dataSet: dataset || '',
				ref: myDataSet.ref || ''
			}
			promise = $http({
				data: resolvedItem,
				method: 'POST',
				url: url
			})
		}
        promise.then($scope.updateFalsePositive);
    }
    $scope.updateFalsePositive = function(response) {
        // they might have navigated to a new search by now so if this fails, don't say anything
        if(response.data.success) {
            if(response.data.dataSet) {
                var dataset = $scope.translateDataset(response.data.dataSet);
                if(!dataset) {
                    return;
                }
                for(var i=0;i<$scope.data[dataset].length;i++) {
                    if(($scope.data[dataset][i].ref == response.data.ref) && ($scope.clientId.toUpperCase() == response.data.clientId.toUpperCase())) {
                        $scope.data[dataset][i].falsePositive = response.data.falsePositive;
                        break;
                    }
                }
            }
        } else {
            if(response.data.messages) {
				$scope.messages = response.data.messages;
            } else {
                $scope.messages = ['Error in updating False Positive'];
                return;
            }
        }
    }
    $scope.searchClick = function() {
        $scope.search();
    }

    $scope.moreClick = function(idx) {
		// TODO deal with '&' in name itself
		// TODO use the real name
		var moreData = $scope.data[$scope.tableDefinitions[idx].dataset];
		if(moreData && moreData.length > 0 && moreData.length < $scope.resultCount[idx]) {
			// TODO this message does NOT work due to digest cycle, $scope.$apply breaks everything. maybe needs a timeout or something. Urgh.
			// call to server works fine though
			$scope.moreButtonMessage = 'Searching...';
			var name = '';
			if($scope.firstName && $scope.lastName) {
				name = 'firstName=' + $scope.firstName + '&lastName=' + $scope.lastName;
			} else {
				name = 'entityName=' + $scope.entityName;
			}
			if(name) {
				$http({
					method: 'GET',
					//url: 'canchek/matches?' + name + '&skip=' + moreData.length + '&clientId=' + $scope.clientId
					url: 'canchek/rest/matches?' + name + '&skip=' + moreData.length + '&clientId=' + $scope.clientId
				}).then($scope.updateMoreData);
			}
		}
    }
	
	$scope.updateMoreData = function(response) {
		var responseCooked = searchDataTransform.transform(response.data);
		if(responseCooked) {
			angular.forEach(responseCooked, function(element, key) {
				if(key == 'resultCount') {
					// not sure wot to do here
				} else {
					angular.forEach(element, function(row) {
						$scope.data[key].push(row);
					});
				};
			});
			$scope.messages = [];
			$scope.updateLabels();
		}
	}
	
    $scope.hideAllTables = function() {
		angular.forEach($scope.data, function(result, key) {
			$scope.data[key] = [];
		});
    }

    $scope.hideAllTables();
	
    $scope.searchInputChange = function() {
        savedInputClientId = $scope.clientId;
        savedInputEntityName = $scope.entityName;
        savedInputFirstName = $scope.firstName;
        savedInputLastName = $scope.lastName;
    }
	
    $scope.searchKeyPress = function($event) {
        if($event.keyCode === 13) {
            $scope.search();
        }
    }
	
    $scope.translations = translations_en;
	
    if(configuration.getLanguage() == 'fr') {
        $scope.translations = translations_fr;
    }
	
    $scope.search = function() {
        $scope.messages = ['Searching...'];
		$scope.printLabel = false;		
        savedClientId = $scope.clientId;
        savedEntityName = $scope.entityName;
        savedFirstName = $scope.firstName;
        savedLastName = $scope.lastName;
        var promise = terroristNames.query($scope.clientId, $scope.entityName, $scope.firstName, $scope.lastName);
        promise.then($scope.updateTable);
    }
	
	$scope.updateLabels = function() {
		// assume only one message and its important enough to not show anything else
		// TODO improve - for ex. for warning that one DB isnt available
		$scope.updateOutputLabel1();
		$scope.updateOutputLabel2();
		$scope.updatePrintLabel();
	}
	
	$scope.updateOutputLabel1 = function() {
		if(!$scope.resultsConfigured()) {
			// TODO this should come from SS
			$scope.messages.push('No searches are configured. You can change this in Administration, Configure Search.');
		} else {
			if($scope.resultCount && $scope.matchesFound()) {
				var searchTerm = $scope.calculateSearchTerm();
				$scope.messages.push('Results for: ' + "'" + searchTerm + "'");
			} else if($scope.messages.length == 0) {
				$scope.messages.push('No matches found');
			}
		}
	}
	
	$scope.updateOutputLabel2 = function() {
		if(!$scope.resultsConfigured()) {
			return;
		}
		var str = '';
		if(!$scope.matchesFound()) {
			// TODO: ghetto, awaiting revamp of SearchDirector to return UserMessage
			// there are 3 different messages
			if($scope.messages && $scope.messages[0].indexOf('Please enter') > 0) {
				return;
			}
			str = 'Searched: ';
		}
		angular.forEach($scope.tableDefinitions, function(tableDefinition, key) {
			if($scope.resultCount[key] < 0) {
					return true; // continue
			}
			str += tableDefinition.title; + ': ';
			if($scope.matchesFound()) {
				str +=  ': ';
				if($scope.resultCount && $scope.resultCount[key] && $scope.data && $scope.data[tableDefinition.dataset] && ($scope.data[tableDefinition.dataset].length < $scope.resultCount[key])) {
					str += $scope.data[tableDefinition.dataset].length;
					str += '/' + $scope.resultCount[key];
				} else {
					if($scope.data && $scope.data[tableDefinition.dataset]) {
						str += $scope.resultCount[key];
					} else {
						str += '0';
					}
				}
			}
			str += ', ';
		});
		$scope.messages.push(str.substring(0, str.length - 2));
	}
	
	$scope.updatePrintLabel = function() {
		// show label even if empty result
		// wot about if error?
		$scope.printLabel = $scope.resultCount && $scope.resultsConfigured();
	}
	
	$scope.loadServerMessages = function(messages) {
		$scope.messages = [];
		angular.forEach(messages, function(message) {
			$scope.messages.push('<div style="color:red">' + message + '</div>');
		});
	}
    $scope.updateTable = function(response){
		
		$scope.insiderDataRaw = response.data.insiderResult; // HACK!
		$scope.data = searchDataTransform.transform(response.data);
		$scope.resultCount = response.data.resultCount;
		$scope.loadServerMessages(response.data.messages);
		$scope.updateLabels();

		// in case they changed their setting in Admin. Sucks a bit though because change isn't visible until the next
		// refresh, which actually should always happen but doesn't if data is empty. So there's that.
        $scope.showResolvedItemTracking = response.data.falsePositive;
		
		if(response.data.forceLogoff) {
			localStorage.removeItem('id_token');
			// TODO make this shared with app.js
			var questionMark = window.location.href.indexOf('?');
			if(questionMark) {
				window.location.href = window.location.href.substr(0, questionMark);
			}
			return;
		}

	}
	
    $scope.calculateSearchTerm = function() {
        var searchTerm;
        if($scope.entityName) {
            searchTerm = $scope.entityName;
        } else {
            searchTerm = $scope.lastName;
            if($scope.firstName) {
                if(searchTerm) {
                    searchTerm += ', ';
                }
                searchTerm += $scope.firstName;
            }
        }
        return searchTerm;
    }
    $scope.makeOutputLabel = function(data, label) {
        if(data) {
            if($scope.dataFound) {
                $scope.outputLabelLine2 += ', ';
            }
            $scope.dataFound = true;
            $scope.outputLabelLine2 += label + ' ';
            $scope.outputLabelLine2 += data.length;
        }
    }
	
    $scope.printClick = function(format) {
        var wlr = angular.copy($scope.data.watchListResult);
        if(wlr) {
            for(var i=0; i<wlr.length; i++) {
                for(var j=0;j<wlr[i].regulations.length; j++) {
                    wlr[i].regulations[j] = wlr[i].regulations[j].split('@')[0];
                }
            }
        }
        var structemp = angular.copy($scope.data);
		structemp.searchTerm = $scope.calculateSearchTerm();
		structemp.watchListResult = wlr;
		structemp.insiderResult = $scope.insiderDataRaw; 
		var data = {
			format: format,
			matchResult: JSON.stringify(structemp)
		}
		var request = {
			data: data,
			method: 'POST',
			url: 'canchek/rest/report/search'
		}
        $http(request).then($scope.getOutputFile);
    }

	$scope.getOutputFile = function(reply) {
		for(var i=0;i<reply.data.files.length;i++) {
			fileDownloadService.getFile(reply.data.jobKey, reply.data.files[i]);
		}
	};	
	
    $scope.printLabel = false;

    // restore previously input values but don't actually refresh!
    if(savedEntityName) {
        $scope.entityName = savedEntityName;
    } else {
        if(savedFirstName) {
            $scope.firstName = savedFirstName;
        }
        if(savedLastName) {
            $scope.lastName = savedLastName;
        }
    }

    $scope.getInsiderDetails = function(item) {
        var sediId = item.currentTarget.getAttribute('sediId');
        $state.go('insiderDetail/:sediId',{sediId: sediId});
    }
    $scope.resetClick = function() {
        // table headers
        $scope.hideAllTables();
        // input fields
        $scope.entityName = '';
        $scope.firstName = '';
        $scope.lastName = '';
        // other stuff
        $scope.clientId = '';
		$scope.messages = [];
        $scope.printLabel = false;
    }
	
	// MAYBE MOVE TO DATA SERVICE
	$scope.matchesFound = function() {
		var ret = false;
		angular.forEach($scope.data, function(result) {
	        if(result && result.length > 0) {
				ret = true;
				return false; // break out of loop
			}
		});
		return ret;
	}
	 
	// wtf
    $scope.resultsConfigured = function() {
		var ret = false;
		if($scope.resultCount) {
			angular.forEach($scope.resultCount, function(ct) {
				// -1 means search was not configured
				if(ct != -1) {
					ret = true;
					return false; // break loop
				}
			});
		} else {
			// well, who knows. an error.
			ret = true;
		}
		return ret;
	}

	$scope.getIsAvailable = function() {
		var fd = new FormData();
		fd.append('action', 'getUserConfiguration');
		var promise = $http({
			url: configuration.getServletUrl(),
			data: fd,
			processData: false,
			contentType: false,
			method: 'POST',
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		});
		promise.then($scope.processIsAvailableResponse);
	}

	$scope.processIsAvailableResponse = function(response) {
		if(response.data && response.data.user && response.data.user.aml) {
			// nop
		} else {
			$scope.amlDisabled = true;
			$scope.messages[0] = 'You are not subscribed to Canchek AML. Please contact customersupport@canchek.com for assistance.';
		}
	}

	$scope.getIsAvailable();

});
