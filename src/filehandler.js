
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
    // Get the name of the file so we know what the target is
    window.targetFilename = fileToRead.name;
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

function setDetrended() {
    // small helper to indicate that the selected file's data has already been detrended, was a toggle in original
    // TODO: consider finishing this - I can make the button disabled, but can I re-enable it on new file load?
    document.getElementById("").style.disabled; // TODO: fill in "" with detrend button's ID
}

function csvtojson(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    
    // first identify if data file contains headers
    var i = 0;
    /* NOTE: these 'window' variables are equivallent to globals since all our javascript runs inside the window scope;
             this is something that should be looked into again later, as not passing variables along and instead modifying
             global values (or having global variables at all) is, at the very least, a bad practice. Globals generally 
             ought to be reserved for static values. Currently this is a "good enough" implementation 
    */
    // TODO: if these are going to be globals, they should probably be declared in a constructor
    //       and maybe they really shouldn't be globals...
    window.targetSource = "";
    window.targetID = "";
    window.targetTime = [];
    window.targetFlux = [];
    window.detrendedFlux = [];
    window.DFTtimeseries = [];
    window.DFTdetrendedseries = [];
    window.useDFT = false;
    document.getElementById("useDetrend").checked = false;
    window.phaseFreq = 5;
    switch(allTextLines[0].split(' ')[0]) {
        // different data sources may have special case input formats to deal with
            case "Kepler":
                targetSource = "Kepler";
                targetID = allTextLines[2].split(/[[\]]{1,2}/)[1];
                break;

            // case "": // K2
            //     // placeholder

            //     break;
            
            default:
                // TODO: should probably throw an error if unrecognized source, as it'll fail regardless (and probably not gracefully)
                targetSource = "Kepler";
                try {
                    targetID = targetFilename.split('ktwo')[1].split('-')[0];
                }
                catch (anyError) {
                    targetID = "ID unknown: " + targetFilename;
                }
                break;
        }
    while(isNaN(allTextLines[i].split(',')[0]) || isNaN(allTextLines[i+1].split(',')[0]) || allTextLines[i].split(',') == "") {
        // either this line or the next is not a number, so the current line is not a line of data (probably)
        // look for what seems to be the start of data - handles non-standardized headers ok, not strenously tested though
        i++;
    }
    for (; i < allTextLines.length - 1; i++) {
        dataline = allTextLines[i].split(',');
        targetTime.push(+dataline[0]);
        targetFlux.push(+dataline[2]); 
        // NOTE: using dataline[2] because it's going into the detrender later
        // TODO: needs updating, as different sources may different data layouts, so this hardcoding isn't ideal
    }
    lastline = allTextLines[i].split(',');
    console.log(targetSource + targetID); // for debugging; never seen by users

    // NOTE: adding this small function to normalize flux; divides all target data values by the median flux value
    //       it might be more appropriate in analysis.js instead, but it should be done before any analysis takes place
    window.medianFlux = math.median(targetFlux);
    targetFlux = targetFlux.map(x => x / medianFlux);

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

function asciiOutput () {
    var textFile = null, 
      makeTextFile = function(data) {
        var dataBlob = new Blob([data], {type: 'text/plain'});

        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(dataBlob);
        return textFile;
    };

    var create = document.getElementById(),
      textbox = document.getElementById();

      create.addEventListener();
}

function outputCSV() {
    // create array of arrays - reverse of the reading in function
    dataline = [];
    // for () {
    //     // push the values for the calculated variables (all in the window/global, unless that changes)
    // }
}

function csvworksheet () {
    var test_array = [["name1", 2, 3], ["name2", 4, 5], ["name3", 6, 7], ["name4", 8, 9], ["name5", 10, 11]];

	var csvContent = "data:text/csv;charset=utf-8,";
	$("#pressme").click(function(){
		test_array.forEach(function(infoArray, index){
			dataString = infoArray.join(",");
			csvContent += dataString+ "\n";
		});

		var encodedUri = encodeURI(csvContent);
		
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");
document.body.appendChild(link); // Required for FF

link.click(); // This will download the data file named "my_data.csv".
	});
}