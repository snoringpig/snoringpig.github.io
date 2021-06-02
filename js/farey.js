const farey = p => {
  const scale_padding = 0.05;
  const x_min = -2.6;
  const x_max = 2.6;
  const y_min = 0;
  const y_max = 1.3;
  const scale_diagram = 200;
  const t_min = 0;
  const t_max = 2;

  // for vertices of the Farey tree
  const color_1 = 'black';
  const color_2 = 'yellow';
  const bound = 100;

  const T = math.matrix([[1,1],[0,1]]);
  const U = math.matrix([[1,0],[1,1]]); // TST
  const V = math.matrix([[1,-1],[0,1]]); // T^{-1}
  const dict = {
    'T': ['T','T','U'],
    'U': ['U','U','T'],
    'V': ['V','V','U']
  };
  const mat = {
    'T': T,
    'U': U,
    'V': V
  };
  const mid = {
    'T': [0,1],
    'U': [0,1],
    'V': [1,1]
  };

  p.setup = function() {
    p.createCanvas(0.8 * p.windowWidth, 0.2 * p.windowWidth);
    p.padding = {
      'top': scale_padding * p.height,
      'bottom': scale_padding * p.height,
      'left': scale_padding * p.width,
      'right': scale_padding * p.width
    };
    p.bounds = {
      'x_min': x_min,
      'x_max': x_max,
      'y_min': y_min,
      'y_max': y_max
    };
    drawBackground();
  }

  p.draw = function() {
    p.noLoop();
    drawFareyTree();
  }

  function drawBackground() {
    p.stroke(100,100,100);
    xAxis(p,0);
    p.stroke(200,200,200);
    yAxis(p,0);
    yAxis(p,1); yAxis(p,2);
    yAxis(p,-1); yAxis(p,-2);

    // TODO: don't hardcode!!!
    const geodesics = [
      {o: 3, r: 1},
      {o: 1, r: 1},
      {o: -1, r: 1},
      {o: -3, r: 1},
      {o: -5/2, r: 1/2},
      {o: -3/2, r: 1/2},
      {o: -1/2, r: 1/2},
      {o: 1/2, r: 1/2},
      {o: 3/2, r: 1/2},
      {o: 5/2, r: 1/2},
      {o: -11/4, r: 1/4},
      {o: -9/4, r: 1/4},
      {o: -7/4, r: 1/4},
      {o: -5/4, r: 1/4},
      {o: -3/4, r: 1/4},
      {o: -1/4, r: 1/4},
      {o: 1/4, r: 1/4},
      {o: 3/4, r: 1/4},
      {o: 5/4, r: 1/4},
      {o: 7/4, r: 1/4},
      {o: 9/4, r: 1/4},
      {o: 11/4, r: 1/4},
    ];

    for(let i=0;i<geodesics.length;++i) {
      const g = geodesics[i];
      H2.geodesic(p, g.o,g.r,0,PI);
    }
  }

  function drawFareyTree() {
    p.stroke(0,0,0);
    p.strokeWeight(4)
    H2.geodesic(p, 0, 1, PI/3, PI/2);
    const z = [1/2, Math.sqrt(3)/2];
    const j = [0,1];
    p.fill(color_1); dot_scaled(z);
    const init = [
      {'g': T, 'word': 'T'},
      {'g': U, 'word': 'U'},
      {'g': V, 'word': 'V'}
    ];
    let q = new Queue();
    for(let i = 0; i < init.length; ++i) {
      const g = init[i]['g'], word = init[i]['word'];
      const gz = apply(g, z);
      p.strokeWeight(1);p.fill(color_1); dot_scaled(gz); H2.geodesic_segment(p,z,gz);
      p.strokeWeight(0.5);p.fill(color_2); dot_scaled(apply(init[i]['g'],mid[init[i]['word']]));
      q.push(
        {
          'node': gz,
          'g': g,
          'fromAndRest': dict[word]
        }
      );
    }

    let count = 0;
    while (count < bound) {
      const cur = q.peek();
      q.dequeue();
      const gC = cur['g'];
      const fromAndRestC = cur['fromAndRest'];
      for (let i = 1; i <= 2; ++i) {
        const g = math.multiply(gC, mat[fromAndRestC[i]]);
        const gz = apply(g,z);
        if (gz[0] > p.bounds['x_min'] - 0.5 && gz[0] < p.bounds['x_max'] + 0.5) {
          p.strokeWeight(1);p.fill(color_1); dot_scaled(gz); p.strokeWeight(Math.sqrt(gz[1]));H2.geodesic_segment(p,cur['node'],gz);
          p.strokeWeight(0.5);p.fill(color_2); dot_scaled(apply(g,mid[fromAndRestC[i]]));
          q.push(
            {
              'node': gz,
              'g': g,
              'fromAndRest': dict[fromAndRestC[i]]
            }
          );
          ++count;
        }
      }
    }
  }

  function dot_scaled(z) {
    return dot(p,z,Math.sqrt(z[1]));
  }

  // g is an element in SL(2,Z)
  function apply(g, z) {
    const gValueOf = g.valueOf();
    const numer = Complex.add(Complex.mult([gValueOf[0][0], 0], z), [gValueOf[0][1], 0]);
    const denom = Complex.add(Complex.mult([gValueOf[1][0], 0], z), [gValueOf[1][1], 0]);
    return Complex.div(numer, denom);
  }
}

new p5(farey, 'farey');