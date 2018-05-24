// NOTE: in creating graphData before submitting, the unary operator '+' just makes sure that
//     the thing being pushed to the array is, in fact, a number instead of a function or something
function submit(data,labelX,labelY) {

    Highcharts.chart('container', {

        chart: {
            zoomType: 'x',
            marginTop: 100,
            marginRight: 50
        },
        mapNavigation: {
            enabled: true,
            enableButtons: false
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
            enabled: true,
            useHtml: true,
            pointFormat:'<tr><td style="color: {series.color}">' + labelY + ': </td>' + '<td style="text-align: right"><b>{point.y} </b></td></tr>'
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
        legend: {
            // labelFormatter: function () {
            //     return this.name
            // }, 
            layout: 'vertical',
            align: 'center',
            title: {
                text: 'Median Flux: ' + round(medianFlux, 1) + '<br/>Estimated Noise: ' + round((getNoise() * 1000000), 0) + 'ppm'
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
            name: 'EPIC ' + targetID, // targetSource +  <= in case we get to a point where multiple input sources are being used
            data: data
        }],


        // the following was taken from a stackoverflow and so the code formatting is broken but the output looks good so ¯\_(ツ)_/¯
        exporting: {
            sourceWidth: 1250,
            sourceHeight: 400,
            buttons: {
                contextButton: {
                    menuItems: [{
                    textKey: "printChart",
                    onclick: function () {
                        var titulo = this.options.subtitle.text;
                        this.setTitle(null, { text: ' ' });
                        this.print();
                        this.setTitle(null, { text: titulo });
                    },
                },
                {
                    separator:	true
                },	
                {
                        text: 'Export to PNG',
                        onclick: function() {
                            this.exportChart({
                                type: "image/png"
                            }, {
                                title: {
                                    text: ''
                                },
                                subtitle: {
                                    text: ''
                                }});
                        },
                        separator: false
                    }, {
                textKey: "downloadJPEG",
                onclick: function() {
                    this.exportChart({
                        type: "image/jpeg"
                    }, {
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        }
                    });
                }
            }, {
                textKey: "downloadPDF",
                onclick: function() {
                    this.exportChart({
                        type: "application/pdf"
                    }, {
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        }
                    });
                }
            }, {
                textKey: "downloadSVG",
                onclick: function() {
                    this.exportChart({
                        type: "image/svg+xml"
                    }, {
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        }
                    });
                }
                        
                        
                        
                    }]
                }
            }
        }
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
        legend: {
            // labelFormatter: function () {
            //     return this.name
            // }, 
            layout: 'vertical',
            align: 'center',
            title: {
                text: 'Median Flux: ' + round(medianFlux, 1) + '<br/>Estimated Noise: ' + round((getNoise() * 1000000), 0) + 'ppm'
            }
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
            showInLegend: false,
            name: 'Phase',
            color: 'rgba(223, 83, 83, .5)',
            marker: {
                symbol: 'circle'
            },
            data: data
    
        }, {
            showInLegend: false,
            name: 'Phase 2',
            color: 'rgba(223, 83, 83, .5)',
            marker: {
                symbol: 'circle'
            },
            data: data2
        }],


        // the following was taken from a stackoverflow and so the code formatting is broken but the output looks good so ¯\_(ツ)_/¯
        exporting: {
            sourceWidth: 1250,
            sourceHeight: 400,
            buttons: {
                contextButton: {
                    menuItems: [{
                    textKey: "printChart",
                    onclick: function () {
                        var titulo = this.options.subtitle.text;
                        this.setTitle(null, { text: ' ' });
                        this.print();
                        this.setTitle(null, { text: titulo });
                    },
                },
                {
                    separator:	true
                },	
                {
                        text: 'Export to PNG',
                        onclick: function() {
                            this.exportChart({
                                type: "image/png"
                            }, {
                                title: {
                                    text: ''
                                },
                                subtitle: {
                                    text: ''
                                }});
                        },
                        separator: false
                    }, {
                textKey: "downloadJPEG",
                onclick: function() {
                    this.exportChart({
                        type: "image/jpeg"
                    }, {
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        }
                    });
                }
            }, {
                textKey: "downloadPDF",
                onclick: function() {
                    this.exportChart({
                        type: "application/pdf"
                    }, {
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        }
                    });
                }
            }, {
                textKey: "downloadSVG",
                onclick: function() {
                    this.exportChart({
                        type: "image/svg+xml"
                    }, {
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        }
                    });
                }
                        
                        
                        
                    }]
                }
            }
        }
    });
    
}