class FoodMap {

  // ------------------------------------------------------
  constructor(boundingWidth, boundingHeight, opts, p5s) {
    this.opts = opts;
    this.p5s = p5s;

    this.width = boundingWidth;
    this.height = boundingHeight;

    this.button1pos = this.p5s.createVector(boundingWidth * .95, boundingHeight * .4);
    this.button2pos = this.p5s.createVector(boundingWidth * .95, boundingHeight * .5);

    this.sliderpos = this.p5s.createVector(boundingWidth * .05, boundingHeight * .45);
    this.sliderButtonPos = this.p5s.createVector(boundingWidth * .05, boundingHeight * .45);

    this.sliderVal = 60;

    this.buttonFillCounter1 = 10;
    this.buttonFillCounter2 = 10;

    this.hive = new Hive(
      this.p5s.createVector(0, this.p5s.height - (this.height)),
      this.p5s.createVector(this.width, this.p5s.height),
      this.opts,
      this.p5s,
      this
    );

    this.temp;
    this.gravity;
    this.time;
  }


  // ------------------------------------------------------
  update() {
    // update time, temp, gravity stuff here
    this.hive.update();

    this.sliderVal = 70 - this.p5s.floor((this.sliderButtonPos.y - this.sliderpos.y) / 10);
    //this.sliderVal = 25;

    if (this.buttonFillCounter1 < 10 || this.buttonFillCounter2 < 10) {
      this.buttonFillCounter1++;
      this.buttonFillCounter2++;
    }
  }


  // ------------------------------------------------------
  display() {
    // draw map rect
    this.p5s.rectMode(this.p5s.CORNER);
    this.p5s.rect(0, this.p5s.height - (this.height), this.width, this.height);
    this.p5s.rectMode(this.p5s.CENTER);

    // draws hive and food
    this.hive.display();

    // draw border to make edge clean
    this.p5s.noFill();
   // this.p5s.stroke(this.opts.colBgGreen);
   // this.p5s.strokeWeight(8);
   // this.p5s.rectMode(this.p5s.CORNER);

    this.p5s.rect(
      0,
      this.p5s.height - this.height,
      this.width,
      this.height
    );

    this.p5s.rectMode(this.p5s.CENTER);

    this.draw_buttons();

    this.draw_slider();


  }

  draw_slider() {

    this.p5s.applyMatrix();
    this.p5s.fill('rgba(255, 255, 255, 0.35)');
    this.p5s.rectMode(this.p5s.CENTER);
    this.p5s.rect(this.sliderpos.x, this.sliderpos.y, 10, 200, 20);

    this.p5s.fill(255);
    this.p5s.ellipse(this.sliderButtonPos.x, this.sliderButtonPos.y, 10,5);

    this.p5s.text(this.sliderVal + "°", this.sliderpos.x - 10, this.sliderpos.y - 120);
    this.p5s.noFill();
    this.p5s.resetMatrix();
  }

  draw_buttons() {
    this.p5s.applyMatrix();
    this.p5s.textSize(15);

    this.p5s.fill('rgba(255, 255, 255, 0.35)');
    this.p5s.rectMode(this.p5s.CENTER);
    this.p5s.rect(this.button1pos.x - 95, this.button1pos.y, 120, 24, 20);
    this.p5s.rect(this.button2pos.x - 110, this.button2pos.y, 150, 24, 20);
    this.p5s.rectMode(this.p5s.CORNER);


    if (this.buttonFillCounter1 < 10) {
      this.p5s.fill(200);
    } else {
      this.p5s.fill(255)
    }
    this.p5s.ellipse(this.button1pos.x, this.button1pos.y, 30, 30);
    if (this.buttonFillCounter2 < 10) {
      this.p5s.fill(200);
    } else {
      this.p5s.fill(255)
    }
    this.p5s.ellipse(this.button2pos.x, this.button2pos.y, 30, 30);

    this.p5s.fill(255);
    this.p5s.text("Add a Flower", this.button1pos.x - 138, this.button1pos.y + 5);
    this.p5s.text("Add a Pesticide", this.button2pos.x - 160, this.button2pos.y + 5);

    this.p5s.noFill();
    this.p5s.resetMatrix();
  }

  pressButton1() {
    this.hive.addFoodSource();
    this.buttonFillCounter1 = 0;
  }

  pressButton2() {
    this.hive.add_a_pesticide();
    this.buttonFillCounter2 = 0;
  }
}



// ------------------------------------------------------
class Hive {

