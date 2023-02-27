var auth0 = new auth0.WebAuth({
    domain: 'hazlobien.us.auth0.com',
    clientID: 'dkbexIr2vpwUcMgEuuHhcrmqdC2xi2kX',
    redirectUri: 'http://204.13.49.88/frases.html',
    responseType: 'token id_token',
    scope: 'openid'
});
  
function login() {
    console.log('here');
    var email = $('#email').val();
    var password = $('#password').val();
    auth0.login({
      callback_url: 'http://localhost/frases.html',
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
  
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    window.location.href = '/';
}

auth0.parseHash(function(err, authResult) {
	console.log('got auth resp');
    if (authResult && authResult.accessToken && authResult.idToken) {
      console.log('got login back');
      $.ajaxSetup({
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', authResult.accessToken);
        }
      });
      window.location.hash = '';
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime()));
      window.location.href = '/';
    } else if (err) {
      console.log(err);
    }
});

function isAuthenticated() {
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
}
  
function handleAuthentication() {
    if (!isAuthenticated()) {
      login();
    }
}
 
$(document).ready(function() {
    // do every time even if we already have a token
    //handleAuthentication();
    $('#login').on('click', function(event) {
        console.log('click');
        login();
    });
});
  