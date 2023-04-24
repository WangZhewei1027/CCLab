let particles = [];
let layers = 0;
let sound = [];

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  background(0);

  //noCursor();

  mic = new p5.AudioIn();
  mic.start();
}

function mouseDragged() {
  //
}

function mousePressed() {
  for (let i = 1; i <= 10; i++) {
    particles.push(new Particle(mouseX, mouseY, 98, 205, 255));
  }
  layers += 1;
}

function draw() {
  background(0, 20);
  micLevel = mic.getLevel();

  push();
  stroke(255);
  strokeWeight(0.1);
  fill(0, 0);
  circle(width / 2, height / 2, map(micLevel, 0, 0.2, 500, 2000));
  pop();

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let p2 = particles[i + 1];
    if (i < particles.length - 1) {
      push();
      stroke(255);
      strokeWeight(0.5);
      //line(p.x, p.y, p2.x, p2.y);
      pop();
    }
    p.centralForce(width / 2, height / 2, 400);

    p.repelledFrom(mouseX, mouseY, 75);

    p.repelledFrom(height / 2, width / 2, micLevel * 3000);
    //p.hp = p.hp * 0.9995;
    for (let j = 0; j < particles.length; j++) {
      if (i != j) {
        a = particles[j].x;
        b = particles[j].y;
        p.repelledFrom(a, b, 13);
        if (dist(a, b, p.x, p.y) < 14) {
          p.friends += 1;
        }
      }
    }

    p.move();
    p.slowDown();
    p.bounce();
    p.display();

    //console.log(p.friends);

    if (p.friends < 1) {
      p.hp = p.hp * 0.99;
    } else if (p.friends >= 6) {
      p.hp = p.hp * 0.99;
    } else {
      if (Math.floor(random(0, particles.length * 12)) == 1) {
        particles.push(new Particle(p.x, p.y, 170, 119, 255));
      }
    }

    p.friends = 0;

    if (p.hp < 5) {
      particles.splice(i, 1);
      if (Math.floor(random(0, 5)) == 1) {
        particles.push(new Particle(p.x, p.y, 255, 191, 155));
      }
    }

    push();
    textSize(16);
    fill(255);
    //text(particles.length, 10, 30);
    pop();
  }

  push();
  stroke(255);
  strokeWeight(1.5);
  translate(width / 2, height / 2);
  sound.push(micLevel);
  if (sound.length > 180) {
    sound.splice(0, 180);
  }
  for (let i = 0; i < 180; i++) {
    rotate(2);
    let t = map(sound[i], 0, 0.2, 0, 100);
    line(0, 170, 0, 170 + t);
  }
  pop();
}

class Particle {
  constructor(x, y, r, g, b) {
    // properties
    this.x = x;
    this.y = y;
    this.xSpd = random(-1, 1);
    this.ySpd = random(-5, -3);
    this.dia = 10;
    this.r = r;
    this.g = g;
    this.b = b;
    this.friends = 0;
    this.hp = 255;
  }
  // methods
  repelledFrom(targetX, targetY, dis) {
    let distance = dist(this.x, this.y, targetX, targetY);

    if (distance < dis) {
      let xAcc = (targetX - this.x) * -1 * 0.0055;
      let yAcc = (targetY - this.y) * -0.0055;
      this.xSpd += xAcc;
      this.ySpd += yAcc;
      return 1;
    }
    return 0;
  }

  centralForce(targetX, targetY, dis) {
    let distance = dist(this.x, this.y, targetX, targetY);

    if (distance < dis) {
      let xAcc = (targetX - this.x) * 1 * 0.0005;
      let yAcc = (targetY - this.y) * 0.0005;
      this.xSpd += xAcc;
      this.ySpd += yAcc;
    }
  }

  slowDown() {
    this.xSpd = this.xSpd * 0.9;
    this.ySpd = this.ySpd * 0.9; // 10% less per frame
  }
  bounce() {
    if (this.x < 0) {
      this.x = 0;
      this.xSpd = this.xSpd * -1;
    } else if (this.x > width) {
      this.x = width;
      this.xSpd = this.xSpd * -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.ySpd = this.ySpd * -1;
    } else if (this.y > height) {
      this.y = height;
      this.ySpd = this.ySpd * -1;
    }
  }
  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;
  }
  display(hp) {
    push();
    translate(this.x, this.y);

    noStroke();
    fill(this.r, this.g, this.b, this.hp);
    circle(0, 0, map(this.hp, 50, 255, 8, 11));
    pop();
  }
}
