
function timeseries(targetID,targetSource) {

    Highcharts.chart('container', {
        exporting: {
            chartOptions: { // specific options for the exported image
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                }
            },
            fallbackToExportServer: false
        },
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
        legend: {
            enabled: true
        },
        tooltip: {
            enabled: false
        },
        xAxis: {
            
            title: {
                text: 'Time'
            }
        },
        yAxis: {
            title: {
                text: 'Flux'
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
            data: targetData
        }]
    });
}

function addNewData(chart,targetData) {
    chart.series[0].setData(targetData);
    chart.xAxis[0].min = targetData[0][0];
    chart.xAxis[0].isDirty = true;
    chart.redraw();
}