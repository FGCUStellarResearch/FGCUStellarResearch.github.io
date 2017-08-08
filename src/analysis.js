
function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('Your browser is not supported for this tool. Try updating or using Chrome or Firefox instead');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
            var tarr = [];
            for (var j=0; j<data.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
    }
    console.log(lines);
}

function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("The selected file could not be read. Please check it and try again");
    }
}

function switchview() {
    document.getElementById("info-box").style.visibility="hidden";
    document.getElementById("graph-area").style.display="block";
    document.getElementById("container").style.visibility="visible";
}

function csvtojson(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    // first identify if data file contains headers
    var i = 0;
    while(isNaN(allTextLines[i]) || isNaN(allTextLines[i+1])) {
        // either this line or the next is not a number, so the current line i snot a line of data (probably)
        // look for what seems to be the start of data - handles non-standardized headers ok
        switch(allTextLines[i]) {
            case "[Kepler]":
                // placeholder

                break;

            case "": // K2
                // placeholder

                break;
            
            default:
                // placeholder
        }

    }
    // determine the source of the data, which will determine how the csv is parsed

    // consider a switch here, to handle Kepler, K2, TESS (?), etc., plus default

    // default assume first column == Time, second column == Flux data
}