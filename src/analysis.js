function clearWindowVariables() {
    // resests all global (window) variables to defaults; called on button push and new file selection
    // NOTE: see notes on filehandler.js csvtojson() function re: globals
    // TODO: change away from globals; calculations made here are within the scope of the other 
    //       functions if they're using class variables, so do that and cleanup gets easier

}

function discreteFastFourier(times, fluxes, freq) {
    //placeholder
    var shape = freq.length;
    var xMean = Math.sum(fluxes) / fluxes.length;
    //x = 
}

function calculateDetrend() {
    //placeholder
    tempFlux = targetFlux;
    dataFlux = targetFlux;
    tempTime = targetTime;
    meanFlux = math.mean(targetData);
    var binFlux;
    function tester(element) {
        return Math.abs(element) > 3 * tsStd
    }

    counter = tempTime.length;
    while (counter > 0) {
        // create time bins
        binTime = numeric.linspace(tempTime[0],tempTime[tempTime.length - 1],40);
        binFlux = bindata(tempTime,tempFlux,binTime);

        // for loop to replace NaN's with the average flux
        // original did it differently, but this is more readable 
        for (i = 0; i < binFlux.b.length; i++) {
            if (numeric.isNaN(binFlux.b[i])) binFlux.b[i] = meanFlux;
        }

        pOut = numeric.spline(binTime,binFlux.b).at(numeric.linspace(binTime[0],binTime[binTime.length - 1],40));

        fluxesDFT = [];
        for (i = 0; i < pOut.length; i++) {
            fluxesDFT.push(tempFlux[i] - pOut[i]);
        }
        tsStd = math.std(fluxesDFT);

        counter = fluxesDFT.findIndex(tester); // returns -1 when finished, exiting while loop
        
        // NOTE: javascript makes this condition a mess, because you're dealing with too many arrays
        //       it's possible it can be done more efficiently, but this seemed readable 
        temp = [];
        for (i = 0; i < tempTime.length; i++) {
            if (Math.abs(fluxesDFT[i]) < (3*tsStd)) {
                temp.push(tempTime[i]);
            }
        }
        tempTime = temp;
        tempFlux = fluxesDFT.filter(fluxes => Math.abs(fluxes) < (3*tsStd));
    }

    pOut = numeric.spline(binTime,binFlux.b).at(numeric.linspace(binTime[0],binTime[binTime.length - 1], 40));
    fluxesDFT = [];
    for (i = 0; i < dataFlux.length; i++) {
        fluxesDFT.push(dataFlux[i] - pOut[binFlux.inds[i]]);
    }

    fDFTMean = nanmean(fluxesDFT);
    for (i = 0; i < fluxesDFT.length; i++) {
        if(isNaN(fluxesDFT[i])) {
            fluxesDFT[i] = fDFTMean;
        }
    }

    return {
        targetTime: targetTime,
        fluxesDFT: fluxesDFT
    }

} // end of calculateDetrend


function calculateDFT() {
    // placeholder
    // Don't use FFT from numericJS package - probably makes bad assumptions
    alert("DFFT may take a few seconds!");
    var frequency = _.range(0.0225, 1.0, 0.001);
}

function detrend() {
    // calls calculateDetrend to do the heavy lifting math, then creates the format the
    // graphing extention needs to show the outcome
    var detrending = calculateDetrend();
    graphData = [];
    for (i = 0; i < detrending.targetTime.length - 1; i++) {
        graphData.push([+detrending.targetTime[i],+detrending.fluxesDFT[i]]);
    }
    submit(graphData,'Time','Counts');
}

function calculatePhase() {
    // placeholder
}

function calculateBLS() {
    //placeholder
}

function timeseries() {
    // TODO: needs to be able to handle recognizing and using either the results of the DFT or raw?
    //if (useDFT == true) {
        // use fluxes as calculated from DFT
        // ask why AD uses this in the DFT call - you can do the DFT on the DFT??
    //}
    submit(targetData,'Time','Counts');
}


