
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
    csvtojson(csv);
}

function processData(csv) {
    // TODO: determine if this is necessary to keep; should have been replaced by csvtojson()
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
    // exclusively used to hide and show elements on the webviewer's first page load
    document.getElementById("info-box").style.visibility="hidden";
    document.getElementById("graph-area").style.display="block";
    document.getElementById("container").style.visibility="visible";
    document.getElementById("analysis").style.visibility="visible";
    document.getElementById("csvFileInput").style.visibility="visible";
}

function csvtojson(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    
    // first identify if data file contains headers
    var i = 0;
    window.targetSource = "";
    window.targetID = "";
    window.targetData = [];
    window.targetTime = [];
    window.targetFlux = [];
    window.useDFT = false;
    switch(allTextLines[0].split(' ')[0]) {
        // different data sources may have special case input formats to deal with
            case "Kepler":
                targetSource = "Kepler";
                targetID = allTextLines[2].split(/[[\]]{1,2}/)[1];
                break;

            case "": // K2
                // placeholder

                break;
            
            default:
                // placeholder
                break;
        }
    while(isNaN(allTextLines[i].split(',')[0]) || isNaN(allTextLines[i+1].split(',')[0]) || allTextLines[i].split(',') == "") {
        // either this line or the next is not a number, so the current line is not a line of data (probably)
        // look for what seems to be the start of data - handles non-standardized headers ok
        i++;
    }
    for (; i < allTextLines.length - 1; i++) {
        dataline = allTextLines[i].split(',');
        targetData.push([+dataline[0],+dataline[1]]);
        targetTime.push(+dataline[0]);
        targetFlux.push(+dataline[2]); // NOTE: using dataline[2] because it's going into the detrender later
    }
    lastline = allTextLines[i].split(',');
    targetData.push([+lastline[0],+lastline[1]]);
    console.log(targetSource + targetID); // for debugging; never seen by users


/*  full disclosure here, sort() causes an issue where the first index, targetData[0][i] is 0,NaN
    the shift() removes that 0,NaN entry, but it's likely that a point or two of data are being lost in translation
    the sort() function is required because without it, the graph refuses to display; sort() is the lesser evil 
*/
    targetData.sort(sortFunction).shift();
    timeseries();
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}
