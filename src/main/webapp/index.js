function login() {
    var email = $('#email').val();
    var password = $('#password').val();
}

$(document).ready(function() {
    $('#login').on('click', function() {
        login();
    });
});