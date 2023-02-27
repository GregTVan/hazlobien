$(document).ready(function(){
    
 /*
 https://204.13.49.88/frases.html
 #access_token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9oYXpsb2JpZW4udXMuYXV0aDAuY29tLyJ9..naHC3pBWH-FgxYgK.wDkcp8t1LqML4hnj6DiLtmHOWOaTlCHBIja5tvtsAqnD7GBsJ2I51ESNDQ57SfRpyN00RcR0LDTOHV-d__Zg5b-oh4-VaMpTYpGArG7iBs1iONTyxLo_2WRXMKAmODFBXARRFAOExRYxWTbLYIQvYSqT5OEAkOWoUWaCQHZQQV9X-Z1Mxlm0cMzOAxlZVqNrCZqIace1zRugAaMw-LB9_tSn_B0il6O3_u7RaNs9q9fMTbKWwjHA-nTdxLth8heMGS2EsIOkTpSDypJZ_kPrrEpJ_pOQ_uXqJL7AO8tu.wkiVe6CXxxMT9FpKPqqGhQ
 &scope=openid
 &expires_in=7200
 &token_type=Bearer
 &state=0XcA2z9l9FGuYz2J-wbUhk5RXla2GlKK
 &id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFvdmlDaTRnQy1jUEtwa0ZpNlFkdCJ9.eyJpc3MiOiJodHRwczovL2hhemxvYmllbi51cy5hdXRoMC5jb20vIiwiYXVkIjoiZGtiZXhJcjJ2cHdVY01nRXV1SGhjcm1xZEMyeGkya1giLCJpYXQiOjE2Nzc0Njc3MTksImV4cCI6MTY3NzUwMzcxOSwic3ViIjoiYXV0aDB8NjNmYTg3NWEzOGIxZjcwNmE1MGNiNjkzIiwiYXRfaGFzaCI6IlIwbVc1TmNRYUhyVjgzWUhOaXVQQXciLCJzaWQiOiJERkVQQWN0M2YyOFZpZHNhekZGWVJmN1YyVzF3VHI5bSIsIm5vbmNlIjoicGxuLlM5flh0dm9HbnpoRXpLbl9NLUlJZ3BEb3lBWmgifQ.bG0asqWEof9Mig2T1J7IVxKvSnwZZtTvHFxKb9cYLWEuFJrQc-wkXR7HHZFUH7fm2Maf_Qsmk1xykyb4mFsct9rGfCEPKKIajTHYr0EQpIzUfHpzxrhaoOJgxZBJWLGg6UxoqriRbAZQdEZYkLlJfpS5ci8NiHN3BL87TXthK-5qEdOMVosQltRVaLdNe23gnTrPsDyhn3zijOcm1k3IZ1QzJTQgIKBa-scweMet3rRqba4v0dbTDvyMB4U60eAA_5DUXY-5J_kAiB2l8OIbMP8zEP6A301P-JxPvUWVYRfm9qDP9C-0Eda89qnJPafIa2qUUvjUrALquZgVBEACVQ 
 
 */
    
    var accessToken = window.location.hash.split('#')[1].split('&')[5].split('=')[1];
    
    var frases;
    var frase_ptr = 0;
    
    /*$.get("rest/frases", function(data, status){
        frases = data;
        showPhrase();
    });*/
    console.log('wth');
    $.ajax({
        headers: {
			 'Authorization': accessToken
		},
		success: function(data) {
			console.log(data);
			frases = data;
			showPhrase();
		},
		type: 'GET',
        url: 'rest/frases'
	});

    var showPhrase = function() {
        var es = frases[frase_ptr].es;
        var inp = '<input id="inp" class="input" type="text"/>';
        es = es.replace('()', inp);
        $('#es').html(es);
        $('#en').text(frases[frase_ptr].en);
        $('#show-answer').show();
    }
    
    $('#es').keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            $('input').each(function(i,control) {
                var resp =$(control).val();
                if(resp === frases[frase_ptr].expect[0]) {
                    logRespuesta(true, frase_ptr, resp);
                    correct = true;
                    if(frase_ptr < frases.length - 1) {
                        frase_ptr++;
                    } else {
                        $('#feedback').text("You've finished all the phrases! Click 'Profile' [top right] to select more categories.");
                        $('#show-answer').hide();
                    }
                    showPhrase();
                } else {
                    logRespuesta(false, frase_ptr, resp);
                    $('#feedback').text("Sorry, that's incorrect.");
                    $('#show-answer').show();
                }
            });
        } else {
            $('#answer').text("");
            $('#feedback').text("");
        }
    });

    $('#show-answer').click(function() {
        var ans = "The correct answer is '" + frases[frase_ptr].expect[frase_ptr] + "'";
        $('#answer').text(ans);
        $('#answer').show();
        $('#show-answer').text("Go to next phrase");
    });

    $('#answer').hide();

    var logRespuesta = function(correct, frasePtr, resp) {
        var body = {
            correct: correct,
            en: frases[frasePtr].en,
            es: frases[frasePtr].es,
            expect: frases[frasePtr].expect[0],
            respuesta: resp
        };
        $.ajax({
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify(body),
            dataType: 'json',
            headers: {
				 'Authorization': accessToken
			},
			type: 'POST',
            url: 'rest/respuesta'
        });
    }

});