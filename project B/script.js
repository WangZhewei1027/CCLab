let particles = [];
let notes = [];

function setup() {
  createCanvas(400, 400);

  soundFormats('wav');
  piano_C = loadSound('sounds/piano_C');
  piano_D = loadSound('sounds/piano_D');
  piano_E = loadSound('sounds/piano_E');
  piano_G = loadSound('sounds/piano_G');
  piano_A = loadSound('sounds/piano_A');
}

function draw() {

  background(0);

  if (particles.length > 200) {
    particles.splice(0, 100);
  }

  for (let i = 0; i < particles.length; i++) {
    p = particles[i];
    p.slowDown();
    p.bounce();
    p.gravity();
    p.col();
    p.move();
    p.display();
  }

  for (let i = 0; i < notes.length; i++) {
    p = notes[i];
    p.display();
  }

}

function mouseClicked() {
  for (let i = 0; i < notes.length; i++) {
    let p = notes[i];
    let dis_real = dist(mouseX, mouseY, p.x, p.y);
    if ((dis_real < p.dia / 2) && (dis_real > 0.1)) {
      p.change();
    }
  }

}

function keyPressed() {
  if (key === 'a') {
    particles.push(new Particle(mouseX, mouseY, 255, 191, 155));
  } else if (key === 'b') {
    notes.push(new Note(mouseX, mouseY, 98, 205, 255));
  }
}

function mouseDragged() {
  for (let i = 0; i < notes.length; i++) {
    let p = notes[i];
    let dis_real = dist(mouseX, mouseY, p.x, p.y);
    if (dis_real < p.dia / 2) {
      p.x = mouseX;
      p.y = mouseY;
    }
  }
}

class Particle {
  constructor(x, y, r, g, b) {
    // properties
    this.x = x;
    this.y = y;
    this.xSpd = 0;
    this.ySpd = 0;
    this.dia = 10;
    this.r = r;
    this.g = g;
    this.b = b;
    this.friends = 0;
    this.hp = 255;
  }

  gravity(targetX, targetY, dis) {
    this.ySpd += 0.5;
  }

  slowDown() {
    this.xSpd = this.xSpd * 0.99;
    this.ySpd = this.ySpd * 0.99; // 10% less per frame
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

  col() {
    for (let i = 0; i < notes.length; i++) {
      let p = notes[i];
      let dis_th = (p.dia + this.dia) / 2
      let dis_real = dist(this.x, this.y, p.x, p.y);
      if (dis_real < dis_th) {
        p.sound();
        let a = this.x - p.x;
        let b = this.y - p.y;
        if (a == 0) a = random(-0.05, 0.05);
        this.xSpd = a * 0.4;
        this.ySpd = b * 0.4;
      }
    }
  }
}

class Note {
  constructor(x, y, r, g, b) {
    // properties
    this.x = x;
    this.y = y;
    this.xSpd = 0;
    this.ySpd = 0;
    this.dia = 50;
    this.r = r;
    this.g = g;
    this.b = b;
    this.friends = 0;
    this.hp = 255;
    this.soud_list = ['C', 'D', 'E', 'G', 'A'];
    this.flag = 0;
  }
  // methods

  display() {
    push();
    translate(this.x, this.y);

    noStroke();
    fill(this.r, this.g, this.b, this.hp);
    circle(0, 0, this.dia);

    textSize(32);
    fill(0, 102, 153);
    text(this.soud_list[this.flag], -11, 10);

    pop();
  }

  sound() {
    if (this.soud_list[this.flag] == 'C') piano_C.play();
    if (this.soud_list[this.flag] == 'D') piano_D.play();
    if (this.soud_list[this.flag] == 'E') piano_E.play();
    if (this.soud_list[this.flag] == 'G') piano_G.play();
    if (this.soud_list[this.flag] == 'A') piano_A.play();
  }

  change() {
    if (this.flag < (this.soud_list.length - 1)) {
      this.flag += 1;
    } else {
      this.flag = 0;
    }
    this.sound();
  }

}
