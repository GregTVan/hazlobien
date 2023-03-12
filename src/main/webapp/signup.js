$(document).ready(function(){
	
    $('#go').click(function() {
	    $.ajax({
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({
				email: $('#email').val(),
				password: $('#password').val()
			}),
            dataType: 'json',
			success: function(data) {
				$('#errors').html(data.message);
			},
			type: 'POST',
	        url: 'rest/signup'
		});

	});
	
});