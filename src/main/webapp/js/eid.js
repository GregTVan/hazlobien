import { FaceDetection, IdCapture, IdCaptureSettings, IdCaptureSessionSettings, FaceRecognition, QRCodeGenerator, NormalDistribution, Rect, DocumentPages } from "../node_modules/@appliedrecognition/ver-id-browser/index.js";

// from Ray 2023-01-16 from Ray via Slack; expires 2024-01-30
const licenceKey = 'sRwAAAYQZGVtby5jYW5jaGVrLmNvbTnJB6NGnL5j+yHvcIB59c4uPCl2W8/fGl/Twruci7duBI2XpE8sltAyqrNaBH+1gAyl7zwpXRQxsiyvz+Bp3rDqKVf+z1YmwmD1OZIMFiOj098eqdjmKpW3h87X21ByxT3M6yn8dyNeBzUjOwMD2oUEe48Ewy2QOwouPXChjlMGAFVpk72/CPfWMwcw1asrZqhQW/yYXCfF9ZmQeRPx4HSYzO6yed7YCA=='
//const licenceKey = 'sRwAAAYLY2FuY2hlay5jb21TME64cuXDRaT9OIgQJmj+j+Z1KP7I2iZH43RGU/ie1NFNvMeuZE/R/VBJvsenoqaaP9sMZwJom3TduRn/5dN20/G0a6At2WIOsv44FYTOdPF2/59YpINzEdecBTrEP4vgoE+/3aCRM4IPDwrJHdBaG3NN5AXVeOLzcCoa6X78Bq1vC3G/qWfgPrFpQvXCUw7BdvP5v5e4T8f2SND5PJq7j7CnMUI=';
// from Ray 2022-07-14, valid until 2023-01-14
//const licenceKey = 'sRwAAAYQZGVtby5jYW5jaGVrLmNvbTnJB6NGnL5j+yHv8IQp32tgqUgt50BcJ4eDKcG0x6ZrwajrwuJxZGwA50ZwlmOOTsZWp3cuoyBWb65O3Z3PhD1dys0iENEQS/SH8X6LQK8u2mB7WwtTpujRxJkDqx1aozZGvCDSPqNANvIeml53pJ2wuoNrB/va0QqCnSbP2Gd8BhKY9EBCnZqKk0K3snvu/5lX0Wyabr+nq6woTb9TP5/EWanbzsUGog==';
//const licenceKey = 'sRwAAAYQZGVtby5jYW5jaGVrLmNvbTnJB6NGnL5j+yHvcIM5+Mh8cXxb002Y5scDZxUYcEuuOLirQC848U9aaP+eCLpL7M2FqxI3VKfBDVhFAer/dc1MUSEY2XiST4fUBscEHItPyi3rP5Zsq2GKwTqTTW2gWhDBVkaW/ZpfVBpefJjW1EpzPRrLVXXU24xCB1MXqQ/2MNWK0aJ+hMf1fEqCdxIQX3BzGvaUXD8QpPFAt8H8+lyvh5EpCX0TuA==';
const serverURL = 'https://eid.canchek.com:443'

const faceDetection = new FaceDetection(serverURL);		
const faceRecognition = new FaceRecognition(serverURL);
const settings = new IdCaptureSettings(licenceKey, "/node_modules/@appliedrecognition/ver-id-browser/resources/");

let frontPageResult;

const idCapture = new IdCapture(settings, serverURL);

var app = angular.module('canchek-eID', []);

