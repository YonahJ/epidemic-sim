/*
  Younes JEDDI
  PFE : Propagatio Vs Confinement
  SIR -2019/2020-
  
*/

var lineGraph;
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')




//added
var area_canvas = document.getElementById("area_chart");
var area_ctx = area_canvas.getContext("2d");


cw = canvas.width //canvas width
ch = canvas.height //canvas height



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


// Objects
function move() {
  return speed;
}
function Circle(x, y, radius, color) {
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
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.strokeStyle = this.color
    c.fillStyle = this.color
    c.stroke()
    c.fill()
    c.closePath()
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
    }else {
      sd_factor = 0;
    }


    for (let i = 0; i < circles.length; i++) {
      if(this === circles[i]) continue;

      if (distance(this.x, this.y, circles[i].x,circles[i].y)-this.radius*2<sd_factor) {
        resolveCollision(this,circles[i]); 
      }

      if (distance(this.x, this.y, circles[i].x,circles[i].y)-this.radius*2<0) { 
        transmit_infection(this,circles[i]);   
      }
      
    }

    if(this.x-this.radius<=0 || this.x+this.radius>=cw){
      this.velocity.x=-this.velocity.x;
    }
    if(this.y-this.radius<=0 || this.y+this.radius>=ch){
      this.velocity.y=-this.velocity.y;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };
}

// Implementation
let circles;

function recover(circle) {
  circle.color = "green";
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

function transmit_infection(c1, c2) {
  //tranmit infectio to others when colliding
  if (c1.color !== "green" && c2.color !== "green") {
      if (c1.color == "red" || c2.color == "red") {
          if (Math.random() * 100 < chance_to_transmit) {
              c1.color = "red";
              c2.color = "red";
              setTimeout(recover, time_to_recover * 1000, c1);
              setTimeout(recover, time_to_recover * 1000, c2);

          }
      }
  }
}


function init() {
  circles = [];
  for (let i = 0; i < init_population; i++) {
    //Creating circles i -> nunmber of circles we want
    const radius = 2;
    let x = randomIntFromRange(radius,canvas.width-radius);
    let y = randomIntFromRange(radius,canvas.height-radius);

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
          x = randomIntFromRange(radius,canvas.width-radius);
          y = randomIntFromRange(radius,canvas.height-radius);
          j=-1;
        }        
      }
    }
     circles.push(new Circle(x,y,radius,color));
  }

  //This allows the user to choose the intial infected number
  
  for (let i = 0; i <= init_infected-1; i++) {
    circles[i].color="red";    
    setTimeout(recover, time_to_recover * 1000, circles[i]);
  }

}

// Animation Loop
function stopSimulation() {
  circles=[];
  statistics.reset();    
}

function stopMoving() {
  y=(people_stop*init_population)/100; //persentage of persons that should stop*init_pop
  z=Math.round(y); //people that should stop moving
  console.log(y);
  for (let i = 0; i < z; i++) {
    circles[i].cSpeed=0;
  }
}


function updateAnimationFrame() {
  cancelAnimationFrame(requestAnimationFrameCall);

  requestAnimationFrameCall = requestAnimationFrame(updateAnimationFrame);
}

function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
   circles.forEach(circle => {
     circle.update(circles);
   });

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
    area_ctx.transform(1, 0, 0, -1, 0, area_canvas.height);
    area_ctx.fillStyle = "green";
    area_ctx.fillRect(
        time_counter / 2,
        0,
        1,
        recovered_count + infected_count
    );
    area_ctx.fillStyle = "red";
    area_ctx.fillRect(time_counter / 2, 0, 1, infected_count);
    area_ctx.transform(1, 0, 0, -1, 0, area_canvas.height);*/
   
}


