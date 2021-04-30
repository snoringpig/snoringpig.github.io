const cubeFrameRotationsFn = function(t) {
    return [
        {rot: t, axis: [0, 0, 1]},
        {rot: 0.7 * t, axis: [0, 1, 0], }
    ];
};

function gridCubeParams() {
  const results = [];
  for (var x = -3; x < 4; x+=2) {
    for (var y = -2; y < 3; y+=2) {
      for (var z = 6; z < 50; z+=2) {
        const t = Math.floor(Math.random() * 3);
        const obj = {
          modelParams: cubeParams,
          textureIndex: t,
          modelLocation: [x, y, -z],
          frameRotationsFn: cubeFrameRotationsFn
        };
        if (Math.random() > 1-density) {
          results.push(obj);
        }
      }
    }
  }
  return results;
}

function ready() {
    renderMathInElement(document.body, {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
        ]
    });
}

function main() {
  ready();

  const objectParams = gridCubeParams();
  const scene1Info = {
    canvasId: '#c1',
    shaders: ["vs", "fs"],
    textureColors: [COLORS.RED, COLORS.BLUE, COLORS.GREEN],
    objectParams: objectParams,
    globalUniforms: {
      projectionUniforms: defaultProjectionUniforms,
      cameraUniforms: defaultCameraUniforms,
      lightPos: [0, 10, -3],
    }
  };
  const scene2Info = {
    canvasId: '#c2',
    shaders: ["vs", "fs"],
    textureColors: [COLORS.RED, COLORS.YELLOW, COLORS.CYAN],
    objectParams: objectParams,
    globalUniforms: {
      projectionUniforms: defaultProjectionUniforms,
      cameraUniforms: defaultCameraUniforms,
      lightPos: [0, -10, -3],
    }
  };
  renderingMainLoop(scene1Info);
  renderingMainLoop(scene2Info);
}

// TODO: support input other models (other than cube)
// TODO: support input models in other format (e.g. THREE.js)

// Test: a spring + a ball, a ball placed at the spring, that reacts to user interaction (e.g. press => bounce)