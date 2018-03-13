// Global Declarations
const DEFAULT_BIN_SIZE = 40;

function clearWindowVariables() {
    // resests all global (window) variables to defaults; called on button push and new file selection
    // NOTE: see notes on filehandler.js csvtojson() function re: globals
    // TODO: change away from globals? calculations made here are within the scope of the other 
    //       functions if they're using class variables, so do that and cleanup gets easier

}

function discreteFourierTransform(times, fluxes, freq) {
    var X = []; // our result if we ever get there omg this is really awful
    //performs the DFT on the original/detrended flux data
    var multiplier = 2 * Math.PI;
    // properly predefine the multiplier matrix because it's just gonna be a nightmare
    var dotMatrix = numeric.rep([freq.length, times.length],0);
    var W1 = numeric.rep([freq.length, times.length],0);
    var W2 = numeric.rep([freq.length, times.length],0);

    for (i = 0; i < freq.length; i++) {
        sumX1 = 0;
        sumX2 = 0;
        for (j = 0; j < times.length; j++) {
            // matrix multiplication and it's gross yo
            dotMatrix[i][j] = freq[i] * times[j] * multiplier;
            W1[i][j] = Math.cos(dotMatrix[i][j]);
            W2[i][j] = Math.sin(dotMatrix[i][j]);
            sumX1 += W1[i][j] * fluxes[j];
            sumX2 += W2[i][j] * fluxes[j];
        }
        // console.log(X.push(Math.sqrt(Math.pow(sumX1, 2) + Math.pow(sumX2, 2))));
        // use above to debug - it's an easy way to see how far into the loop you get. yes it's a print statement debug, fight me
        X.push(Math.sqrt(Math.pow(sumX1, 2) + Math.pow(sumX2, 2))); 
    }
    // one of the worst things I've ever done, really

    return X;
}

function calculateDetrend() {
    //placeholder
    tempFlux = targetFlux;
    tempTime = targetTime;
    meanFlux = math.mean(targetData);
    var binFlux;
    function removeOutlier(array) {
        return array.filter(element => math.abs(element) < 3 * tsStd)
    }

    var counter = 1; // the loop needs to run at least once
    while (counter > 0) {
        // create time bins
        binTime = numeric.linspace(tempTime[0],tempTime[tempTime.length - 1],DEFAULT_BIN_SIZE);
        binFlux = bindata(tempTime,tempFlux,binTime);

        // for loop to replace NaN's with the average flux
        // original did it differently, but this is more readable 
        for (i = 0; i < binFlux.avgBinFlux.length; i++) {
            if (numeric.isNaN(binFlux.avgBinFlux[i])) binFlux.avgBinFlux[i] = meanFlux;
        }

        pOut = numeric.spline(binTime,binFlux.avgBinFlux).at(tempTime);

        fluxesDFT = [];
        for (i = 0; i < tempFlux.length; i++) {
            fluxesDFT.push(tempFlux[i] - pOut[i]);
        }
        tsStd = math.std(fluxesDFT);

        
        // NOTE: javascript makes this condition a mess, because you're dealing with too many arrays
        //       it's possible it can be done more efficiently, but this seemed readable 
        checkTime = [];
        checkFlux = [];
        for (i = 0; i < tempTime.length; i++) {
            if (math.abs(fluxesDFT[i]) < (3*tsStd)) {
                checkTime.push(tempTime[i]);
                checkFlux.push(tempFlux[i]);
            }
        }
        counter = tempTime.length - checkTime.length;
        // what this ought to mean is that, if no elements are removed this loop as outliers, the loop ends (counter == 0)
        tempTime = checkTime;
        tempFlux = checkFlux;
    }

    pOut = numeric.spline(binTime,binFlux.avgBinFlux).at(targetTime);
    fluxesDFT = [];
    for (i = 0; i < targetFlux.length; i++) {
        fluxesDFT.push(targetFlux[i] - pOut[i]);
    }

    fDFTMean = nanmean(fluxesDFT);
    for (i = 0; i < fluxesDFT.length; i++) {
        if(isNaN(fluxesDFT[i])) {
            fluxesDFT[i] = fDFTMean;
        }
    }
    
    graphData = [];
    for (i = 0; i < pOut.length - 1; i++) {
        graphData.push([+targetTime[i],+pOut[i]]);
    }
    submit(graphData,'Time','Counts');

    return {
        targetTime: targetTime,
        fluxesDFT: fluxesDFT
    }

} // end of calculateDetrend


function calculateDFT() {
    // placeholder
    // Don't use FFT from numericJS package - probably makes bad assumptions
    alert("DFFT may take several seconds - Please be patient!");
    var frequency = numeric.linspace(0.0225, 1.0, 9775); // equivalent? to numpy: arange(0.0225,1.0,0.001)
    var whichFlux = (useDFT && (detrendedFlux.length > 0)) ? detrendedFlux: targetFlux;
    var powers = discreteFourierTransform(targetTime,whichFlux,frequency);
    graphData = [];
    for (i = 0; i < powers.length; i ++) {
        graphData.push([+frequency[i],+powers[i]]);
    }
    submit(graphData, 'Frequency', 'Power');
}

