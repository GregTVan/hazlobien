/*
create get / create / update logic in Preferences.java
show previously saved, also overall settings (eg MODE field, map to radios)
return link from profile page
use category savings when filtering users
load realistic phrases from XLS (vs. build UI to maintain frases)
save to GH
*/

$(document).ready(function(){
     
    $.get("rest/categories", function(data, status){
        setupColumns(data, 'tag', 'count', 2, "category-col");
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
            var label = elem.target.labels[0].innerText;
            label = label.substring(0, label.indexOf('(') - 1);
            var body = {
                selected: elem.target.checked,
                tag: label
            };
            $.ajax({
                contentType:"application/json; charset=utf-8",
                type: 'POST',
                data: JSON.stringify(body),
                dataType: 'json',
                url: 'rest/categories'
            });
        });
    }

});