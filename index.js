
// const Engine = Matter.Engine;
// const Render = Matter.Render

const {Engine, Render, Bodies, World, MouseConstraint, Composites, Query} = Matter;

Matter.use('matter-wrap')

const sectionTag = document.querySelector("section.shapes");

const w = window.innerWidth;
const h = window.innerHeight;

const engine = Matter.Engine.create();
const renderer = Matter.Render.create({
  element: sectionTag,
  engine: engine,
  options: {
    height: h,
    width: w,
    background: "black",
    wireframes: false,
    pixelRatio: window.devicePixelRatio
  }
});

const createShape = function (x, y) {
  // return Bodies.circle(x, y, 20 + 20 * Math.random(), {
    const randomNum = Math.random()

    if (randomNum > 0.5) {


      return Bodies.circle(x, y, 25, {

    // isStatic: true,
    // frictionAir: 1,
    render: {
      // fillStyle: "red",
      sprite: {
        texture:"yellow.png",
        xScale: 0.5,
        yScale: 0.5
      }
    },
    plugin: {
      wrap: {
        min: {x: 0, y: 0},
        max: {x: w, y: h}
      }
    }
  })
    }
  }

  const bigBall = Bodies.circle(w/2, h/2, Math.min(w/4, h/4), {
    isStatic: true,
    render: {
      fillStyle: "white"
    }
  });

  const wallOptions = {
    isStatic: true,
    render: {
      visible: false
    }
  }

  const mouseControl = MouseConstraint.create(engine, {
    element: sectionTag,
    constraint: {
      render: {
        visible: false
      }
    }
  })

  const initialShapes = Composites.stack(50, 50, 15, 5, 40, 40, function (x,y) {
    return createShape(x,y);
  })

  const ground = Bodies.rectangle(w/2,h + 50, w + 100, 100, wallOptions)
  const ceiling = Bodies.rectangle(w/2, -50, w + 100, 100, wallOptions)
  const leftWall = Bodies.rectangle(-50, h/2,100, h + 100, wallOptions)
  const rightWall = Bodies.rectangle(w + 50, h/2, 100,h +100, wallOptions)

  World.add(engine.world, [
    bigBall,
    ground,
    ceiling,
    // leftWall,
    // rightWall,
    mouseControl,
    initialShapes
    ])

  document.addEventListener("click", function (event) {
    const shape = createShape(event.pageX, event.pageY);
    initialShapes.bodies.push(shape);
    World.add(engine.world, shape);
  })

  document.addEventListener("mousemove", function (event) {
    const vector = {x: event.pageX, y: event.pageY}
    const hoveredShapes = Query.point(initialShapes.bodies, vector)

    hoveredShapes.forEach(shape => {
      shape.render.sprite = null,
      shape.render.fillStyle = "red"
    })
  })

  Engine.run(engine);
  Render.run(renderer);

  window.addEventListener("deviceorientation", function(event) {
    engine.world.gravity.x = event.gamma / 30;
    engine.world.gravity.y = event.beta / 30;
  })

// let otime = 0;
// const changeGravity = function () {
//   time = time + 0.01;
//   const gravity = Math.cos(time);
//   engine.world.gravity.x = Math.sin(time);
//   engine.world.gravity.y = gravity;

//   requestAnimationFrame(changeGravity);
// }

// changeGravity();

window.addEventListener("resize", function () {
  w = window.innerWidth
  h = window.innerHeight
  renderer.canvas.width = w
  renderer.canvas.height = h
  renderer.canvas.style.width = w + "px"
  renderer.canvas.style.height = h + "px"
  renderer.options.width = w
  renderer.options.height = h

  Matter.Body.setStatic(bigBall, false)
  bigBall.position =  { x: w / 2, y: h / 2 }
  Matter.Body.setStatic(bigBall, true)
})