function detrend() {
    // calls calculateDetrend to do the heavy lifting math, then creates the format the
    // graphing extention needs to show the outcome
    var detrending = calculateDetrend();
    detrendedFlux = detrending.fluxesDFT;
    graphData = [];
    for (i = 0; i < detrending.targetTime.length - 1; i++) {
        graphData.push([+detrending.targetTime[i],+detrendedFlux[i]]);
    }
    submit(graphData,'Time','Counts');
}

function calculatePhase() {
    var phase = [];
    var time = targetTime;
    for (i = 0; i < time.length; i++) {
        phase.push((time[i]/phasePeriod) % 1);
    }
    var phaseTwo = [];
    for (i = 0; i < phase.length; i++) {
        phaseTwo.push(phase[i]+1);
    }

    if (useDFT && (detrendedFlux.length != 0)) {
        fluxesHere = detrendedFlux;
    }
    else { fluxesHere = targetFlux}

    // NOTE: these might be more efficiently done but this follows the standards for graphing already set
    graphData = [];
    for (i = 0; i < phase.length; i++) {
        graphData.push([+phase[i], +fluxesHere[i]]);
    }
    graphData2 = [];
    for (i = 0; i < phaseTwo.length; i++) {
        graphData2.push([+phaseTwo[i], +fluxesHere[i]]);
    }

    submitScatter(graphData,graphData2,'Phase', 'Counts');
}

function updatePhasePeriod(value) {
    phasePeriod = value;
    console.log("window.phaseFrequency is now: " + phasePeriod);
}

function updateUseDetrended() {
    useDFT = !useDFT;
    console.log("window.useDFT is now: ", useDFT);
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
    if (flux.length == 0) {console.log("Flux data all NaN's in bindata")}; 
    
    var binwidth = diff(gx);

    // hardcoding eps because javascript doesn't have an eps()[from MATLAB] 
    //     or spacing()[from Python->NumPy] equivalent;
    // all numbers (even integers) are represented as floats internally in javascript
    var eps = 2.2204e-16; // yes, this notation works; javascript is weird 

    var bins = [];
    bins.push(gx[0]-binwidth[0]/2);
    for (i = 0; i < binwidth.length; i++) { // defines the left-hand limit of the element by using the right-hand limit of the previous element
        bins.push(gx[i]+binwidth[i]/2);
    }
    bins.push(gx[gx.length-1]+binwidth[binwidth.length-1]/2); // define the right-hand limit of the last element

    // "Shift bins so the interval is '( ]' instead of '[ )' " <-- MATLAB implementation comment
    // bins[interval] becomes the original number plus the bigger of eps and eps * the abs value of the original number
    bins = bins.map(binInterval => binInterval + math.max(eps, (eps*math.abs(binInterval))));

    var histResults = histCount(time, flux, bins);
    histResults.bincounts.splice(0,1); // remove first; changes the size of the array
    histResults.avgBinFlux.splice(0,1); // remove first again; changes the size of the array
    /* NOTE: I spent several hours debugging this; the original python did a slice, then pop
        this ended up completely removing an entire bin and threw off all sorts of calculations
        because array sizes didn't match up properly. The first bin should always be empty from
        the way we find which bin things fall into - we look for the first index where the value
        in bins is greater than the time, therefore since bins[0] is smaller than the first time
        bins[1] is always the first element capable of being larger than time[0]
    */
    
    return {
        avgBinFlux: histResults.avgBinFlux,
        inds : histResults.inds
    }
}


// super simple helper function to calculate differences in adjacent elements - 
// MATLAB diff() equivalent; output array will always be one element smaller than input
function diff(inputArray) {
    var outputArray = [];
    for (i =0; i < (inputArray.length - 1); i++) {
        outputArray.push(math.abs(inputArray[i+1] - inputArray[i]));
    }
    return outputArray;
}


// NOTE: This is a bit messy, but there is no standard method (that I found) to implement
//     the binning and counting of MATLAB and NumPy (histc and digitize* respectively);
//     I went with the most readable solution, which may not be the most efficient or
//     sophisticated method; I saw one implementation use mappings and reduces, but
//     it was difficult to read and I'm not convinced it would have returned the same results
// *digitize doesn't do exactly the same thing as histc either, so there was a mess of python to compensate
// THIS FUNCTION RETURNS AN OBJECT - the easiest way for returning multiple arrays, especially different sizes
function histCount(times, flux, bins) {
    var inds = []; // same size as values (x); the index of the bin this time value belongs in
    var avgBinFlux = Array(bins.length).fill(0); // same size as bins(gx); the average flux value of this time bin
    var bincounts = Array(bins.length).fill(0); // same size as bins (gx); the number of flux values in this bin
    // NOTE: new Array() is heavily frowned on by javascript "standards" **BUT** in this case we
    //     really need it to exactly match the length of bins while being initially full of 0's;
    //     this is one of the few properly justified reasons for using new Array(), because we aren't
    //     ever testing length, or iterating through the elements; it's a strictly indexed counter

    for (i = 0; i < times.length; i++) {
        // find where bins[n] <= values[i] <= bins[n+1]; push the index and update the bincount
        inds.push(bins.findIndex(x => times[i] <= x));
        avgBinFlux[inds[i]] += flux[i];
        bincounts[inds[i]] += 1;
    }
    for (i = 0; i < avgBinFlux.length; i++) {
        avgBinFlux[i] = avgBinFlux[i]/bincounts[i];
    }
    return {
        inds: inds,
        bincounts: bincounts,
        avgBinFlux: avgBinFlux
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