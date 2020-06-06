/*
    Younes JEDDI
    PFE : Propagatio Vs Confinement
    Projet PFE
    SIR -2019/2020-  
*/

var lineGraph;
myVar = setTimeout(10000000000);
//added
var area_canvas = document.getElementById("area_chart");
var area_ctx = area_canvas.getContext("2d");


cw = area_canvas.width-100//envronment width
ch = area_canvas.height //canvas height

h=0;
w=0;

R0 = (chance_to_transmit/100)/(1/time_to_recover);
document.getElementById("R0").innerHTML =  "R0  ≈ " + number_format(R0,2);

p1 =(75*init_population)/100;
    
    turns2=Math.round(p1)
    for(j=0; j<p1; j++){
        rdm.push(randomIntFromRange(0,init_population-1));
    }
    console.log(rdm);

function distance(x1,y1,x2,y2) {
  //Calculer la distance entre 2 particule en utilisant le théorème de Pythagore
  let xDistance = x2-x1;
  let yDistance = y2-y1;

  return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
}
//Utility 
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function number_format(val, decimals){
  //Parse the value as a float value
  val = parseFloat(val);
  //Format the value w/ the specified number
  //of decimal places and return it.
  return val.toFixed(decimals);
}

function summary_count(data, query) {
  var result = 0;
  for (i = 0; i < data.length; i++) {
      var obj = data[i];
      if (obj.color == query) {
          result++;
      }
  }
  return result;
}

//Physics of : elastic collision and One-dimensional Newtonian equation 
function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      // l'arc tangente
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
  }
}

let isolation = [];  //isolation array


