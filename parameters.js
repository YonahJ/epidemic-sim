
var chance_to_transmit = 100; //chance to transmit 
var time_to_recover = 7; //time to recover
var time_counter = 0;
var init_infected=2; //initaial infected number
var init_population=30;
var runningSimulation=false;
var speed = 5;
var MAX_INITIAL_POPULATION=1000;
var people_stop = 0;
//social distancing vars
var sd_factor = 0;
var social_distancing = false;


statistics.totalPeople = init_population;
statistics.currentInfected = init_infected;
statistics.currentRecovered = 0;

//Dashboard control
//Initial population
document.getElementById('initial_population').addEventListener('change', function (e) {
    this.value = parseInt(this.value);
    inputInitialPopulation = this.value;
    if (inputInitialPopulation > MAX_INITIAL_POPULATION) {
        this.value = init_population;
        alert('The number is too high. Maximum value for initial population is ' + MAX_INITIAL_POPULATION);
    } else {
        init_population = inputInitialPopulation;
        statistics.totalPeople = init_population;
    
        lineGraph.options.scales.yAxes[0].ticks.max = parseFloat(init_population);
        lineGraph.update();
    }
});

document.getElementById('initial_population').value = init_population;

//Initial Infected
document.getElementById('initial_infected').addEventListener('change', function (e) {
    inputInitialInfected = parseInt(this.value);
    if (inputInitialInfected > init_population) {
        alert('Number of infected must be lower than the number of total people');
        this.value = initialInfected;
    } else {
        init_infected = inputInitialInfected;
    }

});

document.getElementById('initial_infected').value = init_infected;

// InfectioN rate or chance to transmit
document.getElementById('infection_rate').addEventListener('input', function (e) {
    chance_to_transmit = this.value;
    document.getElementById('infection_rate_text').innerHTML = Math.round(chance_to_transmit);
});

document.getElementById('infection_rate').value = chance_to_transmit;
document.getElementById('infection_rate_text').innerText = chance_to_transmit;

//Time to recover
document.getElementById('time_to_recover').addEventListener('change', function (e) {
    inputTimeToRecover = parseInt(this.value);
    time_to_recover = inputTimeToRecover;

});

document.getElementById('time_to_recover').value = time_to_recover;

//Speed
document.getElementById('speed_range').addEventListener('input', function (e) {
    speed=this.value;
    document.getElementById('speed_text').innerText= Math.round(speed);
});

document.getElementById('speed_range').value = speed;
document.getElementById('speed_text').innerText = speed;


//Stop people
document.getElementById('stop_range').addEventListener('input', function (e) {
    people_stop = this.value;
    stopMoving();
    document.getElementById('stop_text').innerHTML = Math.round(people_stop);
});

document.getElementById('stop_range').value = people_stop;
document.getElementById('stop_text').innerText = people_stop;

// social distancing 
document.getElementById('social_distancing').addEventListener('input', function (e) {
    social_distancing = this.checked;
});

document.getElementById('social_distancing').checked = social_distancing;

//Buttons
document.getElementById('control_start').addEventListener('click', function (e) {
    if (runningSimulation==false) {
        init()
        animate();
        updateChart();
        updateChartInterval = setInterval(updateChart, 1000);
    }
    
});

document.getElementById('control_stop').addEventListener('click', function (e) {
    stopSimulation();
    resetChart();
});