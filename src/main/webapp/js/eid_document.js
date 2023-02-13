import { IdCapture, IdCaptureSettings, IdCaptureSessionSettings, DocumentPages } from "../node_modules/@appliedrecognition/ver-id-browser/index.js";

const licenceKey = 'sRwAAAYQZGVtby5jYW5jaGVrLmNvbTnJB6NGnL5j+yHvcIM5+Mh8cXxb002Y5scDZxUYcEuuOLirQC848U9aaP+eCLpL7M2FqxI3VKfBDVhFAer/dc1MUSEY2XiST4fUBscEHItPyi3rP5Zsq2GKwTqTTW2gWhDBVkaW/ZpfVBpefJjW1EpzPRrLVXXU24xCB1MXqQ/2MNWK0aJ+hMf1fEqCdxIQX3BzGvaUXD8QpPFAt8H8+lyvh5EpCX0TuA==';
const settings = new IdCaptureSettings(licenceKey, "/node_modules/@appliedrecognition/ver-id-browser/resources/");
const serverURL = 'https://eid.canchek.com:443'

const idCapture = new IdCapture(settings, serverURL);

var app = angular.module('canchek-eID', []);

app.controller('eidDocumentController', function($scope, $http) {
	
	$scope.msg;
	
	$scope.goIdCard = function() {
		$scope.scanDocument(DocumentPages.FRONT_AND_BACK);
	}
	
	$scope.goPassport = function() {
		//$scope.scanDocument(DocumentPages.FRONT);
		$scope.scanDocument(DocumentPages.FRONT_AND_BACK);
	}

	$scope.scanDocument = function(sides) {
		$scope.msg = '';
		const subscription = idCapture.captureIdCard(new IdCaptureSessionSettings(sides, 60000, true)).subscribe({
			next: (result) => {
				if(result.pages == DocumentPages.BACK) {
					$scope.alertResult('==Back Side==', result.result);
				}
				if(result.pages == DocumentPages.FRONT) {
					$scope.alertResult('==Front Side==', result.result);
				}
			},
			error: (error) => {
				alert('Error scanning document');
			},
			complete: () => {
				alert($scope.msg);
			}
		});
	}

	$scope.alertResult = function(description, result) {
		$scope.msg += description + '\n';
		if(result) {
			$scope.msg += $scope.formatText('Document Number', result.documentNumber);
			$scope.msg += $scope.formatText('First Name', result.firstName);
			$scope.msg += $scope.formatText('Last Name', result.lastName);
			$scope.msg += $scope.formatText('Address', result.address);
			$scope.msg += $scope.formatDate('Date of Birth', result.dateOfBirth);
			$scope.msg += $scope.formatDate('Expiry Date', result.dateOfExpiry);
			if(result.classInfo) {
				$scope.msg += $scope.formatText('Document Type Code', result.classInfo.documentType);
				$scope.msg += $scope.formatText('Country', result.classInfo.countryName);
				$scope.msg += $scope.formatText('Region Code', result.classInfo.region);
			}
		} else {
			$scope.msg += ' scan failed';
		}
	}
	
	$scope.formatText = function(label, text) {
		if(text) {
			return label + ': ' + text + '\n';
		} else {
			return '';
		}
	}

	$scope.formatDate = function(label, text) {
		if(text) {
			var date = $scope.formatISODate(text.year, text.month, text.day);
			return label + ': ' + date + '\n';
		} else {
			return '';
		}
	}
	
	$scope.formatISODate = function(year, month, day) {
		if(year && month && day) {
			return year + "-" + $scope.padZeroes(month,2) + "-" +$scope.padZeroes(day,2);
		} else {
			return '';
		}
	}

	$scope.padZeroes = function pad(num, size) {
		num = num.toString();
		while (num.length < size) num = '0' + num;
		return num;
	}
	
});