

var counters = {
    healthy: document.getElementById('total_susceptible'),
    infected: document.getElementById('total_infected'),
    immune: document.getElementById('total_recovered')
}

var statistics = {
    reset: function() {
        this.totalPeople = init_population;
        this.currentCured = 0;
        this.currentInfected = init_infected;
    },

    /* Total people */
    get totalPeople() {
        return this._totalPeople;
    },
    set totalPeople(value) {
        this._totalPeople = value;
        counters.healthy.innerHTML = this.currentHealthy;
    },

    /* Current infected */
    get currentInfected() {
        return this._currentInfected;
    },
    set currentInfected(value) {
        this._currentInfected = value;
        counters.infected.innerHTML = this._currentInfected;
        counters.healthy.innerHTML = this.currentHealthy;
    },
    
    /* Current cured */
    get currentCured() {
        return this._currentCured;
    },
    set currentCured(value) {
        this._currentCured = value;
        counters.immune.innerHTML = this._currentCured;
        counters.healthy.innerHTML = this.currentHealthy;
    },

    /* Current healthy */
    get currentHealthy() {
        return this._totalPeople - this._currentInfected - this.currentCured;
    },
}