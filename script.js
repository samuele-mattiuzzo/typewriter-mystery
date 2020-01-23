function processLine(line) {
    /* This function processes each line step-by-step */
    var output = '',
        steps = line.split(", "),
        tokens = {
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

function solvePattern(instructions) {
    // line by line check
    instructions.forEach(element => {
        if (/^\# /.test(element)) {
            // this line contains the journal's title
            $("#drawTitle").html(element.replace("# ", ""));
        }

        if (/^\d+\--/.test(element)) {
            // if it starts with 1-- .. 10-- etc. it's a pattern line
            var cleaned = element.split("--")[1].trim();
            if(cleaned.length) {
                $(drawArea).append(processLine(cleaned));
            }
        }
        // other line types ---, ```, * etc are ignored
        // TODO: parse the source line into a clickable link
    });
}

function loadPattern(filename) {
    $("#originalText").load(filename, function(response, status, xhr) {
        if ( status == "error" ) {
            var msg = "Sorry but there was an error: ";
            $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
        } else {
            var instructions = response.split("\n");
            $(drawArea).append('');
            solvePattern(instructions);
        }
    });
}

$(document).ready(function(){

    //$("#navMenu")
    $("li.nav a").on("click", function(evt) {
        evt.preventDefault();
        var origin = evt.target.origin,
            fullUrl = evt.target.href,
            text = evt.target.text,
            filename = fullUrl.replace(origin, "");

        if (/\/\d+.txt/.test(filename)) {
            $("#viewer").toggle(false);
            $("#about").toggle(false);
            $("#sectionTitle").html(text);
            loadPattern(filename);
            $("#viewer").toggle(true);
        } else {
            if (/about/.test(filename)) {
                $("#viewer").toggle(false);
                $("#sectionTitle").html("ABOUT TYPEWRITER MYSTERIES");
                $("#about").toggle(true);
            }
        }
    });

    // show/hide the solution
    $("#toggler").on("click", function() {
        $("#originalText").toggle();
        $("#drawArea").toggle();
    });
})