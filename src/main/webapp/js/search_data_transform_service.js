app.service('searchDataTransform', function($sce, configuration) {
	
	this.getTableDefinitions = function() {
		return [{
			columns: [{
				key: 'name',
				label: 'Sanctions List Name'
			},{
				key: 'dateAndPlaceOfBirth',
				label: 'Date of Birth/Location'
			},{
				key: 'aliasesText',
				label: 'Aliases'
			},{
				key: 'regulationsText',
				label: 'Regulations'
			},{
				key: 'obligations',
				label: 'Obligations'
			}],
			dataset: 'watchListResult',
			title: 'Canadian Sanctions'
		}, {
			columns: [{
				key: 'companyName',
				label: 'CTO Company Name'
			},{
				key: 'issuingJurisdictionsText',
				label: 'Issued By'
			},{
				key: 'effectiveJurisdictionsText',
				label: 'Effective In'
			},{
				key: 'type',
				label: 'CTO Type'
			},{
				key: 'persons',
				label: 'Related Individuals'
			},{
				key: 'issuedDate',
				label: 'Issued Date'
			},{
				key: 'expiryDate',
				label: 'Expiry Date'
			}],
			dataset: 'ceaseTradeOrderResult',
			title: 'CTO'
		},{
			columns: [{
				key: 'name',
				label: 'Insider Name'
			},{
				key: 'municipality',
				label: 'Municipality'
			},{
				key: 'issuers',
				label: 'Issuer Name'
			},{
				key: 'relationship',
				label: 'Relationship'
			},{
				key: 'becameInsider',
				label: 'Became Insider'
			},{
				key: 'openingDate',
				label: 'Opening Date'
			},{
				key: 'ceasedBeingInsider',
				label: 'Ceased Being'
			}],
			dataset: 'insiderResult',
			title: 'Insider'
		},{
			columns: [{
				key: 'name',
				label: 'Domestic PEP Name'
			},{
				key: 'dateOfBirth',
				label: 'Date of Birth'
			},{
				key: 'jurisdiction',
				label: 'Jurisdiction'
			},{
				key: 'role',
				label: 'Role'
			},{
				key: 'endDate',
				label: 'End Date'
			},{
				key: 'photoUrlText',
				label: 'Photo'
			}],
			dataset: 'domesticPepResult',
			title: 'Domestic PEP'
		},{
			columns: [{
				key: 'name',
				label: 'Global PEP/HIO'
			},{
				key: 'birthDate',
				label: 'Birth Date'
			},{
				key: 'text',
				label: 'Remarks'
			}],
			dataset: 'globalPepResult',
			title: 'Global PEP'
		},{
			columns: [{
				key: 'name',
				label: 'OFAC Name'
			},{
				key: 'dateOfBirth',
				label: 'Date of Birth'
			},{			
				key: 'placeOfBirth',
				label: 'Place Birth'
			},{			
				key: 'aliases',
				label: 'Aliases'
			},{			
				key: 'programs',
				label: 'Regulations'
			},{			
				key: 'remarks',
				label: 'Remarks'
			}],
			dataset: 'ofacResult',
			title: 'OFAC'
		},{
			columns: [{
				key: 'name',
				label: 'NRD Name'
			},{
				key: 'firm',
				label: 'Firm'
			}],
			dataset: 'nrdResult',
			title: 'NRD'
		},{
			columns: [{
				key: 'title',
				label: 'Adverse Media'
			},{
				key: 'urlText',
				label: 'URL'
			},{
				key: 'text',
				label: 'Text'
			}],
			dataset: 'adverseMediaResult',
			title: 'Media',
			titleLong: 'Adverse Media'
		},{
			columns: [{
				key: 'name',
				label: 'UK Sanctions Name'
			},{
				key: 'dateOfBirth',
				label: 'Date of Birth'
			},{
				key: 'aliasesText',
				label: 'Aliases'
			},{
				key: 'nationality',
				label: 'Nationality'
			},{
				key: 'regime',
				label: 'Regime'
			},{
				key: 'otherInformation',
				label: 'Other Information'
			}],
			dataset: 'ukResult',
			title: 'UK',
			titleLong: 'UK Sanctions'
		},{
			columns: [{
				key: 'name',
				label: 'Disciplined List Name'
			},{
				key: 'aliases',
				label: 'Aliases'
			},{
				key: 'orderDateText',
				label: 'Order Date'
			},{
				key: 'regulatorText',
				label: 'Regulator'
			},{
				key: 'locationText',
				label: 'Location'
			},{
				key: 'violationsText',
				label: 'Violations'
			},{
				key: 'urlText',
				label: 'URL'
			}],
			dataset: 'disciplinedListResult',
			title: 'Disciplined',
			titleLong: 'Disciplined List'
		},{
			columns: [{
				key: 'name',
				label: 'EU Sanctions Name'
			},{
				key: 'aliases',
				label: 'Aliases'
			},{
				key: 'citizenships',
				label: 'Citizenship'
			},{
				key: 'yearText',
				label: 'Birth Year'
			},{
				key: 'cityText',
				label: 'City'
			},{
				key: 'countryText',
				label: 'Country'
			},{
				key: 'publicationUrlText',
				label: 'URL'
			}],
			dataset: 'euResult',
			title: 'EU',
			titleLong: 'EU Sanctions'
		}];
	}

    this.transform = function(data) {
		ret = {};
		if(data) {
			ret.adverseMediaResult = this.transformAdverseMedia(data.adverseMediaResult);
			ret.ceaseTradeOrderResult = this.transformCeaseTradeOrders(data.ceaseTradeOrderResult);
			ret.disciplinedListResult = this.transformDisciplinedList(data.disciplinedListResult);
			ret.domesticPepResult = this.transformDomesticPoliticalPersons(data.domesticPepResult);
			ret.euResult = this.transformEu(data.euResult);
			ret.globalPepResult = this.transformGlobalPoliticalPersons(data.globalPepResult);
			ret.insiderResult = this.transformInsiders(data.insiderResult);
			ret.nrdResult = data.nrdResult;
			ret.ofacResult = this.transformOfficeForeignAssetsControl(data.ofacResult);
			ret.ukResult = this.transformUk(data.ukResult);
			ret.watchListResult = this.transformWatchList(data.watchListResult);
		}
		angular.forEach(ret, function(element, key) {
			if(!element) {
				delete ret[key];
			}
		});
        return ret;
	}
	
	//
	
	this.transformAdverseMedia = function(data) {
		var that = this;
		angular.forEach(data, function(data) {
			if(data && data.url) {
				var urlShort = data.url;
				var i = urlShort.indexOf('//');
				if(i > -1 && urlShort.length > (i + 2)) {
					urlShort = urlShort.substr(i + 2);
					i = urlShort.indexOf('/');
					if(i > -1) {
						urlShort = urlShort.substr(0, i);
					}
				}
				data.urlText = ['<a href="' + data.url + '" target="_blank">' + urlShort + '</a>'];
			}
		});
		return data;
	}
	
	this.transformCeaseTradeOrders = function(data) {
		var that = this;
		angular.forEach(data, function(data) {
			data.effectiveJurisdictionsText = that.concatenate(' ', data.effectiveJurisdictions);
			data.issuingJurisdictionsText = that.concatenate(' ', data.issuingJurisdictions);
			//data.personsText = that.concatenate(' ', data.persons);
		});
		return data;
	}
	
	this.transformDisciplinedList = function(data) {
		// sort orders into individual arrays for display, and, add blanks as needed to maintain alignment
		var that = this;
		var keys = ['orderDate','location','regulator','url','violations'];
		angular.forEach(data, function(data) {
			angular.forEach(keys, function(key) {
				data[key + 'Text'] = [];
			});
			if(data) {
				angular.forEach(data.orderInfo, function(orderInfo) {
					angular.forEach(keys, function(key) {
						var dataKey = key + 'Text';
						if(key === 'url') {
							if(orderInfo.documentLink || orderInfo.searchLink) {
								var link = $sce.trustAsHtml('<a href="' + (orderInfo.documentLink || orderInfo.searchLink) + '" style="width:100px" target="_blank">Click Here</a>');
								data[dataKey].push(link);
							} else {
								// must be &nbsp to cause stacked DIV inside TD to space properly
								data[dataKey].push('&nbsp');
							}
						} else {
							if(orderInfo[key]) {
								data[dataKey].push(orderInfo[key]);
							} else {
								data[dataKey].push('&nbsp');
							}
						}
					});
				});
			}
		});
		return data;
	}

	this.transformDomesticPoliticalPersons = function(data) {
		var that = this;
		angular.forEach(data, function(data) {
			if(data) {
				//
				data.name = that.concatenate(', ', data.lastName, data.firstName);
				//
				// this has to be a one-element array to work nicely with ng-repeat
				data.photoUrlText = [];
				switch(that.guessFieldType(data.photoUrl)) {
					case 'IMAGE':
						// without SCE, the STYLE attribute gets stripped out by ngJs
						data.photoUrlText.push($sce.trustAsHtml('<img alt="Not Available!" src="' + data.photoUrl + '" style="width:100px"/>'));
						break;
					case 'LINK':
						data.photoUrlText.push($sce.trustAsHtml('<a href="' + data.photoUrl + '" style="width:100px" target="_blank">Click Here</a>'));
						break;
				};
			}
		});
		return data;
	}
	this.transformEu = function(data) {
		var keys = ['year','country','city'];
		angular.forEach(data, function(data) {
			angular.forEach(keys, function(key) {
				data[key + 'Text'] = [];
			});
			if(data) {
				if(data.publicationUrl) {
					data.publicationUrlText = $sce.trustAsHtml('<a href="' + (data.publicationUrl) + '" style="width:100px" target="_blank">Click Here</a>');
				}
				angular.forEach(data.birthInfo, function(birthInfo) {
					angular.forEach(keys, function(key) {
						var dataKey = key + 'Text';
						if(birthInfo[key]) {
							data[dataKey].push(birthInfo[key]);
						} else {
							data[dataKey].push('&nbsp');
						}
					});
				});
			}
		});
		return data;
	}

	this.transformGlobalPoliticalPersons = function(data) {
		var that = this;
		angular.forEach(data, function(data) {
			if(data) {
				data.name = that.concatenate(', ', data.lastName, data.firstName);
			}
		});
		return data;
	}

	this.transformInsiders = function(data) {
		var that = this;
		var ret = [];
		angular.forEach(data, function(insider) {
			if(insider && insider.resultIssuers) {
				angular.forEach(insider.resultIssuers, function(issuer, idx) {
					var insiderIssuer = {};
					if(idx == 0) {
						insiderIssuer.clientId = insider.clientId;
						insiderIssuer.falsePositive = insider.falsePositive;
						insiderIssuer.municipality = insider.municipality;
						insiderIssuer.name = insider.name;
						insiderIssuer.ref = insider.ref;
					} else {
						// needs to be HIDE rather than SHOW so we don't have to specify SHOW for all the 
						// other datasets. There must be a better way ;)
						insiderIssuer.hideFalsePositive = true;
					}
					insiderIssuer.becameInsider = issuer.becameInsider;
					insiderIssuer.ceasedBeingInsider = issuer.ceasedBeingInsider;
					insiderIssuer.issuers = issuer.issuerName;
					insiderIssuer.openingDate = issuer.openingDate;
					insiderIssuer.relationship = issuer.relationship;
					ret.push(insiderIssuer);
				});
			}
		});
		// don't return empty array
		if(ret.length > 0) {
			return ret;
		}
	}

	this.transformOfficeForeignAssetsControl = function(data) {
		var that = this;
		angular.forEach(data, function(data) {
			if(data) {
				//data.name = that.concatenate(', ', data.lastName, data.firstName);
			}
		});
		return data;
	}

	this.transformWatchList = function(data) {
		var that = this;
		var language = configuration.getLanguage();
		angular.forEach(data, function(data) {
			if(data) {
				//
				// must happen before alias transform
				data.dateAndPlaceOfBirth = that.concatenate(', ', data.dateOfBirth, data.placeOfBirth);
				//
				data.aliasesText = [];
				angular.forEach(data.aliases, function(alias, iteration) {
					if(alias.name) {
						var aliasText = alias.name;
						var aliasDateAndPlaceOfBirth = that.concatenate(', ', alias.dateOfBirth, alias.placeOfBirth);
						if(aliasDateAndPlaceOfBirth != data.dateAndPlaceOfBirth) {
							aliasText += ' (' + aliasDateAndPlaceOfBirth + ')';
                        }
						data.aliasesText.push(aliasText);
                    }
				});
				//
				data.regulationsText = [];
				angular.forEach(data.regulations, function(regulation) {
					data.regulationsText.push('<a href="regulations/' + language + '/' + regulation + '" target="_blank">' + regulation.split('@')[0] + '</a>');
				});
			}
		});
		return data;
	}
	
	this.transformUk = function(data) {
		var that = this;
		var language = configuration.getLanguage();
		angular.forEach(data, function(data) {
			if(data) {
				data.aliasesText = [];
				angular.forEach(data.aliases, function(alias, iteration) {
					if(alias) {
						data.aliasesText.push(alias);
                    }
				});
			}
		});
		return data;
	}
	
	//

	this.concatenate = function() {
		var ret = '';
		if(arguments && arguments.length > 1) {
			var delimiter = arguments[0];
			if(angular.isArray(arguments[1])) {
				angular.forEach(arguments[1], function(argument, idx) {
					if(argument) {
						if(ret) {
							ret += delimiter;
						}
						ret += argument;
					}
				});
			} else {
				angular.forEach(arguments, function(argument, idx) {
					if(idx > 0) {
						if(argument) {
							if(ret) {
								ret += delimiter;
							}
							ret += argument;
						}
					}
				});
			}
		}
		return ret;
	}
	
	this.guessFieldType = function(url) {
		var ret = 'TEXT';
		if(url) {
			var idx = url.lastIndexOf('?'), suffix;
			if(idx != -1) {
				suffix = url.substring(0,url.lastIndexOf('?')).substring(url.lastIndexOf('.') + 1).toLowerCase();
			} else {
				suffix = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
			}
			if (suffix === 'jpg' || suffix === 'jpeg' || suffix === 'png' || suffix === 'gif') {
				ret =  'IMAGE';
			} else {
				ret = 'LINK'
			}
		}
		return ret;
	}
	
});