// Object
function Circle(x, y, radius, color, id) {
    this.id = id;
    this.timer =0;
    this.turns=0;
    this.x = x;
    this.y = y;
    this.cSpeed = speed;
    this.velocity= {
      //speed of our particules 
      x: (Math.random() )*this.cSpeed,
      y: (Math.random() )*this.cSpeed
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;

  this.draw = function () {
    area_ctx.beginPath()
    area_ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    area_ctx.strokeStyle = this.color
    area_ctx.stroke()
    area_ctx.closePath()
  };

  this.update = circles => {
    this.draw()
    
    if(social_distancing){
      if(init_population>=600){
        sd_factor=10;
      } else if(init_population>=300 && init_population<600){
        sd_factor=20;
      } else {
        sd_factor= 70;
      }
    
      for (let i = 0; i < circles.length; i++) {
        if (distance(this.x, this.y, circles[i].x,circles[i].y)-this.radius*2<sd_factor) {
          resolveCollision(this,circles[i]); 
         }
      }
    }


    if(isolate_infected && this.timer==1) {
      if(Math.random() * 100 < 50){
        if(this.color == "red" && this.turns == 0) {
          this.x = randomIntFromRange(cw+radius,cw+100-radius);
          this.y = randomIntFromRange(radius,ch-radius);
          this.turns=1;
        }
      }   
      if(this.color!="red" && this.turns == 1) {
            this.x = randomIntFromRange(radius,cw-radius);
            this.y = randomIntFromRange(radius,ch-radius);
            this.turns=2
            if(this.x-this.radius<=w || this.x+this.radius>=cw){
              this.velocity.x=-this.velocity.x;
            }
            if(this.y-this.radius<=h || this.y+this.radius>=ch){
              this.velocity.y=-this.velocity.y;
            }
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            
          } 

        if (this.color!="red" && (this.turns == 0 || this.turns == 2) ) {
          if(this.x-this.radius<=w || this.x+this.radius>=cw){
            this.velocity.x=-this.velocity.x;
          }
          if(this.y-this.radius<=h || this.y+this.radius>=ch){
            this.velocity.y=-this.velocity.y;
          }
          this.x += this.velocity.x;
          this.y += this.velocity.y;
        }
    } else {

      if(this.x-this.radius<=w || this.x+this.radius>=cw){
        this.velocity.x=-this.velocity.x;
      }
      if(this.y-this.radius<=h || this.y+this.radius>=ch){
        this.velocity.y=-this.velocity.y;
      }
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
      
    


    for (let i = 0; i < circles.length; i++) {
      if(this === circles[i]) continue;

      if (distance(this.x, this.y, circles[i].x,circles[i].y)-this.radius*2<0) { 
        transmit_infection(this,circles[i]);   
      }
      
    }
    if(goHome) {
      if(rdm.includes(this.id)) {
        this.velocity.x=0;
        this.velocity.y=0;
      }
    }
      

   
  };
}//End of function Circle

// Implementation
let circles;

function recover(circle) {
  circle.color = "green";
}
function isolate(circle) {
  circle.timer = 1;
}

function transmit_infection(c1, c2) {
  //tranmit infectio to others when colliding
  if (c1.color !== "green" && c2.color !== "green") {
      if (c1.color == "red" || c2.color == "red") {
          if (Math.random() * 100 < chance_to_transmit) {
              c1.color = "red";
              c2.color = "red";
              setTimeout(recover, time_to_recover * 1000, c1);
              setTimeout(recover, time_to_recover * 1000, c2);
              setInterval(isolate, 3000, c1);
              setInterval(isolate, 3000, c2)

          }
      }
  }
}


function init() {
  circles = [];
  for (let i = 0; i < init_population; i++) {
    //Creating circles i -> nunmber of circles we want
    id=i;
    const radius = 3;
    let x = randomIntFromRange(radius,cw-radius);
    let y = randomIntFromRange(radius,ch-radius);

    let color;
    color="blue";
    /*if (i == 1) {
      color = "red";
      setTimeout(recover, time_to_recover * 1000, circles[1])
    } else {
      color = "blue";
    }*/

    if (i !== 0) {
      for (let j = 0; j < circles.length; j++) {
        if (distance(x, y, circles[j].x,circles[j].y)-radius*2<0) {
          x = randomIntFromRange(radius,cw-radius);
          y = randomIntFromRange(radius,ch-radius);
          j=-1;
        }        
      }
    }
     circles.push(new Circle(x,y,radius,color,id));
  }

  //This allows the user to choose the intial infected number
  
  for (let i = 0; i <= init_infected-1; i++) {
    circles[i].color="red";    
    setTimeout(recover, time_to_recover * 1000, circles[i]);
    setInterval(isolate, 3000, circles[i])
  }
  area_ctx.moveTo(cw, 0);
  area_ctx.lineTo(cw, ch);
  area_ctx.stroke();
}

// Animation Loop
function stopSimulation() {
  circles=[];
  statistics.reset(); 
}


function updateAnimationFrame() {
  cancelAnimationFrame(requestAnimationFrameCall);
  requestAnimationFrameCall = requestAnimationFrame(updateAnimationFrame);
}


function animate() {
  requestAnimationFrame(animate)
  area_ctx.clearRect(0, 0,cw+100, ch)
  area_ctx.moveTo(cw, 0);
  area_ctx.lineTo(cw, ch);
  area_ctx.stroke(); 
  //area_ctx.scrollPathIntoView();
   circles.forEach(circle => {
     circle.update(circles);
   });

   //area_ctx.strokeStyle = "black";

  infected_count = summary_count(circles, "red");
  healthy_count = summary_count(circles, "blue");
  recovered_count = summary_count(circles, "green");
  statistics.totalPeople = init_population;
  statistics.currentInfected = infected_count;
  statistics.currentRecovered = recovered_count;
  statistics.currentHealthy=healthy_count;

//added
    /*area_ctx.fillStyle = "blue";
    area_ctx.fillRect(time_counter / 2, 0, 1, healthy_count);
    area_ctx.transform(1, 0, 0, -1, 0, ch);
    area_ctx.fillStyle = "green";
    area_ctx.fillRect(
        time_counter / 2,
        0,
        1,
        recovered_count + infected_count
    );
    area_ctx.fillStyle = "red";
    area_ctx.fillRect(time_counter / 2, 0, 1, infected_count);
    area_ctx.transform(1, 0, 0, -1, 0, ch);*/
   
}


