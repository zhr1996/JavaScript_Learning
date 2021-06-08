// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const para = document.querySelector('.ball_count');



const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// Define Shape Class
class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}
class Ball extends Shape {
    constructor(x, y, velX, velY,color, size) {
        super(x, y, velX, velY, true);
        this.color = color;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        if((this.x + this.size) >= width) {
            this.velX = -(this.velX);
          }
        
          if((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
          }
        
          if((this.y + this.size) >= height) {
            this.velY = -(this.velY);
          }
        
          if((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
          }
        
          this.x += this.velX;
          this.y += this.velY;
    }
    collisionDetect() {
        for (let j = 0; j < balls.length; j++) {
            if (!(this === balls[j]) && balls[j].exists) {
              const dx = this.x - balls[j].x;
              const dy = this.y - balls[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
        
              if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
              }
            }
          }
    }
}

class EvilCircle extends Shape {
  constructor(x, y, exists) {
    super(x, y, 20, 20, exists);
    this.color = "white";
    this.size = 10;
  }
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  checkbounds() {
    if((this.x + this.size) >= width) {
      this.x -= this.size;
    }
  
    if((this.x - this.size) <= 0) {
      this.x += this.size;
    }
  
    if((this.y + this.size) >= height) {
      this.y -= this.size;
    }
  
    if((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  }
  setControls() {
    let _this = this;
    window.onkeydown = function(e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
    }
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          console.log("eat a ball");
          balls[j].exists = false;
          count -= 1;
          para.innerHTML = `Ball Count: ${count}`;
        }
      }
    }
  }
}

// define array to store balls and populate it

let balls = [];
let count = 0;

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
  count += 1;
  para.innerHTML = `Ball Count: ${count}`;
}
const size = 20;
let evilCircle = new EvilCircle(random(0 + size,width - size),
random(0 + size,height - size), true);
evilCircle.setControls();
// define loop that keeps drawing the scene constantly


function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  
  evilCircle.draw();
  evilCircle.checkbounds();
  evilCircle.collisionDetect();

  
  for(let i = 0; i < balls.length; i++) {
    console.log(balls[i].exists);
    if (balls[i].exists) {
      
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  requestAnimationFrame(loop);
}

loop();