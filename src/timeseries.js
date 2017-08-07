
function timeseries() {
    var myChart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'AstroDev Webviewer'
        },
        subtitle: {
            text: document.ontouchstart === undefined ? 
                'Click and drag in the plot area to zoom in' : 
                'Pinch in the plot area to zoom in'
                // changes for which device is used to view
        },
        xAxis: {
            type: 'linear',
            title: {
                text: 'Cadence'
            },
        },
        yAxis: {
            title: {
                text: 'Flux'
            }
        },
        data: {
            csv: document.getElementById('csv').innerHTML
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        series: {
            name: 'Sample Test Data - Kepler ID 4385148'
        }
    });
}