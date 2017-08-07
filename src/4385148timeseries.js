
$.getJSON('https://fgcustellarresearch.github.io/data/test4385148.json', function(data) {
        
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
            //type: 'datetime',
            title: {
                text: 'Cadence'
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
            //type: 'area',
            name: 'Sample Test Data - Kepler ID 4385148',
            data: data
        }]
    });

});
