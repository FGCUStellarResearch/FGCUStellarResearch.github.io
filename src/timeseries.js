
function timeseries() {
    var myChart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1,0,4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
}