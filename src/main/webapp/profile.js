$(document).ready(function(){
    
    $.get("rest/categories", function(data, status){
        setupColumns(data, 'tag', 'count', 2, "category-col");
        $.get("rest/preferences", function(data, status){
            setupCategories(data.categories);
            setupMode(data.mode);
            setupWords(data.words);
        });
    });    
    
    $(document).on('click', 'input[type="radio"]', function(elem) {
        setUIState(elem.target.id);
        saveUIState();
    });
    
    $('#big-input').on('input', function(event) {
        saveUIState();
    });
      

    var setupColumns = function(data, field, counter, numColumns, prefix) {
        var count = 0;
        var entriesPerColumn = Math.ceil(data.length / numColumns);
        var i = 0;
        do {
            for(var j=0;j<numColumns;j++) {
                if(data[i]) {
                    var elem = "<label><input type='checkbox'>" + data[i][field] + " (" + data[i][counter] + " phrases)" + "</label>";
                    $("#" + prefix + "-" + j).append(elem);
                    count += data[i][counter];
                    i++;
                }    
            }    
        } while (i<data.length);    
        $("#label1").text('Show me everything! (' + count + ' phrases)');
        $(document).on('click', 'input[type="checkbox"]', function(elem) {
            saveUIState();
        });    
    }    

    var setupCategories = function(categories) {
        for(var i=0;i<categories.length;i++) {
            $("label:contains('" + categories[i] + "')").children()[0].checked = true;
        };
    }

    var setupMode = function(mode) {
        switch(mode) {
            case 'WORDS':
                setUIState('option2');
                break;
            case 'CATEGORIES':
                setUIState('option3');
                break;
            default:     
            setUIState('option1');
        }    
    }    

    var setupWords = function(words) {
        var wordList = words.join(' ');
        $('#big-input').val(wordList);
    }    

    var setUIState = function(id) {
        $('#' + id).attr('checked', true);
        if(id === 'option2') {
            $('#big-input').prop( "disabled", false);
        } else {
            $('#big-input').prop( "disabled", true);
        }
        if(id === 'option3') {
            $('input[type="checkbox"]').prop("disabled", false);
        } else {
            $('input[type="checkbox"]').prop("disabled", true);
        }
    }

    var saveUIState = function() {
        var categories = [];
        $('input[type="checkbox"]').each(function(a,b) {
            if($(this).is(':checked')) {
                var label = $(this).parent()[0].innerText;
                label = label.substr(0, label.indexOf('(') - 1);
                categories.push(label);
            }
        });
        var words = $('#big-input').val().split(' ');
        var mode = 'ALL';
        if($('#option2')[0].checked) {
            mode = 'WORDS';
        }
        if($('#option3')[0].checked) {
            mode = 'CATEGORIES';
        }
        var state = {
            categories: categories,
            mode: mode,
            userId: 'tbd',
            words: words
        }
        $.ajax({
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify(state),
            dataType: 'json',
            type: 'POST',
            url: 'rest/preferences'
        });
    }

});