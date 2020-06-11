//using chart.js
var updateChartInterval;
var elapsedDays = 0;
var COLORS = {
    circles: {
        susceptible: {
            fill: '#FFFFFF',
            stroke: 'blue',
        },
        infected: {
            fill: '#FF0000',
            stroke: 'red',
        },
        recovered: {
            fill: '#00FFE7',
            stroke: 'green',
        }
    },
}

var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Susceptible',
            borderColor: COLORS.circles.susceptible.stroke,
            data: [],
            fill: '-1',
        }, {
            label: 'Recovered',
            fill: 'end',
            borderColor: COLORS.circles.recovered.stroke,
            data: [],
            fill: '-1',
        }, {
            label: 'Infected',
            fill: 'end',
            borderColor: COLORS.circles.infected.stroke,
            data: [],
            fill: '-1',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Days'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Number of people'
                },
                ticks: {
                    suggestedMax: init_population,
                },
                stacked: false
            }]
        },
        annotation: {
          annotations: []
        }
    }
};




window.onload = function () {
    var ctx = document.getElementById('chart').getContext('2d');
    lineGraph = new Chart(ctx, config);
};

function resetChart() {
    config.data.labels = [];
    config.data.datasets[0].data = [];
    config.data.datasets[1].data = [];
    config.data.datasets[2].data = [];
    elapsedDays = 0;
    if (updateChartInterval) {
        clearInterval(updateChartInterval);
    }
    updateChart();
}

function pushData(total_healthy, total_infected, total_cured) {
    config.data.labels.push(elapsedDays++);
    config.data.datasets[0].data.push(total_healthy);
    config.data.datasets[1].data.push(total_cured);
    config.data.datasets[2].data.push(total_infected);

    lineGraph.update();
}

function updateChart() {
    pushData(statistics.currentHealthy, statistics.currentInfected, statistics.currentRecovered);

    if (statistics.currentInfected === 0) {
        clearInterval(updateChartInterval);
    }
}