  constructor(topLeftCorner, bottomRightCorner, opts, p5s, foodMap) {

    this.tl = topLeftCorner;
    this.br = bottomRightCorner;

    this.opts = opts;
    this.foodMap = foodMap;
    this.p5s = p5s;

    this.pos = this.p5s.createVector(
      topLeftCorner.x + (bottomRightCorner.x - topLeftCorner.x) / 2,
      topLeftCorner.y + 350
    );

    this.knownFood   = [];
    this.foodSources = [];
    this.pollenLevel = 60;
    this.bees        = [];
    this.beePop      = 20;
    this.max_bee_pop = 30;
    this.max_food_sources = 10;
    this.hive_health = 60;

    // Instantiate new bee(s)
    // Constrain bee position and movement inside of FoodMap bounding box

    for (let i = 0; i < this.beePop; i++) {  // initialize all the bees
      var beeType;
      if (this.p5s.random(10) < 6) { // how many bees are workers vs drones
        beeType = 1; // worker
      } else {
        beeType = 0; // drone
      }

      this.bees.push(new Honeybee(
        topLeftCorner,
        bottomRightCorner,
        this.pos.x,
        this.pos.y,
        beeType,
        this.foodMap,
        this.opts,
        this.p5s
      ));
    }

    // start with a few foodSources
    for (let i = 0; i < 3; i++) {
      this.foodSources.push(new FoodSource(
        this.p5s.random(this.tl.x + 50, this.br.x - 50),
        this.br.y - 50,
        this.opts,
        this.p5s,
        this.p5s.floor(this.p5s.random(3)),
        this.p5s.random(250,350)
      ));
    }
  }

  // ------------------------------------------------------
  update() {
    // updates bees
    this.update_bees();
    // updates food
    this.update_food_sources();
    // makes sure hives known food sources actually exist
    this.verify_targets();
    // update pollen and hive HEALTH
    this.update_hive_health();

    this.manage_bee_pop();
  }


  // ------------------------------------------------------
  display() {

    // draws actual hive - this may change to just drawing the opening
    this.p5s.applyMatrix();
    this.p5s.rectMode(this.p5s.CENTER);
    this.p5s.noStroke();
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.image(this.opts.hiveImage, -250, -200, 500, 400);

    if (this.hive_health > 120) {
      this.p5s.image(this.opts.honey1,-20,0,50,50);
    } else if (this.hive_health > 80) {
      this.p5s.image(this.opts.honey2,-20,0,50,50);
    } else if (this.hive_health > 40) {
      this.p5s.image(this.opts.honey3,-20,0,50,50);
    }

    this.p5s.resetMatrix();

    this.display_food_sources();
    this.display_bees();
  }

  add_a_pesticide() {

    let randVal = this.p5s.floor(this.p5s.random(this.foodSources.length));

    if(this.foodSources[randVal].pesticide <= 5) {
      this.foodSources[randVal].add_pesticide();
    }
  }

  manage_bee_pop() {

    let diff = this.max_bee_pop - this.bees.length;

    if (diff > 0) {

      if (this.hive_health > 80) {

        if (this.bees.length < this.beePop) {

          let beeType;
          if (this.p5s.random(10) < 6) { // how many bees are workers vs drones
            beeType = 1; // worker
          } else {
            beeType = 0; // drone
          }

          this.bees.push(new Honeybee(
            this.tl,
            this.br,
            this.pos.x,
            this.pos.y,
            beeType,
            this.foodMap,
            this.opts,
            this.p5s
          ));
        }
      }

    }


  }

  // ------------------------------------------------------
  addFoodSource() {

    if (this.foodSources.length < this.max_food_sources) {
      this.foodSources.push(new FoodSource(
        this.p5s.random(this.tl.x + 50, this.br.x - 50),
        this.br.y - 50,
        this.opts,
        this.p5s,
        this.p5s.floor(this.p5s.random(3)),
        this.p5s.random(250,350)
      ));
    }
  }

  // ------------------------------------------------------
  addPollen() {
    this.pollenLevel += .5;
  }


  // ------------------------------------------------------
  update_hive_health() {

    this.pollenLevel -= .001;

    this.hive_health = this.pollenLevel * (this.max_bee_pop - this.bees.length) / 10;


  }
  // ------------------------------------------------------
  verify_targets() {
    if (this.knownFood[0]) {
      for (let i = 0; i < this.knownFood.length; i++) {
        if (this.p5s.findObjectByKey(this.foodSources, "x", this.knownFood.x) == null) {
          this.knownFood.splice(i,1);
        }
      }
    }
  }


  // --------------------------------------------------------
  check_food_collisions(a_bee) {

    // for each bee
    let food_exists = false;

    // for each flower
    for (let i = 0; i < this.foodSources.length; i++) {
      let a_food = this.foodSources[i]

      // if bee is near a flower it smells in
      if (!a_bee.target && this.p5s.dist(a_bee.pos.x, a_bee.pos.y, a_food.head_pos.x, a_food.head_pos.y) < 70) {
        a_bee.setTarget(a_food.head_pos.x, a_food.head_pos.y);
      }

      //checks if bees target flower exists
      if (a_bee.target && a_bee.target.x == a_food.head_pos.x && !a_food.died && !a_food.baby) {
        food_exists = true;
      }

      //if bee is on the flower
      if (a_bee.check_collision(a_food.head_pos.x, a_food.head_pos.y) && a_bee.full != true) {
        a_bee.fillUp();
        a_bee.foundFoodSource = a_food.head_pos;
        if (this.p5s.random(10) < a_food.pesticide) {
          a_bee.has_pesticides = true;
        }
      }
    }
    //if the bees target (which is a flower) does not exist anymore
    if (a_bee.target && a_bee.target.x != this.pos.x && food_exists == false) {
      a_bee.clearTarget();
    }

  }


