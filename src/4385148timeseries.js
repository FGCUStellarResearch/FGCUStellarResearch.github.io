// TODO: update the non-sample timeseries to allow users to view the sample within 
//       the regular tool space instead of the sample window (which doesn't allow file uploads)
$.getJSON('./data/test4385148.json', function(data) {
        
    Highcharts.chart('container', {
        exporting: {
            chartOptions: { // specific options for the exported image
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                }
            },
            fallbackToExportServer: false
        },
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
                text: 'Time'
            },
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
            name: 'Sample Test Data - Kepler ID 4385148',
            data: data
        }]
    });

});
