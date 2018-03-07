// NOTE: in creating graphData before submitting, the unary operator '+' just makes sure that
//     the things being pushed to the array is, in fact, a number instead of a function or something
function submit(data,labelX,labelY) {

    Highcharts.chart('container', {

        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'AstroDev Webviewer'
            // there's supposed to be a way to change font family/weight, but it hasn't worked for me yet
        },
        subtitle: {
            text: document.ontouchstart === undefined ? 
                'Click and drag in the plot area to zoom in' : 
                'Pinch in the plot area to zoom in'
                // changes for which device is used to view
        },
        legend: {
            enabled: true
        },
        tooltip: {
            enabled: false
        },
        xAxis: {
            title: {
                text: labelX
            }
        },
        yAxis: {
            title: {
                text: labelY
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            
            name: targetSource + ' ID: ' + targetID,
            data: data
        }]
    });

    
}

function submitScatter(data, data2, labelX, labelY) {
    // placeholder
    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'AstroDev Webviewer'
            // there's supposed to be a way to change font family/weight, but it hasn't worked for me yet
        },
        subtitle: {
            text: document.ontouchstart === undefined ? 
                'Click and drag in the plot area to zoom in' : 
                'Pinch in the plot area to zoom in'
                // changes for which device is used to view
        },
        xAxis: {
            title: {
                enabled: true,
                text: labelX
            }
        },
        yAxis: {
            title: {
                text: labelY
            }
        },
        series: [{
            name: 'Phase 1',
            color: 'rgba(223, 83, 83, .5)',
            data: data
    
        }, {
            name: 'Phase 2',
            color: 'rgba(119, 152, 191, .5)',
            data: data2
        }]
    });
    
}