  // --------------------------------------------------------
  update_food_sources() {
    for (var i = 0; i < this.foodSources.length; i++) {
      this.foodSources[i].update();
      if (this.foodSources[i].gone) {
        this.foodSources.splice(i, 1);
      }
    }

    if (this.foodSources.length < 3) {
      this.foodSources.push(new FoodSource(
        this.p5s.random(this.tl.x + 50, this.br.x - 50),
        this.br.y - 50,
        this.opts,
        this.p5s,
        this.p5s.floor(this.p5s.random(3)),
        this.p5s.random(250,350)
      ));
    }
  }

  // ------------------------------------------------------
  update_bees() {

    for (let i = 0; i < this.beePop; i++) {
      let bee = this.bees[i];

      if (bee.dead && bee.pos.y >= this.bottomRightCorner.y) {
        this.bees.splice(i, 1);
      }
      // update each bee
      bee.update();

      this.check_food_collisions(bee);

      // checks if bees are over the hive
      if (bee.check_hive_collision()) {
        // if the bee is returning with pollen
        if (bee.full) {
          this.addPollen();
          if (this.p5s.findObjectByKey(this.knownFood, "x", bee.foundFoodSource.x) == null) {
            this.knownFood.push(bee.foundFoodSource);
          }
          bee.full = false;
          bee.foundFoodSource = null;
        }

        // otherwise give the bee a new target to go to (as if they watched a dance)
        if (this.knownFood[0]) {
          let rand = this.p5s.floor(this.p5s.random(this.knownFood.length));
          bee.setTarget(this.knownFood[rand].x, this.knownFood[rand].y);
        } else {
          bee.clearTarget();
        }
      }
    }
  }


  // ------------------------------------------------------
  display_food_sources() {
    for (var i = 0; i < this.foodSources.length; i++) {
      this.foodSources[i].display();
    }
  }

  // ------------------------------------------------------
  display_bees() {
    for (let i = 0; i < this.beePop; i++) {
      this.bees[i].display();
    }
  }
}




// ------------------------------------------------------
class FoodSource {
  constructor(posX, posY, opts, p5s, flower_type, _lifespan) {
    this.p5s       = p5s;
    this.opts      = opts;
    this.pos       = this.p5s.createVector(posX, posY);
    this.head_pos  = this.p5s.createVector(posX - 25, posY + 300);
    this.age       = 0;
    this.life_span = _lifespan;
    this.baby      = true;
    this.died      = false;
    this.gone      = false;
    this.scale     = 200;
    this.offset    = 5;
    this.label_counter = 40;

    this.type       = flower_type;  // 0 = lavender,1 = yellow, or 2 = pink
    this.image;
    this.pesticide  = 0; // amount of doses

    this.pick_image(this.opts.lav_baby, this.opts.yel_baby, this.opts.pink_baby);
  }


  // ------------------------------------------------------
  update() {

    if (this.label_counter < 40) {
      this.label_counter++;
    }
    this.age+=.01;

    if (this.age < this.life_span/3) {
      //nothing for now
    } else if (this.age < this.life_span*2/3) {
      this.baby = false;
      this.offset = this.scale*.2 - 20
      this.head_pos.y = this.pos.y - this.scale*.5;
      this.pick_image(this.opts.lav_adult, this.opts.yel_adult, this.opts.pink_adult);

    } else if (this.age < this.life_span){
      this.offset = -10;
      this.died = true;
      this.image = this.opts.flower_dead;

    } else {
      this.gone = true;
    }

  }


  // ------------------------------------------------------
  display() {

    this.p5s.applyMatrix();
    //this.p5s.noStroke();
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.image(this.image, this.scale/-2 - this.offset, this.scale/-2 - this.offset, this.scale, this.scale);
    this.p5s.fill(255)
    if (this.label_counter < 40) {
      this.p5s.text("pesticide +1", -45, -180 - this.label_counter);
    }
    this.p5s.noFill();
    this.p5s.resetMatrix();
  }

  pick_image(image1, image2, image3) {
    switch(this.type) {
      case 0:
        this.image = image1;
        break;
      case 1:
        this.image = image2;
        break;
      case 2:
        this.image = image3;
        break;
    }
  }

  add_pesticide() {
    this.pesticide++;
    this.life_span+=50;
    this.label_counter = 0;
  }
}
