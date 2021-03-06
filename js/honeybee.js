class Honeybee {

  constructor(topLeftCorner, bottomRightCorner, hiveX, hiveY, mode, foodMap, opts, p5s) {
    this.foodMap = foodMap;
    this.beeImage = opts.beeImage;
    this.dead_bee = opts.beeDead;
    this.p5s = p5s;

    this.topLeftCorner = topLeftCorner;
    this.bottomRightCorner = bottomRightCorner;

    this.pos = this.p5s.createVector(
      this.p5s.random(topLeftCorner.x, bottomRightCorner.x),
      this.p5s.random(topLeftCorner.y, bottomRightCorner.y)
    );

    this.vel = this.p5s.createVector(this.p5s.random(2)-1, this.p5s.random(2)-1);
    this.acc = this.p5s.createVector(this.p5s.random(2)-1, this.p5s.random(2)-1);
    this.target;
    this.full = false;
    this.foundFoodSource;
    this.hive = this.p5s.createVector(hiveX,hiveY);
    this.mode = mode; // 0 for drone bees, 1 for worker bees

    this.age = 0;
    this.dead = false;
    this.life_span = this.p5s.random(455,1000);
    this.has_pesticides = false;

    this.speed = 2;
  }

  // ------------------------------------------------------
  update() {

    this.speed = 2 + (this.foodMap.sliderVal - 70) / 10;

    let buffer = 30; // the distance from the edge that the bees will turn around at
    if (!this.dead) {

      if (this.has_pesticides) {
        this.age +=1;
      } else {
        this.age+=.01;
      }

      if (this.age > this.life_span) {
        this.dead = true;
      }

      // GENERAL BEE BEHAVIOR
      if (this.target && this.mode == 1) {
        this.acc = this.calc_heading(this.target);
      } else if (this.mode == 1) { //if explorer bee
        this.explore();
      } else if (this.distance_from_hive() > 100) {
        this.acc = this.calc_heading(this.hive);
      } else {
        this.explore();
      }



      // EDGE BEHAVIOR
      if (this.pos.x < this.topLeftCorner.x + buffer) {
        this.acc = this.p5s.createVector(1, 0);
      } else if (this.pos.x > this.bottomRightCorner.x - buffer) {
        this.acc = this.p5s.createVector(-1, 0);
      }

      if (this.pos.y < this.topLeftCorner.y + buffer) {
        this.acc = this.p5s.createVector(0, 1);
      } else if (this.pos.y > this.bottomRightCorner.y - buffer) {
        this.acc = this.p5s.createVector(0, -1);
      }


      // PHYSICS
      this.acc.setMag(.2); // change this number to make the bees make tighter turns (higher num = tighter turns)
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.vel.setMag(this.speed); // keeps acc from stacking and going too fast
    } else {
      if (this.pos.y >= this.bottomRightCorner.y) {
        this.vel = this.p5s.createVector(0, 0);
      } else {
        this.vel = this.p5s.createVector(0, 3);
      }

      this.pos.add(this.vel);

    }
  }


  // ------------------------------------------------------
  display() {

    this.p5s.applyMatrix();
    // this.p5s.rectMode(this.p5s.CENTER);
    this.p5s.noStroke();
    this.p5s.fill(255, 255, 0);

    this.p5s.translate(this.pos.x, this.pos.y);

    if (!this.dead) {
      this.p5s.rotate(this.vel.heading() + this.p5s.PI);
    } else {
      this.p5s.scale(1,-1);
    }

    if (this.vel.x > 0) {
      this.p5s.scale(1,-1);
    }

    if (this.has_pesticides) {
      this.p5s.fill(0,100,0,100);
      this.p5s.ellipse(0,0,20,20);
      this.p5s.noFill();
    }
    // draw bee
    this.p5s.image(this.beeImage, -10, -10, 20, 20);

    this.p5s.resetMatrix();
  }


  // ------------------------------------------------------
  explore() {
    this.acc = this.p5s.createVector(this.p5s.random(2) - 1, this.p5s.random(2) - 1);
  }


  // ------------------------------------------------------
  distance_from_hive() {
    return this.p5s.dist(this.pos.x, this.pos.y, this.hive.x, this.hive.y);
  }


  // ------------------------------------------------------
  clearTarget() {
    this.target = null;
  }


  // ------------------------------------------------------
  setTarget(newTargetx, newTargety) {
    this.target = this.p5s.createVector(newTargetx, newTargety);
  }


  // ------------------------------------------------------
  fillUp() {
    this.full = true;
    this.target = this.hive;
  }


  // ------------------------------------------------------
  calc_heading(targ) {

    var x_slope = targ.x - this.pos.x;
    var y_slope = targ.y - this.pos.y;

    return this.p5s.createVector(x_slope, y_slope);
  }


  // ------------------------------------------------------
  check_collision(foodx, foody) {

    if (this.p5s.dist(this.pos.x, this.pos.y, foodx, foody) < 10) {
      return true;
    } else {
      return false;
    }
  }


  // ------------------------------------------------------
  check_hive_collision() {

    if (this.distance_from_hive() < 30) {
      return true;
    } else {
      return false;
    }
  }
}