// NOTES: bindata based on Python AstroDev and MATLAB implementations - 
//        does not perfectly reflect either bindata function, but maintains
//        some qualities of both, largely based on which version
//        fits with the Javascript language features best;
//        Assumes 1D inputs, since the calling code only handles that format
function bindata(x,y,gx) {
    // Try to create copies of y and x where y[i] != NaN
    // javascript arrays act like stacks, so we're pushing
    var time = [];
    var flux = [];
    for (i = 0; i < y.length; i++ ) {
        if (!numeric.isNaN(y[i])) {
            time.push(x[i]);
            flux.push(y[i]);
        }
    }
    // simple error handling; this might signal corrupted data... TODO: better handling
    if (time.length == 0) {console.log("Flux data all NaN's in bindata")}; 
    
    var binwidth = diff(gx);

    // hardcoding eps because javascript doesn't have an eps()[from MATLAB] 
    //     or spacing()[from Python->NumPy] equivalent;
    // all numbers (even integers) are represented as floats internally in javascript
    var eps = 2.2204e-16; // yes, this notation works; javascript is weird 

    var bins = [];
    bins.push(gx[0]-binwidth[0]/2);
    for (i = 1; i < gx.length-1; i++) {
        bins.push(gx[i]+binwidth[i]/2);
    }
    bins.push(gx[gx.length-1]); // otherwise there aren't enough bins?

    // "Shift bins so the interval is '( ]' instead of '[ )' " <-- MATLAB implementation comment
    bins = bins.map(x => x + math.max(eps, (eps*math.abs(x))));

    var histResults = histCount(x, bins);
    histResults.bincounts.splice(0,1); // remove first ...
    histResults.bincounts.pop(); // & last bins; changes the size of the array
    /* NOTE: I spent a few hours debugging this initially; unlike in some other languages, you
             *cannot* have this as a single line function - that is, you must first slice, then pop
             specifically: array.splice().pop()  will only splice(), and the pop() will not happen
    */
    
    // This following section is translated directly from Python AstroDev; there are no comments 
    //     because I'm not entirely certain what the intermediate steps do, just their final result
    var b = [];
    var counterBin = 0;
    for (i = 0; i < 40; i++) {
        var sumTemp = [];
        var tempBinArr = [];
        counterR = 0;
        histResults.inds.forEach(function(element) {
            if (element == i) {
                tempBinArr.push(y[counterR]);
            }
            counterR++;
        });
        sumTemp = tempBinArr.reduce((a, b) => a + b, 0);
        b.push(sumTemp/histResults.bincounts[counterBin]);
        counterBin++;
    }
    return {
        b: b,
        inds : histResults.inds
    }
}


// super simple helper function to calculate differences in adjacent elements - 
// MATLAB diff() equivalent; output array will always be one element smaller than input
function diff(inputArray) {
    var outputArray = [];
    for (i =0; i < (inputArray.length - 1); i++) {
        outputArray.push(inputArray[i+1] - inputArray[i]);
    }
    return outputArray;
}


// NOTE: This is a bit messy, but there is no standard method (that I found) to implement
//     the binning and counting of MATLAB and NumPy (histc and digitize* respectively);
//     I went with the most readable solution, which may not be the most efficient or
//     sophisticated method; I saw one implementation use mappings and reduces, but
//     it was difficult to read and I'm not convinced it would have returned the same results
// *digitize doesn't do exactly the same thing as histc either, so there was a mess of python to compensate
// THIS FUNCTION RETURNS AN OBJECT - the best way for returning multiple arrays, especially different sizes
function histCount(values, bins) {
    // 
    var inds = []; // same size as values (x); the index of the bin this value belongs in
    var bincounts = Array(bins.length).fill(0); // same size as bins (gx); the number of values in this bin
    // NOTE: new Array() is heavily frowned on by javascript "standards" **BUT** in this case we
    //     really need it to exactly match the length of bins while being initially full of 0's;
    //     this is one of the few properly justified reasons for using new Array(), because we aren't
    //     ever testing length, or iterating through the elements; it's a strictly indexed counter

    for (i = 0; i < values.length; i++) {
        // find where bins[n] <= values[i] <= bins[n+1]; push the index and update the bincount
        inds.push(bins.findIndex(x => values[i] <= x));
        bincounts[inds[i]] += 1;
    }
    return {
        inds: inds,
        bincounts: bincounts
    }
}


// simple helper funtion to calculate means while ignoring NaN's
function nanmean(input) {
    var mean = 0;
    var count = 0;
    var sum = 0;
    for (i = 0; i < input.length; i++) {
        if (!isNaN(input[i])) {
            count++;
            sum += input[i];
        }
    }
    mean = sum / count;
    return mean;
}