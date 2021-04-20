const unit_speed = p => {
  const scale_diagram = 0.18;
  const scale_padding = 0.05;
  const x_min = -1;
  const x_max = 7;
  const y_min = 0;
  const y_max = 8;
  const t_step = 0.0025;
  const t_min = 0;
  const t_max = 2;

  p.setup = function() {
    p.createCanvas(scale_diagram*p.windowWidth, scale_diagram*p.windowWidth);
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
  }

  let t = t_min;
  p.draw = function() {
    if (t >= t_max) {
      p.noLoop();
    }
    drawBackground();
    test_unit_speed_particle(t);

    if (t < t_max) {
      t += t_step;
    }
  }

  function drawBackground() {
    p.background('white');
    p.stroke(200,200,200);
    xAxis(p, 0); yAxis(p, 0);
  }

  function test_unit_speed_particle(t) {
    const x = [
      1,
      1.5,
      2,
      2.5,
      3,
      3.5,
      4,
      6,
      10,
      20];
    const color = [
      [255,0,0],
      [243,142,41],
      [255,255,0],
      [0,255,0],
      [0,0,255],
      [68,50,168],
      [255,0,255],
      [184,73,177],
      [176,99,171],
      [181,134,178]
    ];
    for(let i=0;i<10;++i) {
      const x_center = x[i];
      p.stroke(200,200,200)
      H2.geodesic(p, x_center,p.sqrt(x_center*x_center+1),0,PI);
      p.stroke('black');
      unit_speed_trajectory(t,x_center,color[i]);
    }
    traj_up(t,[242,201,238]);
    traj_down(t,[120,11,29]);
  }

  function test_segment() {
    let ff = [6,3];
    H2.geodesic_segment(p,[0,1],[3,0]);
    H2.geodesic_segment(p,[3,0],ff);
    H2.geodesic_segment(p,[0,1],ff);
    H2.geodesic_segment(p,ff,[0,6]);
    H2.geodesic_segment(p,[9,3],[9,7]);
    H2.geodesic_segment(p,[10,8],[10,4]);
    H2.geodesic_segment(p,[9,3],[10,4]);
    H2.geodesic_segment(p,[10,8],[9,7]);
    H2.geodesic_segment(p,[9,3],ff);
    H2.geodesic_segment(p,[9,7],[0,6]);
  }

  function test_reflection() {
    let z = [1,Math.sqrt(3)/2];
    let w = [0,2];
    p.fill('red');
    dot(p,z);
    dot(p,w);
    p.fill('green');
    let z_r = H2.reflection(z,[-1,0],[1,0]);
    let w_r = H2.reflection(w,[-1,0],[1,0]);
    dot(p,z_r);
    dot(p,w_r);
  }

  function test_tessellation() {
    var queue = new Queue();
    var mirrors_used = new Set();

    let w = [1/2,Math.sqrt(3)/2];
    let j = [0,1];

    let p_1 = [0,1];
    let p_2 = [0,100];
    let q_1 = [1/2,Math.sqrt(3)/2];
    let q_2 = [1/2,100];
    let r_1 = w;
    let r_2 = j;

    queue.push([p_1,p_2], [[q_1,q_2], [r_1,r_2]]);
    queue.push([q_1,q_2], [[p_1,p_2], [r_1,r_2]]);
    queue.push([r_1,r_2], [[q_1,q_2], [p_1,p_2]]);
    H2.geodesic_segment(p,p_1,p_2);
    H2.geodesic_segment(p,q_1,q_2);
    H2.geodesic_segment(p,r_1,r_2);
  }

  // start at (0,1)
  // semicircle centered at (x_center,0) (assume x_center positive for now)
  function unit_speed_trajectory(t,x_center,rgb) {
    p.fill(rgb[0],rgb[1],rgb[2]);
    r = p.sqrt(x_center*x_center+1);
    t_0 = p.log(r - x_center); // the "time" (0,1) is supposed to be at
    t_shifted = t + t_0;
    e2t = p.exp(2*t_shifted);
    et = p.exp(t_shifted);
    tanht = (e2t - 1)/(e2t + 1);
    secht = (2*et)/(e2t + 1);
    return dot(p, [x_center+r*tanht, r*secht]);
  }

  function traj_up(t,rgb) {
    p.fill(rgb[0],rgb[1],rgb[2]);
    return dot(p, [0,p.exp(t)]);
  }

  function traj_down(t,rgb) {
    p.fill(rgb[0],rgb[1],rgb[2]);
    return dot(p, [0,p.exp(-t)]);
  }

  // the geodesic of
  function mirror(z_1, z_2, z_start, z_end) {
    let z_1_r = H2.reflection(z_1, z_start, z_end);
    let z_2_r = H2.reflection(z_2, z_start, z_end);
    return H2.geodesic_segment(p,z_1_r, z_2_r);
  }
}

new p5(unit_speed, 'unit_speed');