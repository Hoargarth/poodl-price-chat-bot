import moment from 'moment';
import 'moment-timezone';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import 'chartjs-adapter-moment';

export default class ChartDrawer {
    constructor() {
        this.width = 1000;
        this.height = 600;

        moment.tz.setDefault("UTC");
    }

    async renderPriceChart(chartData) {
        return new Promise(resolve => {

            // this config somehow does not want to be global :(
            const chartConfig = {
                type: 'line',
                //plugins: [this.bgImagePlugin],
                data: {
                    labels: [],
                    datasets: [{
                        label: '# of #',
                        data: [],
                        backgroundColor: 'rgba(245, 74, 0, 1)',
                        borderColor: 'rgba(245, 74, 0, 1)',
                        borderWidth: 3,
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4,
                        fill: false
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            font: {
                                weight: 'bold',
                                size: 30
                            },
                        },
                        legend: {
                            display: false
                        },
                    },
                    layout: {
                        padding: 25
                    },
                    elements: {
                        point:{
                            radius: 0
                        }
                    },
                    scales: {
    
                    }
                }
            };

            const priceChartCanvas = new ChartJSNodeCanvas({ 
                width: this.width,
                height: this.height,
                plugins: {
                    globalVariableLegacy: ['chartjs-adapter-moment']
                } 
            });

            const presentHours = [];

            chartData.forEach(priceData => {
                let priceDate = moment(priceData[0]);

                chartConfig.data.labels.push(priceDate);
                chartConfig.data.datasets[0].data.push(priceData[1]);
            });

            // configs
            chartConfig.data.datasets.label = 'POODL / USD Price';

            chartConfig.options.plugins.title.text = ['POODL / USD Price since a day ago','(Includes DEX and CEX data)'];            

            chartConfig.options.scales.x = {
                type: 'time',
                time: {
                    displayFormats: {
                        hour: 'HH'
                    },
                    stepSize: 2,
                    parser: function(date) {
                        return moment(date).utcOffset('+0000');
                    }
                },
                ticks: {
                    font: {
                        size: 28
                    }
                }
            };

            chartConfig.options.scales.y = {
                position: 'right',
                ticks: {
                    font: {
                        size: 28
                    },
                    callback: function(value, index, values) {
                        return value.toPrecision(3);
                    }
                }
            }

            // render teh chart
            const chartBufferPromise = priceChartCanvas.renderToBuffer(chartConfig, 'image/png');
            chartBufferPromise.then(buffer => {
                resolve(buffer);
            });
        })
    }
}