// modified off tutorials in https://webglfundamentals.org/
// TODO: enable change in color
function clearAllAndResizeCanvas(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.canvas.width = gl.canvas.clientWidth;
  gl.canvas.height = gl.canvas.clientHeight;
  gl.canvas.left = gl.canvas.clientLeft;
  gl.canvas.top = gl.canvas.clientTop;
  gl.viewport(gl.canvas.left, gl.canvas.top, gl.canvas.width, gl.canvas.height)
}

function setBuffersAndAttributes(gl, programInfo, bufferInfo) {
  // 1. Position
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.position.buffer);
    gl.vertexAttribPointer(
      programInfo.attribSetters.aVertexPosition.location,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribSetters.aVertexPosition.location);
  }

  // 2. Normal mapping
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.normal.buffer);
    gl.vertexAttribPointer(
      programInfo.attribSetters.aVertexNormal.location,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribSetters.aVertexNormal.location);
  }

  // 3. Texture mapping
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.textureCoord.buffer);
    gl.vertexAttribPointer(
      programInfo.attribSetters.aTextureCoord.location,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribSetters.aTextureCoord.location);
  }

  // 4. Index
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
}

function getGlobalUniforms(gl, globalUniforms) {
  var projectionMatrix = mat4.create();
  const projectionUniforms = globalUniforms.projectionUniforms;
  mat4.perspective(
    projectionMatrix,
    projectionUniforms.fieldOfView,
    /*aspect=*/ gl.canvas.clientWidth / gl.canvas.clientHeight,
    projectionUniforms.zNear,
    projectionUniforms.zFar);

  var viewMatrix = mat4.create();
  const cameraUniforms = globalUniforms.cameraUniforms;
  mat4.lookAt(
    viewMatrix,
    cameraUniforms.eye,
    cameraUniforms.center,
    cameraUniforms.up);

  return {
    projectionMatrix: projectionMatrix,
    viewMatrix: viewMatrix,
    uLightPos: globalUniforms.lightPos,
    uViewPos: cameraUniforms.eye,
  };
}

function getModelMatrix(objectInfo, cubeRotation) {
  var modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, objectInfo.modelLocation);

  var modelRotations = objectInfo.modelRotations;
  if (modelRotations != null) {
    for (var i = 0; i < modelRotations.length; ++i) {
      mat4.rotate(modelMatrix, modelMatrix, modelRotations[i].rot, modelRotations[i].axis);
    }
  }

  var frameRotationsFn = objectInfo.frameRotationsFn;
  if (frameRotationsFn != null) {
    var frameRotations = frameRotationsFn(cubeRotation);
    for (var i = 0; i < frameRotations.length; ++i) {
      mat4.rotate(modelMatrix, modelMatrix, frameRotations[i].rot, frameRotations[i].axis);
    }
  }

  return modelMatrix;
}

function setObjectUniforms(gl, programInfo, objectInfo, cubeRotation, globalUniforms) {
  const modelViewMatrix = mat4.create();
  const modelMatrix = getModelMatrix(objectInfo, cubeRotation);
  mat4.multiply(modelViewMatrix, globalUniforms.viewMatrix, modelMatrix);

  // Should normal matrix be transformed accordingly as well?
  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelMatrix);
  // mat4.invert(normalMatrix, modelViewMatrix); //Q: model or model view?
  mat4.transpose(normalMatrix, normalMatrix);

  const uMatrix = mat4.create();
  mat4.multiply(uMatrix, globalUniforms.projectionMatrix, modelViewMatrix);

  const uniforms = {};
  uniforms.uLightPos = globalUniforms.uLightPos;
  uniforms.uViewPos = globalUniforms.uViewPos;
  uniforms.uModelMatrix = modelMatrix;
  uniforms.uMatrix = uMatrix;
  uniforms.uNormalMatrix = normalMatrix;
  twgl.setUniforms(programInfo, uniforms);
}

//function setObjectTexture(gl, programInfo, textureIndex) {
function setObjectTexture(gl, programInfo, texture, textureIndex) {
  gl.activeTexture(gl.TEXTURE0 + textureIndex);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(programInfo.uniformSetters.uSampler.location, textureIndex);
}

function bindSingleColoredTexture(gl, rgba) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Put a single pixel in the texture.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array(rgba);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  return texture;
}

function bindTexturesFromColors(gl, colors) {
  var textures = [];

  //textures.push(bindSingleColoredTexture(gl, COLORS.RED));
  for(var i = 0; i < colors.length; ++i) {
    textures.push(bindSingleColoredTexture(gl, colors[i]));
  }

  return textures;
}

function getScaledObjectArrays(objectParam) {
  const arrays = objectParam.modelParams.arrays;
  const scale = objectParam.modelScaling;
  if (scale == null) {
    return arrays;
  }
  return {
    position: arrays.position.map(x => x * scale),
    normal: arrays.normal,
    textureCoord: arrays.textureCoord,
    indices: arrays.indices,
  };
}

function createObjectsToDraw(gl, programInfo, objectParams) {
  const results = [];

  for (var i = 0; i < objectParams.length; ++i) {
    const objectParam = objectParams[i];
    const scaledObjectArrays = getScaledObjectArrays(objectParam);
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, scaledObjectArrays);
    const object = {
      programInfo: programInfo,
      bufferInfo: bufferInfo,
      objectInfo: {
        modelLocation: objectParam.modelLocation,
        vertexCount: objectParam.modelParams.vertexCount,
        modelRotations: objectParam.modelRotations,
        frameRotationsFn: objectParam.frameRotationsFn
      },
      textureIndex: objectParam.textureIndex,
    };
    results.push(object);
  }

  return results;
}

function drawObject(gl, programInfo, bufferInfo, objectInfo, textureIndex, cubeRotation, globalUniforms, textures) {
  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setObjectUniforms(gl, programInfo, objectInfo, cubeRotation, globalUniforms);
  setObjectTexture(gl, programInfo, textures[textureIndex], textureIndex);
  // Instruct WebGL to draw
  {
    const primitiveType = gl.TRIANGLES;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    const vertexCount = objectInfo.vertexCount;
    gl.drawElements(primitiveType, vertexCount, type, offset);
  }
}

function drawScene(gl, objectsToDraw, cubeRotation, globalUniforms, textures) {
  clearAllAndResizeCanvas(gl);
  const transformedGlobalUniforms = getGlobalUniforms(gl, globalUniforms);
  const numObjects = objectsToDraw.length;
  for(var i = 0; i < numObjects; ++i) {
    const object = objectsToDraw[i];
    drawObject(gl, object.programInfo, object.bufferInfo, object.objectInfo, object.textureIndex, cubeRotation, transformedGlobalUniforms, textures);
  }
}

function renderingMainLoop(sceneInfo) {
  const gl = document.querySelector(sceneInfo.canvasId).getContext("webgl");

  // Common parameters
  const programInfo = twgl.createProgramInfo(gl, sceneInfo.shaders);
  const textures = bindTexturesFromColors(gl, sceneInfo.textureColors);
  var objectsToDraw = createObjectsToDraw(gl, programInfo, sceneInfo.objectParams);

  var cubeRotation = 0.0;
  var then = 0;
  function render(now) {
    now *= 0.001; // convert to seconds
    const deltaTime = then - now;
    then = now;
    drawScene(gl, objectsToDraw, cubeRotation, sceneInfo.globalUniforms, textures);
    cubeRotation += deltaTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}