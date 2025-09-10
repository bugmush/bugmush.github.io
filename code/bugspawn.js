// get canvas and context
const canvas = document.getElementById("buggyCanvas");
const ctx = canvas.getContext("2d");
let startX, startY;

// set canvas to window size
function updateSize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  startX = canvas.width / 2;
  startY = 60;
}

updateSize();

// load the image
const img = new Image();
img.src = "assets/images/lilguy.png";

// initialise array to hold all active instances
let instances = [];
let animationFrameId = null;
let isAnimating = false;

img.onload = () => {
  function update() {
    // clear the canvas before drawing the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // update physics for each instance and remove those that are off-screen
    instances = instances.filter(instance => {
      instance.vy += 0.5;
      instance.x += instance.vx;
      instance.y += instance.vy;

      // bounce (only the bottom))
      if (instance.y > canvas.height - 100) {
        instance.y = canvas.height - 100;
        instance.vy *= -0.9;
      }

      // draw buggy at its current position
      ctx.save();
      ctx.translate(instance.x, instance.y);
      ctx.drawImage(img, -50, -62.5, 100, 125);
      ctx.restore();

      // keep instance if it's still on screen (with some margin)
      return instance.x > -150 && instance.x < canvas.width + 150 && instance.y < canvas.height + 150;
    });

    // continue animation if there are still instances
    if (instances.length > 0) {
      animationFrameId = requestAnimationFrame(update);
    } else {
      isAnimating = false;
      canvas.style.display = 'none';
    }
  }

  // start the animation on image click
  const buggyspinImg = document.querySelector('img.buggyspin');
  if (buggyspinImg) {
    buggyspinImg.addEventListener('click', function() {
      // create a new instance
      const newInstance = {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 25,
        vy: 0,
      };

      // set minimum speed
      const minSpeed = 4;
      if (Math.abs(newInstance.vx) < minSpeed) {
        newInstance.vx = newInstance.vx > 0 ? minSpeed : -minSpeed;
      }

      // add to instances array
      instances.push(newInstance);

      // start animation if not already running
      if (!isAnimating) {
        canvas.style.display = 'block';
        isAnimating = true;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        update();
      }
    });
  }
};

// handle window resize
onresize = updateSize;
