var baseUrl = 'http://localhost:8080/amleid';
//var baseUrl = 'http://letsdospanish.com';'

var auth0 = new auth0.WebAuth({
	clientID: 'dkbexIr2vpwUcMgEuuHhcrmqdC2xi2kX',
	domain: 'hazlobien.us.auth0.com',
	redirectUri: location.href,
    responseType: 'token id_token',
    scope: 'openid profile email'
});

function isAuthenticated() {
	var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
	return new Date().getTime() < expiresAt;
}

function logout() {
	localStorage.removeItem('access_token');
	localStorage.removeItem('id_token');
	localStorage.removeItem('expires_at');
	auth0.logout({
    	returnTo: baseUrl
  	});
}

/*var baseURL = 'http://204.13.49.88';
var idToken;

var auth0 = new auth0.WebAuth({
    domain: 'hazlobien.us.auth0.com',
    clientID: 'dkbexIr2vpwUcMgEuuHhcrmqdC2xi2kX',
    redirectUri: 'http://204.13.49.88/frases.html',
    responseType: 'token id_token',
    scope: 'openid id_token'
});*/

/*  
function login() {
    var email = $('#email').val();
    var password = $('#password').val();
    auth0.login({
      realm: 'Username-Password-Authentication',
      username: email,
      password: password
    }, function(err) {
	  console.log('auth0 error');
      if (err) {
        console.log(err);
      }
    }, function(succ) {
	  console.log('auth0 ok');
      if (err) {
        console.log(err);
      }
    });
 }


function checkIsAuthenticated() {
	var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  	if(new Date().getTime() < expiresAt) {
		login();
	} else {
		window.location.href = baseURL;
	}
}

function parseUrl() {	
    
	/*
	https://204.13.49.88/frases.html
	#access_token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9oYXpsb2JpZW4udXMuYXV0aDAuY29tLyJ9..naHC3pBWH-FgxYgK.wDkcp8t1LqML4hnj6DiLtmHOWOaTlCHBIja5tvtsAqnD7GBsJ2I51ESNDQ57SfRpyN00RcR0LDTOHV-d__Zg5b-oh4-VaMpTYpGArG7iBs1iONTyxLo_2WRXMKAmODFBXARRFAOExRYxWTbLYIQvYSqT5OEAkOWoUWaCQHZQQV9X-Z1Mxlm0cMzOAxlZVqNrCZqIace1zRugAaMw-LB9_tSn_B0il6O3_u7RaNs9q9fMTbKWwjHA-nTdxLth8heMGS2EsIOkTpSDypJZ_kPrrEpJ_pOQ_uXqJL7AO8tu.wkiVe6CXxxMT9FpKPqqGhQ
	&scope=openid
	&expires_in=7200
	&token_type=Bearer
	&state=0XcA2z9l9FGuYz2J-wbUhk5RXla2GlKK
	&id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFvdmlDaTRnQy1jUEtwa0ZpNlFkdCJ9.eyJpc3MiOiJodHRwczovL2hhemxvYmllbi51cy5hdXRoMC5jb20vIiwiYXVkIjoiZGtiZXhJcjJ2cHdVY01nRXV1SGhjcm1xZEMyeGkya1giLCJpYXQiOjE2Nzc0Njc3MTksImV4cCI6MTY3NzUwMzcxOSwic3ViIjoiYXV0aDB8NjNmYTg3NWEzOGIxZjcwNmE1MGNiNjkzIiwiYXRfaGFzaCI6IlIwbVc1TmNRYUhyVjgzWUhOaXVQQXciLCJzaWQiOiJERkVQQWN0M2YyOFZpZHNhekZGWVJmN1YyVzF3VHI5bSIsIm5vbmNlIjoicGxuLlM5flh0dm9HbnpoRXpLbl9NLUlJZ3BEb3lBWmgifQ.bG0asqWEof9Mig2T1J7IVxKvSnwZZtTvHFxKb9cYLWEuFJrQc-wkXR7HHZFUH7fm2Maf_Qsmk1xykyb4mFsct9rGfCEPKKIajTHYr0EQpIzUfHpzxrhaoOJgxZBJWLGg6UxoqriRbAZQdEZYkLlJfpS5ci8NiHN3BL87TXthK-5qEdOMVosQltRVaLdNe23gnTrPsDyhn3zijOcm1k3IZ1QzJTQgIKBa-scweMet3rRqba4v0dbTDvyMB4U60eAA_5DUXY-5J_kAiB2l8OIbMP8zEP6A301P-JxPvUWVYRfm9qDP9C-0Eda89qnJPafIa2qUUvjUrALquZgVBEACVQ 
	*
	    
    var elements = window.location.hash.split('#');
    var found = false;
    
    if(elements.length == 2) {
		elements = elements[1].split('&');
		if(elements.length == 6) {
			elements = elements[5].split('=');
			if(elements.length == 2) {
				if(elements[0] === 'id_token') {
					if(elements[1]) {
						idToken = elements[1];
						found = true;
					}
				}			
			}
		}
	}
	
	if(!found) {
		window.location.href = baseURL; 
	}
    
}*/