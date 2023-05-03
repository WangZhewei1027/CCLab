let particles = [];
let notes = [];
let stations = [];
let drums = [];
let buttons = [];
let flag = 'piano';
let c = 0;
let mouse = 1;

function setup() {
  let canvas = createCanvas(500, 1000);
  canvas.parent("p5-container");

  buttons[0] = new Button_piano();
  buttons[1] = new Button_drum();
  buttons[2] = new Button_station();

  soundFormats('wav');
  piano_C = loadSound('sounds/piano_C'); piano_C.setVolume(2);
  piano_D = loadSound('sounds/piano_D'); piano_D.setVolume(2);
  piano_E = loadSound('sounds/piano_E'); piano_E.setVolume(2);
  piano_G = loadSound('sounds/piano_G'); piano_G.setVolume(2);
  piano_A = loadSound('sounds/piano_A'); piano_A.setVolume(2);

  drum_B = loadSound('sounds/Bass Drum');
  drum_C = loadSound('sounds/Crash');
  drum_H = loadSound('sounds/Hihat');
  drum_S = loadSound('sounds/Snare');
}

function draw() {

  background(240, 80);

  for (let i = 0; i < buttons.length; i++) {
    p = buttons[i];
    p.run();
  }

  if (c > 60) {
    for (let i = 0; i < stations.length; i++) {
      let p = stations[i];
      //console.log(i);
      particles.push(new Particle(p.x, p.y, 255, 191, 155));
    }
    c = 0;
  } else {
    c = c + 1;
  }

  //while (particles.length > 100) {particles.splice(0, 1);}

  for (let i = 0; i < particles.length; i++) {
    p = particles[i];
    p.slowDown();
    p.bounce();
    p.gravity();
    p.col();
    p.move();
    p.display();
    if (p.y > (windowHeight + 100)) {
      particles.splice(i, 1);
    }
  }
  console.log(notes.length);

  for (let i = 0; i < notes.length; i++) {
    p = notes[i];
    p.display();
  }

  for (let i = 0; i < stations.length; i++) {
    p = stations[i];
    p.display();
  }

  for (let i = 0; i < drums.length; i++) {
    p = drums[i];
    p.display();
  }

}

class Button_piano {
  constructor() {
    this.x = 60;
    this.y = 60;
  }
  run() {
    push();
    circle(this.x, this.y, 50);
    pop();

    if ((mouseIsPressed) && (dist(mouseX, mouseY, this.x, this.y) < 25) && (mouse == 1)) {
      flag = 'paino'
      notes.push(new Note(this.x + 70, this.y, 98, 205, 255));
      mouse = 0;
    }
  }
}

class Button_station {
  constructor() {
    this.x = 60;
    this.y = 200;
  }
  run() {
    push();
    circle(this.x, this.y, 15);
    pop();

    if ((mouseIsPressed) && (dist(mouseX, mouseY, this.x, this.y) < 15) && (mouse == 1)) {
      stations.push(new Station(this.x + 70, this.y, 98, 205, 255));
      mouse = 0;
    }
  }
}

class Button_drum {
  constructor() {
    this.x = 60;
    this.y = 140;
  }
  run() {
    push();
    rect(this.x - 25, this.y - 25, 50);
    pop();

    if ((mouseIsPressed) && (dist(mouseX, mouseY, this.x, this.y) < 25) && (mouse == 1)) {
      flag = 'drum'
      drums.push(new Drum(this.x + 80, this.y, 98, 205, 255));
      mouse = 0;
    }
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

  for (let i = 0; i < drums.length; i++) {
    let p = drums[i];
    let dis_real = dist(mouseX, mouseY, p.x, p.y);
    if ((dis_real < 20) && (dis_real > 0.1)) {
      p.change();
    }
  }
}

function keyReleased() {
  if (key === 'a') {
    for (let i = 0; i < stations.length; i++) {
      let p = stations[i];
      particles.push(new Particle(p.x, p.y, 255, 191, 155));
    }
  } else if (key === 'b') {
    notes.push(new Note(mouseX, mouseY, 98, 205, 255));
  } else if (key === 's') {
    stations.push(new Station(mouseX, mouseY, 98, 205, 255));
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

  for (let i = 0; i < drums.length; i++) {
    let p = drums[i];
    let dis_real = dist(mouseX, mouseY, p.x, p.y);
    if (dis_real < 25) {
      p.x = mouseX;
      p.y = mouseY;
    }
  }

  if (stations.length > 0) {
    for (let i = 0; i < stations.length; i++) {
      let p = stations[i];
      let dis_real = dist(mouseX, mouseY, p.x, p.y);
      if (dis_real < p.dia / 2) {
        p.x = mouseX;
        p.y = mouseY;
      }
    }
  }
}

function mouseReleased() {
  mouse = 1;
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

    stroke(0);
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
        let k = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) * 0.0006;
        this.xSpd = a * k;
        this.ySpd = b * k;
      }
    }

    for (let i = 0; i < drums.length; i++) {
      let p = drums[i];
      let t = 25 + this.dia / 2;
      if ((Math.abs(this.x - p.x) < t) && (Math.abs(this.y - p.y) < t)) {
        p.sound();
        let a = this.x - p.x;
        let b = this.y - p.y;
        //if (a == 0) a = random(-0.05, 0.05);
        let k = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) * 0.0006;
        this.xSpd = a * k;
        this.ySpd = b * k;
      }
    }
  }
}

class Station {
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
    this.flag = 0;
  }
  // methods

  display() {
    push();
    translate(this.x, this.y);

    stroke(0);
    strokeWeight(1);
    fill(this.r, this.g, this.b, this.hp);
    circle(0, 0, 15);

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
    this.w = 3;
  }
  // methods

  display() {
    push();
    translate(this.x, this.y);

    stroke(0);
    strokeWeight(this.w);
    fill(108, 175, 164);
    circle(0, 0, this.dia);

    textSize(32);
    fill(0, 102, 153);
    //text(this.soud_list[this.flag], -11, 10);

    pop();
  }

  sound() {
    if (this.soud_list[this.flag] == 'C') { piano_C.play(); this.w = 2; }
    if (this.soud_list[this.flag] == 'D') { piano_D.play(); this.w = 3.5; }
    if (this.soud_list[this.flag] == 'E') { piano_E.play(); this.w = 5; }
    if (this.soud_list[this.flag] == 'G') { piano_G.play(); this.w = 6.5; }
    if (this.soud_list[this.flag] == 'A') { piano_A.play(); this.w = 8; }
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

class Drum {
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
    this.soud_list = ['B', 'S', 'H', 'C'];
    this.flag = 0;
    this.w = 3;
  }
  // methods

  display() {
    push();
    translate(this.x, this.y);

    strokeWeight(this.w);
    fill(251, 237, 183);
    rect(- 25, - 25, 50);

    pop();
  }

  sound() {
    if (this.soud_list[this.flag] == 'B') { drum_B.play(); this.w = 3; }
    if (this.soud_list[this.flag] == 'S') { drum_S.play(); this.w = 5; }
    if (this.soud_list[this.flag] == 'H') { drum_H.play(); this.w = 7; }
    if (this.soud_list[this.flag] == 'C') { drum_C.play(); this.w = 8; }
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