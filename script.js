function processLine(line) {
    /* This function processes each line step-by-step */
    var output = '',
        steps = line.split(", "),
        tokens = {  // TODO: maybe make these dynamic? depends on other puzzles descriptors
            "sp": '&nbsp;',
            "o": '<span class="o">*</span>',
            "l": '<span class="l">*</span>',
            "$": '<span class="s">*</span>',
        };
    
    steps.forEach(element => {
        var tmp = element.split("-"),
            ctr = Number(tmp[0]),  // the # of repetitions
            val = tmp[1];  // the value to repeat (space, o, l, $)

        if (val === 'sp') {
            // space maps to non breaking space &nbsp;
            var content = Array(ctr + 1).join(tokens[val]);
            output += content;
        } else {
            // a bit more complicated, as it needs wrap each sequence in a styled span
            var span = tokens[val],
                content = Array(ctr + 1).join(val);
            output += span.replace("*", content);;
        } 
    });

    output += '<br/>'  // newline
    return output;
}

function solvePattern(object_id) {
    // line by line check
    var instructions = $("#" + object_id + "-original");
    
    instructions[0].innerHTML.split('\n').forEach(element => {
        if (/^\d+\--/.test(element)) {
            // if it starts with 1-- .. 10-- etc. it's a pattern line
            var cleaned = element.split("--")[1].trim();
            if(cleaned.length) {
                $("#" + object_id + "-solution").append(
                    processLine(cleaned)
                );
            }
        }
        // other line types ---, ```, * etc are ignored
        // TODO: parse the source line into a clickable link
    });
}

function showItem(include_id) {
    // Shows the section-content item in page
    $(".section-content:not(#" + include_id + ")").toggle(false);
    $("#" + include_id).toggle(true);
}

function showSolution( object_id, forced_reset=false) {
    // Shows the solution/original for a given id
    if (forced_reset === true) {
        $("#" + object_id + "-original").toggle(true);
        $("#" + object_id + "-solution").toggle(false);
    } else {
        $("#" + object_id + "-original").toggle();
        $("#" + object_id + "-solution").toggle();
    }
}

function getItemId(evt) {
    // Gets an item id off the href attribute
    return evt.target.href.replace(evt.target.origin + '/', '');
}

$(document).ready(function(){

    $("li.nav a").on("click", function(evt) {
        evt.preventDefault();
        var text = evt.target.text,
            object_id = getItemId(evt);

        $("#section-title").html(text);
        if(/^\d+/.test(object_id)) {
            solvePattern(object_id);
            // we issue a forced reset of the original/solution tabs
            showSolution(object_id, forced_reset=true);
        }
        showItem(object_id);
    });

    // show/hide the solution
    $(".toggler").on("click", function(evt) {
        evt.preventDefault();
        
        showSolution(getItemId(evt));
    });
})