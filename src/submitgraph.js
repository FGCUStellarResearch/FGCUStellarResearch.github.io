
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