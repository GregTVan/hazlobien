$(document).ready(function(){
    
    var frases;
    var frase_ptr = 0;
    
    $.get("rest/frases", function(data, status){
        frases = data;
        showPhrase();
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
            type: 'POST',
            data: JSON.stringify(body),
            dataType: 'json',
            url: 'rest/respuesta'
        });
    }

});