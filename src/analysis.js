function clearWindowVariables() {
    // resests all global (window) variables to defaults; called on button push and new file selection
    // TODO: there's no reason the variables need to be global; calculations made here are within the scope
    //        of the other functions if they're using class variables, so do that and cleanup gets easier

}

function discreteFastFourier() {
    //placeholder
    // Don't use FFT from numericJS package - probably makes bad assumptions
    alert("DFFT may take a few seconds!");
    var frequency = _.range(0.0225, 1.0, 0.001);


}

function detrend() {
    //placeholder
    tempFlux = targetFlux;
    tempTime = targetTime;
    meanFlux = mean(targetData);

    counter = tempTime.length;
    while (counter > 0) {
        // create time bins
        binTime = numeric.linspace(tempTime[0],tempTime[tempTime.length - 1],40);
        binFlux = bindata(tempTime,tempFlux,binTime);

        // for loop to replace NaN's with the average flux
        // original did it differently, but this is more readable 
        for (var i=0; i<binFlux.length; i++) {
            if (numeric.isNaN(binFlux[i])) binFlux[i] = meanFlux;
        }

        pflux = numeric.spline(tempTime,tempFlux).at(numeric.linspace(tempTime[0],tempTime[tempTime.length - 1],40))
    }


    var constReturn = targetFlux - (mean(targetFlux));
    console.log(constReturn);
    //var
}

function calculateDetrend() {
    //placeholder

}

function calculatePhase() {
    // placeholder
}

function calculateBLS() {
    //placeholder
}

function timeseries() {
    // placeholder
    // TODO: needs to be able to handle using the results of the DFT in the future
    if (useDFT == true) {
        // use fluxes as calculated from DFT
        // ask why AD uses this in the DFT call - you can do the DFT on the DFT??
    }
    var labels = ['Time','Counts'];
    submit(targetData);
}

function bindata() {
    // placeholder
}