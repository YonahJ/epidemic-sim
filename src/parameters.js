
var chance_to_transmit = 50; //chance to transmit 
var time_to_recover = 7; //time to recover
var time_counter = 0;
var init_infected=1; //initaial infected number
var init_population=50;
var runningSimulation=false;
var speed = 4;
var MAX_INITIAL_POPULATION=1000;
var R0;

//social distancing vars
var sd_factor = 0;
var social_distancing = false;
//isolation var
var isolate_infected = false;
goHome=false;
var rdm = [];

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

    p1 =(75*init_population)/100;
    
    turns2=Math.round(p1)
    for(j=0; j<p1; j++){
        rdm.push(randomIntFromRange(0,init_population-1));
    }
    console.log(rdm);
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
    R0 = (chance_to_transmit/100)/(1/time_to_recover);
    document.getElementById("R0").innerHTML =  "R0  ≈ " + number_format(R0,2);
});

document.getElementById('infection_rate').value = chance_to_transmit;
document.getElementById('infection_rate_text').innerText = chance_to_transmit;

//Time to recover
document.getElementById('time_to_recover').addEventListener('change', function (e) {
    inputTimeToRecover = parseInt(this.value);
    time_to_recover = inputTimeToRecover;
    R0 = (chance_to_transmit/100)/(1/time_to_recover);
    document.getElementById("R0").innerHTML =  "R0  ≈ " + number_format(R0,2);
});

document.getElementById('time_to_recover').value = time_to_recover;


// social distancing 
document.getElementById('social_distancing').addEventListener('input', function (e) {
    social_distancing = this.checked;
    console.log('distancing',social_distancing);
});

document.getElementById('social_distancing').checked = social_distancing;

//Isolation
document.getElementById('isolate_infected').addEventListener('input', function (e) {
    isolate_infected = this.checked;
    console.log('isolation',isolate_infected);
});

document.getElementById('isolate_infected').checked = isolate_infected;

//go home
document.getElementById('go_home').addEventListener('input', function (e) {
    goHome = this.checked;
    console.log('go home is active',goHome);
});

document.getElementById('go_home').checked = goHome;




//Buttons
document.getElementById('control_start').addEventListener('click', function (e) {
    if (runningSimulation==false) {
        init()
        animate();
        updateChart();
        updateChartInterval = setInterval(updateChart, 1000);
        runningSimulation=true;
    } else {
        stopSimulation();
        resetChart()
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

