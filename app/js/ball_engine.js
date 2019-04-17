var numberOfBalls = 12,
    numberOfImages = 15,
    balls = [],
    ballImages = [],
    gravity = 0.5,
    friction = 0.99,
    spinAmount = 12,
    tl,

    canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d'),

    ballTimer,
    theTime = 0, //timer counter

    BALL_DURATION = 5000,
    BOUNCE_FLOOR = 500;

// create an array of balls
for (var i=1; i<=numberOfImages; i++) {
  newImage = 'img' + i;
  newSource = 'images/ball'+i+'.png';
  newImage = new Image();
  newImage.src = newSource;
  ballImages.push(newImage);
}

/* ---------- this will generate balls on mouse-click --*/

canvas.addEventListener("mouseup", onMouseUp);

function onMouseUp(event) {
	var ball = new Ball(event.clientX-50, event.clientY, Math.floor((Math.random() * 10) + 2), Math.floor((Math.random() * 10) + 5));
	balls.push(ball);
  drawBall(ball);
}
 // ---------- */

window.onload = init;

function init(){

  // var gravInput = document.getElementById('gravity-input');
  // var fricInput = document.getElementById('friction-input');
  // gravInput.value = gravity;
  // // fricInput.value = friction;
  // gravInput.addEventListener('change', function() {
  //   gravity = gravInput.value;
  // });
  // fricInput.addEventListener('change', function() {
  //   friction = fricInput.value;
  // });

  generateBalls();
  ballTimer = setInterval(animateBalls, 50);

  var gravValue = document.querySelector('#gravity-value');
  var fricValue = document.querySelector('#friction-value');
  gravValue.innerHTML = (gravity);
  fricValue.innerHTML = (friction);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateBalls(){
  balls = [];
  for (var i = 0; i < numberOfBalls; i++) {
    var positionX = Math.floor((Math.random() * 200) + 20);
    var positionY = -100*(i+1);
    var vectorX = Math.floor((Math.random() * 15)); // set the initial horix=zontal vector
    var vectorY = Math.floor((Math.random() * 1.5) + (i*2)); // set the initial down vector
  	ball = new Ball(positionX, positionY, vectorX, vectorY);
  	balls.push(ball);
  }
}

function Ball(centerX, centerY, vectorX, vectorY){
  this.centerX = centerX;
  this.centerY = centerY;
  this.vectorX = vectorX;
  this.vectorY = vectorY;
  this.radius = getRandomInt(15,20);
  this.mass = this.radius/getRandomInt(1,6);  //(Math.random()*5)
  this.spin = 0;
  this.spinDirection = "CW";
  this.imageIndex = getRandomInt(0,15);
}

function drawBall(Ball){
  context.beginPath();
  context.arc(Math.round(Ball.centerX), Math.round(Ball.centerY), Ball.radius, 0, 2 * Math.PI, false);
  context.closePath();

  /* rotate context and draw ball */
  context.save();
  context.translate(Ball.centerX, Ball.centerY);
  context.rotate(Ball.spin*Math.PI/180);
  context.drawImage(ballImages[Ball.imageIndex], 0-Ball.radius, 0-Ball.radius, Ball.radius*2, Ball.radius*2);
  context.rotate((Ball.spin*Math.PI/180)*-1);
  context.restore();
}

function animateBalls() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  /* draw balls */
	for (var i = 0; i < balls.length; i++){

    /* check if x position is outside of canvas, reposition if it is */
    if (balls[i].centerX + balls[i].radius>canvas.width) {
      balls[i].centerX = canvas.width - (balls[i].radius+1);
      balls[i].vectorX *= -1*friction;
      balls[i].spinDirection = "CCW";
    } else if (balls[i].centerX - balls[i].radius<0){
      balls[i].centerX = balls[i].radius+1;
      balls[i].vectorX *= -1*friction;
      balls[i].spinDirection = "CW";
    }

  /* check to see if the ball is still bouncing */
  if (balls[i].vectorY != 0){
      /* check if y position is outside of canvas, reposition if it is, add gravity effect to Y vector */
      if (balls[i].centerY + balls[i].radius>BOUNCE_FLOOR){
        balls[i].centerY = BOUNCE_FLOOR - (balls[i].radius+1);
        balls[i].vectorY *= -1;
        balls[i].vectorY += gravity;
      } else if (balls[i].centerY-balls[i].radius<0){
        balls[i].centerY = balls[i].radius+1;
        balls[i].vectorY *= -1;
      }

      /* add effects of mass */
      balls[i].vectorY += (balls[i].mass*gravity)*0.5;

      /* if ball is near bottom and vectorY is small, stop bouncing */
      if (balls[i].centerY >= (canvas.height - (balls[i].radius+1)))
      {
        if (balls[i].vectorY < 2 && balls[i].vectorY > -2){
          balls[i].vectorY = 0;
          balls[i].centerY = Math.round(canvas.height - balls[i].radius);
        }
      }
    }

    /* add effect of friction */
    balls[i].vectorX *= friction;
    balls[i].vectorY *= friction;

    /* update position with final vector values */
    balls[i].centerX += balls[i].vectorX;
    balls[i].centerY += balls[i].vectorY;

    if (balls[i].spin > 360){
      balls[i].spin = balls[i].spin % 360;
    } else if (balls[i].spin < -360){
      balls[i].spin = (balls[i].spin % 360)*-1;
    }

    if (balls[i].spinDirection == "CW"){
      balls[i].spin = balls[i].spin+spinAmount;
    } else {
      balls[i].spin = balls[i].spin - spinAmount;
    }

    if (balls[i].vectorX < 1 && balls[i].vectorX > -1){
      balls[i].spin = 0;
      balls[i].vectorX = 0;
    }

    drawBall(balls[i]);
  } /* end loop */
} /* animateBalls */
