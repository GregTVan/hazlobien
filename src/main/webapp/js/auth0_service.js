app.service('auth0Service', function($location, $http, $state, configuration) {

	// var audience = 'https://canchek-sso.us.auth0.com/userinfo';
	var audience = 'https://canchek.auth0.com/userinfo';
	var clientId = 'RTL9VWotlUFXXQw5GHYGrSrwQMF2paJJ'; // Canchek production tenant
	// var clientId = 'SSqBLxEEU4EeZhNjTxpGs7VTEgpTODza'; // for test SSO tenant
	var domain = 'canchek.auth0.com';
	//var domain = 'canchek-sso.us.auth0.com';
	var responseType = 'token id_token';
	var scope = 'openid';

	var idToken = '';
	var protocol = 'https://';

	// for dev testing, this is easier, but s/b setup in web.xml
	if($location.host() === 'localhost') {
		protocol = 'http://';
	}
	
	this.getIdToken = function() {
		return idToken;
	}
	
    var webAuth;

    this.doLogin = function() {
		webAuth = new auth0.WebAuth({
			audience: audience,
			clientID: clientId,
			domain: domain,
			redirectUri: protocol + $location.host() + '/app.html',
			responseType: responseType,
			scope: scope
		});
        webAuth.authorize();
    }
	
	var setupExistingLogin = function(authResult) {
		// store for customer_agreement.html to use (accessed via window.opener)
		window.idToken = authResult.idToken;
		$http.defaults.headers.common.Authorization = 'Bearer ' + authResult.idToken;
		$http.defaults.headers.common['X-Canchek-Client'] = 'true';
		$http.defaults.headers.common['Cache-Control'] = 'no-cache';
		$http.defaults.headers.common['Pragma'] = 'no-cache';
		configuration.resolvePromise();
	}
	
	this.setupExistingLogin = setupExistingLogin;
	
    this.handleAuthentication = function(redirectTo, callback1, callback2) {
		webAuth = new auth0.WebAuth({
			audience: audience,
			clientID: clientId,
			domain: domain,
			redirectUri: protocol + $location.host() + '/' + redirectTo,
			responseType: responseType,
			scope: scope
		});
        webAuth.parseHash(function(err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
				setupExistingLogin(authResult);
				if(callback1) {
					callback1(authResult.appState.fileName, authResult.appState.key, callback2);
				}
            } else {
				webAuth.authorize({
					appState: {
						fileName: $location.search()['fileName'],
						key: $location.search()['key']
					}
				});
			}
        });
    }
	
	this.logout = function() {
		if(!webAuth) {
			webAuth = new auth0.WebAuth({
				audience: audience,
				clientID: clientId,
				domain: domain,
				redirectUri: protocol + $location.host() + '/app.html',
				responseType: responseType,
				scope: scope
			});
		}
		webAuth.logout({
			returnTo: protocol + $location.host() + '/app.html',
			clientID: clientId
		});
	}
	
});