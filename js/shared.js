const PI = Math.PI;

class Complex {
	constructor() {}

	static add(z_1, z_2) {
		const x = z_1[0] + z_2[0];
		const y = z_1[1] + z_2[1];
		return [x, y];
	}

	static subtract(z_1, z_2) {
		const x = z_1[0] - z_2[0];
		const y = z_1[1] - z_2[1];
		return [x, y];
	}

	static mult(z_1, z_2) {
		const x_1 = z_1[0];
		const y_1 = z_1[1];
		const x_2 = z_2[0];
		const y_2 = z_2[1];
		const x = x_1 * x_2 - y_1 * y_2;
		const y = x_1 * y_2 + x_2 * y_1;
		return [x, y];
	}

	static div(z_1, z_2) {
		const x_2 = z_2[0];
		const y_2 = z_2[1];
		const r2 = x_2 * x_2 + y_2 * y_2;
		return Complex.mult(z_1, [x_2/r2, -y_2/r2]);
	}

	static abs(z) {
		const x = z[0];
		const y = z[1];
		return Math.sqrt(x*x + y*y);
	}

	static normalize(z) {
		const r = abs(z);
		if (r == 0) {
			return 0;
		}
		return [z[0]/r, z[1]/r];
	}

	static conjugate(z) {
		return [z[0], -z[1]]
	}
}

// some hacky matrix function
// input type: math.matrix
function inv(m) {
	let [[a,b],[c,d]] = m.valueOf();
	let det_inv = a*d-b*c;
	return math.matrix([[det_inv*d, det_inv*-a],[det_inv*-b, det_inv*c]]);
}

// 2D hyperbolic space
class H2 {
	// z |-> (z-i)(z+i)
	// TODO: let input be P^1(C) to incorporate inf
	static u_to_d(z) {
    const x = z[0];
    const y = z[1];
    const denom = x*x + (y+1)*(y+1);
    const x_output = (x*x + y*y - 1)/denom;
    const y_output = (-2*x)/denom;
    return [x_output,y_output];
	}

  // w |-> (-i)*(w+1)/(w-1)
  // TODO: allow input to be 1 (this is when output is inf)
  static d_to_u(w) {
    return Complex.div(Complex.mult([0,-1], [w[0]+1,w[1]]), [w[0]-1,w[1]]);
  }

  // The following are all for the upper half plane model.
  // TODO: maybe make a subclass for this?
  static geodesic(p, x_center,r, theta_start, theta_end) {
    const theta_delta = PI/200;
    const theta_min = Math.min(theta_start,theta_end);
    const theta_max = Math.max(theta_start,theta_end);
    let theta = theta_min;
    p.noFill();
    p.beginShape();
    while (theta < theta_max) {
      p.vertex(
        canvas_x_dummy(p, x_center + r*Math.cos(theta)),
        canvas_y_dummy(p, r*Math.sin(theta))
      );
      theta += theta_delta;
    }
    p.endShape();
  }

	static geodesic_segment(p, z_1, z_2) {
	  let x_1 = z_1[0];
	  let y_1 = z_1[1];
	  let x_2 = z_2[0];
	  let y_2 = z_2[1];
	  if (x_1 == x_2) {
	    // straight line
	    p.line(canvas_x_dummy(p,x_1),canvas_y_dummy(p,y_1),canvas_x_dummy(p,x_2),canvas_y_dummy(p,y_2));
	  } else {
	    const x_center = (x_2*x_2 + y_2*y_2 - x_1*x_1 - y_1*y_1)/(2*(x_2 - x_1));
	    const r = Math.sqrt((x_1 - x_center) * (x_1 - x_center) + y_1 * y_1);
	    if (x_1 > x_2) {
	      let z_temp = z_1;
	      z_1 = z_2;
	      z_2 = z_temp;
	    }
	    p.noFill();
	    let canvas_r_x = Math.abs(canvas_x_dummy(p,r) - canvas_x_dummy(p,0));
	    let canvas_r_y = Math.abs(canvas_y_dummy(p,r) - canvas_y_dummy(p,0));
	    let theta_1 = Math.acos((z_1[0]-x_center)/r);
	    let theta_2 = Math.acos((z_2[0]-x_center)/r);
	    p.arc(canvas_x_dummy(p,x_center), canvas_y_dummy(p,0), 2*canvas_r_x, 2*canvas_r_y,
	    	Math.max(theta_1,2*PI-theta_1), Math.max(theta_2,2*PI-theta_2));
	/*
	    p.fill(255,0,0)
	    dot(p, x_center,0);
	    */
	    /*
	    const numSteps = 200;
	    p.beginShape();
	    for (i=0;i<numSteps;i++) {
	      let x = x_center + r*p.cos(PI/numSteps*i);
	      if (x >= z_2[0] && x <= z_1[0]) {
	        let y = r*p.sin(PI/numSteps*i);
	        p.vertex(canvas_x(x), canvas_y(y));
	      }
	    }
	    p.endShape();
	    */
	  }
	}

  // reflection wrt the gedesic containing (z_1, z_2)
  static reflection(z, z_1, z_2) {
    let x_1 = z_1[0];
    let y_1 = z_1[1];
    let x_2 = z_2[0];
    let y_2 = z_2[1];
    if (x_1 == x_2) {
      return [2*x_1-z[0], z[1]];
    }
    const x_center = (x_2*x_2 + y_2*y_2 - x_1*x_1 - y_1*y_1)/(2*(x_2 - x_1));
    const r = Math.sqrt((x_1 - x_center) * (x_1 - x_center) + y_1 * y_1);
    let output = Complex.add([x_center,0], Complex.div([r*r,0], Complex.subtract(Complex.conjugate(z), [x_center, 0])));
    if (Math.abs(output[0]) < 0.000001) {
      output[0] = 0;
    }
    return output;
  }
}

function canvas_x_dummy(p, x) {
	return p.map(x, p.bounds['x_min'], p.bounds['x_max'], p.padding['left'], p.width-p.padding['right']);
}

function canvas_y_dummy(p, y) {
	return p.map(y, p.bounds['y_min'], p.bounds['y_max'], p.height-p.padding['bottom'], p.padding['top']);
}

function dot(p, z, scale=1) {
	p.ellipse(canvas_x_dummy(p, z[0]), canvas_y_dummy(p, z[1]), 10*scale, 10*scale);
}

// The following are only for the upper half plane model
function xAxis(p, y) {
	return p.line(p.padding['left'], canvas_y_dummy(p, y), p.width-p.padding['right'], canvas_y_dummy(p, y));
}

function yAxis(p, x) {
	p.line(canvas_x_dummy(p, x), p.padding['top'], canvas_x_dummy(p, x), p.height - p.padding['bottom']);
}