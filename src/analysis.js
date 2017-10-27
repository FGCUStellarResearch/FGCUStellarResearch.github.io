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
    // constant type:
    var constReturn = targetFlux - (mean(targetFlux));
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