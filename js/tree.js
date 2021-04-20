const demos = [
  {
    w: "F+F+F+F",
    p: {
      'F': "F-F+F+F-F"
    },
    d: 90,
    n: 5,
    z: 3,
    rootX: 0.3,
    rootY: 0.225,
    scale: 0.4
  },
  {
    w: "F",
    p: {
      'F': "F[+F]F[-F]F"
    },
    d: 25.7,
    n: 2,
    z: 3,
    rootX: 0.25,
    rootY: 0.125,
    scale: 0.8
  },
  { // TODO: bug?
    w: "X",
    p: {
      'X': "F-[[X]+X]+F[+FX]-X",
      'F': "FF"
    },
    d: 22.5,
    n: 2,
    z: 3,
    rootX: 0.25,
    rootY: 0.125,
    scale: 0.8
  },
  {
    w: "F",
    p: {
      'F': "FF+[+F-F-F]-[-F+F+F]"
    },
    d: 22.5,
    n: 4,
    z: 3,
    rootX: 0.25,
    rootY: 0.125,
    scale: 0.8
  },
  {
    w: "X",
    p : {
      'X': "F[+X]F[-X]+X",
      'F': "FF"
    },
    d: 20,
    n: 7,
    z: 2.2,
    rootX: 0.25,
    rootY: 0.125,
    scale: 0.8
  },
  {
    w: "F",
    p: {
      'F': "EE[-F][+F]",
      'E': "EE"
    },
    d: 45,
    n: 5,
    z: 2.3,
    rootX: 0.5,
    rootY: 0.125,
    scale: 0.8
  },
  {
    w: "X",
    p: {
      'X': "F+[[X]-X]-F[-FX]+X",
      'F': "FF"
    },
    d: 25,
    n: 7,
    z: 2.3,
    rootX: 0.25,
    rootY: 0.125,
    scale: 0.8
  }
];

const tree = p => {
  let d_rad;
  const scale_diagram = 0.18;

  let l;

  let curDir = 0;
  let curX, curY; // should depend on tree

  const scale_padding = 0.05;
  let step;
  let canvas_x_min, canvas_y_min, canvas_x_max, canvas_y_max;

  p.setup = function() {
    p.createCanvas(scale_diagram*p.windowWidth, scale_diagram*p.windowWidth);
    // p.background('#222222');
    //p.stroke('rgba(0,255,0,0.5)');

    canvas_x_min = p.width * scale_padding;
    canvas_x_max = p.width * (1-scale_padding);
    canvas_y_min = p.height * (1-scale_padding);
    canvas_y_max = p.height * scale_padding;

    const demo = demos[p.which];
    curX = demo.rootX * p.width;
    curY = (1 - demo.rootY) * p.height;

    // TODO: a size(n) function for each tree
    step = demo.scale / p.pow(demo.z,demo.n) *
      p.min(p.abs(canvas_x_max - canvas_x_min),
         p.abs(canvas_y_max - canvas_y_min));

    l = L(demo.n,demo.w,demo.p);
    d_rad = demo.d * PI/180;
    t=0;
  }

  let t = 0;
  let stack = new Stack();
  p.draw = function() {
    if (t >= l.length) {
      p.noLoop();
    }
    switch(l[t]) {
      case 'F':
        {
          let nextX = curX + step * p.sin(curDir);
          let nextY = curY - step * p.cos(curDir);
          p.line(curX,curY,nextX,nextY);
          curX = nextX;
          curY = nextY;
        }
        break;
      case 'E':
        {
          let nextX = curX + step * p.sin(curDir);
          let nextY = curY - step * p.cos(curDir);
          p.line(curX,curY,nextX,nextY);
          curX = nextX;
          curY = nextY;
        }
        break;
      case '+':
        curDir += d_rad;
        break;
      case '-':
        curDir -= d_rad;
        break;
      case '[':
        let curState = {
          x: curX,
          y: curY,
          dir: curDir
        };
        stack.push(curState);
        break;
      case ']':
        let prevState = stack.peek();
        curX = prevState.x;
        curY = prevState.y;
        curDir = prevState.dir;
        stack.pop();
        break;
      default:
    }
    t++;
  }

  // TODO: asserts that n >= 0
  // TODO: support turning at different angles
  // TODO: incorporate wind blow!
  function L(n,w,p) {
    if (n == 0) return w;
    let l = L(n-1,w,p);
    let output = "";
    for (let i = 0; i < l.length; ++i) {
      let l_i = l[i];
      if(p.hasOwnProperty(l_i)) {
        output += p[l_i];
      } else {
        output += l_i;
      }
    }
    return output;
  }
}

var tree0 = new p5(tree, 'tree0');
tree0.which = 0;
var tree1 = new p5(tree, 'tree1');
tree1.which = 4;
var tree2 = new p5(tree, 'tree2');
tree2.which = 5;
var tree3 = new p5(tree, 'tree3');
tree3.which = 3;