app.controller('eidController', function($scope, $http) {

	$scope.alertMessage = '';
	$scope.pin = null;
	$scope.resultHolder = {};
	$scope.showButton = true;
	$scope.showInput = false;
	$scope.showInvalidPin = false;

	$scope.showIntroduction = function() {
		$scope.textButton= 'Click to Continue';
		$scope.textMajor = 'Welcome to Canchek-eID';
		$scope.textMinor = 'Please have your government issued photo ID ready. Tap below to continue.'
		$scope.currentPage = 'INTRODUCTION';
	}
	
	$scope.showEnterPin = function() {
		$scope.textButton= 'Click to Continue';
		$scope.textMajor = 'Step 1: Enter PIN';
		$scope.textMinor = 'Enter your Canchek-eID PIN from the email that we sent you.'
		$scope.currentPage = 'ENTER_PIN';
		$scope.showInput = true;
	}
	
	$scope.showScanDocument = function() {
		$scope.textButton= 'Click to Scan Document';
		$scope.textMajor = 'Step 2: Scan Document';
		$scope.textMinor = 'Click below, then position your government issued ID in the frame.';
		$scope.currentPage = 'SCAN_DOCUMENT';
		$scope.showInput = false;
	}
	
	$scope.showTakeSelfie = function() {
		$scope.textButton= 'Click to Take Selfie';
		$scope.textMajor = 'Step 3: Take Selfie';
		$scope.textMinor = 'Click below, centre your face in the oval, and follow the instructions that appear. Once we get a good picture, this process will end automatically.';
		$scope.currentPage = 'TAKE_SELFIE';
		$scope.$apply();
	}

	$scope.showGoodbye = function() {
		$scope.textButton= 'Dismiss';
		$scope.textMajor = 'All Done!';
		$scope.textMinor = 'We have sent your information to your financial services provider. Thank you for your cooperation!';
		$scope.currentPage = 'GOODBYE';
		$scope.showButton = false;
		$scope.$apply();
	}
	
	//
	
	$scope.goNextPage = function() {
		switch($scope.currentPage) {
			case 'INTRODUCTION': {
				$scope.showEnterPin();
				break;
			}
			case 'ENTER_PIN': {
				$scope.checkPin();
				break;
			}
			case 'SCAN_DOCUMENT': {
				$scope.scanDocument();
				break;
			}
			case 'TAKE_SELFIE': {
				$scope.takeSelfie();
				break;
			}
		}
	}

	$scope.clearAlert = function() {
		$scope.alertMessage = '';
		$('.alert').hide();	
	}
	
	//

	$scope.checkPin = function() {
		$scope.pin = parseInt($scope.pin);
		// cannot use Number.isInteger here because pin is a String from the DOM
		if($scope.pin && $scope.pin >= 1000 && $scope.pin <= 9999) {
			$http({
				method: 'GET',
				url: 'https://www.canchek.com/canchek/rest/pin/' + $scope.pin
			}).then($scope.processCheckPinReply);
		} else {
			$scope.alertMessage = 'PIN must be a 4 digit number';
			$('.alert').show();
		}
	}
	
	$scope.processCheckPinReply = function(reply) {
		if(reply.data.authorized) {
			$scope.sendTelemetry("PIN_SUCCESS");
			$scope.showScanDocument();
		} else {
			$scope.alertMessage = 'Invalid PIN';
			$('.alert').show();
		}
	}
	
	$scope.scanDocument = function() {
		$scope.resultHolder.selfieImage = '';
		const subscription = idCapture.captureIdCard(new IdCaptureSessionSettings(DocumentPages.FRONT_AND_BACK, 60000, true)).subscribe({
			next: (result) => {
				if(result.pages == DocumentPages.BACK) {
					$scope.resultHolder.address = result.result.address;
					if(result.result.dateOfBirth) {
						var birthDate = $scope.formatISODate(result.result.dateOfBirth.year, result.result.dateOfBirth.month, result.result.dateOfBirth.day);
						$scope.resultHolder.birthDate = birthDate;
					}
					$scope.resultHolder.documentNumber = result.result.documentNumber;
					if(result.result.dateOfExpiry) {
						var expiryDate = $scope.formatISODate(result.result.dateOfExpiry.year, result.result.dateOfExpiry.month, result.result.dateOfExpiry.day);
						console.log(expiryDate);
						$scope.resultHolder.expiryDate = expiryDate;
					}
					$scope.resultHolder.deviceInfo = 'WEB ' + (window.navigator.appCodeName || '') + ' ' + (window.navigator.appName || '');
					$scope.resultHolder.firstName = result.result.firstName;
					$scope.resultHolder.lastName = result.result.lastName;
					$scope.resultHolder.selfieImage = '';
				}
				if(result.pages == DocumentPages.FRONT) {
					$scope.resultHolder.documentCountry = result.result.classInfo.countryName;
					$scope.resultHolder.documentImage = $scope.addIDCardImages(result);
					$scope.resultHolder.documentRegionCode = result.result.classInfo.region;
					$scope.resultHolder.documentTypeCode = result.result.classInfo.documentType;
					frontPageResult = result;
				}
				$scope.resultHolder.device = navigator.appVersion;
				$scope.resultHolder.pin = $scope.pin;
			},
			error: (error) => {
				$scope.sendTelemetry("DOCUMENT_ERROR");
			},
			complete: () => {
				if($scope.resultHolder.documentImage) {
					$scope.sendTelemetry("DOCUMENT_SUCCESS");
					$scope.showTakeSelfie();
				} else {
					$scope.sendTelemetry("DOCUMENT_ERROR");
				}
			}
		});
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
	
	$scope.takeSelfie = function() {
		faceDetection.livenessDetectionSession().subscribe({
			next: (result) => {
				const liveFace = result.faceCaptures[0].face;
				faceRecognition.compareFaceTemplates(frontPageResult.face.template, liveFace.template).then((score) => {
					$scope.sendTelemetry("SELFIE_SUCCESS");
					$scope.resultHolder.score = score;
					$scope.sendDetails();
					$scope.showGoodbye();
				}).catch((error) => {
					$scope.sendTelemetry("SELFIE_ERROR");
				});
			},
			error: (error) => {
				$scope.sendTelemetry("SELFIE_ERROR");
			}
		});
	}

	$scope.sendDetails = function() {
		$http({
			headers: {
				'Content-Type': 'text/plain',
			},
			data: angular.toJson($scope.resultHolder),
			method: 'PUT',
			url: 'https://www.canchek.com/canchek/rest/eid_request'
		})
	}
	
	$scope.sendTelemetry = function(message) {
		$http({
			method: 'GET',
			url: 'https://www.canchek.com/canchek/rest/telemetry/' + $scope.pin + "/" + message
		});
	}
	
	// copied directly from Arc's demo.js sample

	$scope.dataURLFromImageData = function(imageData) {
		const canvas = document.createElement("canvas");
		canvas.width = imageData.width;
		canvas.height = imageData.height;
		const ctx = canvas.getContext("2d");
		ctx.putImageData(imageData, 0, 0);
		return canvas.toDataURL();
	}

	$scope.imageDataFromIdCaptureResult = function(result) {
		if (result.result.fullDocumentFrontImage) {
			return result.result.fullDocumentFrontImage.rawImage;
		}
		else if (result.result.fullDocumentImage) {
			return result.result.fullDocumentImage.rawImage;
		}
		return null;
	}

	$scope.addIDCardImages = function(result) {
		const imageData = $scope.imageDataFromIdCaptureResult(result);
		if (imageData) {
			const dataURL = $scope.dataURLFromImageData(imageData);
			return dataURL.substr(22);
		}
	}
	
	//
	
	$scope.clearAlert();
	$scope.showIntroduction();

});
