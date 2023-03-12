// special case: due to auth.js,
// we have to wait until auth.js is loaded (document ready does NOT take care of this)
// window.onload guarantees this

window.onload = function() {
	
	$(document).ready(function(){

		function handleAuthentication() {
			auth0.parseHash(function(err, authResult) {
				if (authResult && authResult.accessToken && authResult.idToken) {
					localStorage.setItem('access_token', authResult.accessToken);
					localStorage.setItem('expires_at', JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime()));
					localStorage.setItem('id_token', authResult.idToken);
					window.location.href = 'frases.html';
				}
			});
		};

		handleAuthentication();
	
		if (isAuthenticated()) {
			window.location.href = "frases.html"
		} else {
			auth0.authorize();
		}
		
	});

};