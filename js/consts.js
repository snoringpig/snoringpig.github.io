var mat4 = glMatrix.mat4;

const cubePositions          = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
].map(x => x * .3);

const scale = 0.3;
const planePositions = [
    // Front face
    -10.0, -1.0,  10.0,
    10.0, -1.0,  10.0,
    10.0,  1.0,  10.0,
    -10.0,  1.0,  10.0,

    // Back face
    -10.0, -1.0, -10.0,
    -10.0,  1.0, -10.0,
    10.0,  1.0, -10.0,
    10.0, -1.0, -10.0,

    // Top face
    -10.0,  1.0, -10.0,
    -10.0,  1.0,  10.0,
    10.0,  1.0,  10.0,
    10.0,  1.0, -10.0,

    // Bottom face
    -10.0, -1.0, -10.0,
    10.0, -1.0, -10.0,
    10.0, -1.0,  10.0,
    -10.0, -1.0,  10.0,

    // Right face
    10.0, -1.0, -10.0,
    10.0,  1.0, -10.0,
    10.0,  1.0,  10.0,
    10.0, -1.0,  10.0,

    // Left face
    -10.0, -1.0, -10.0,
    -10.0, -1.0,  10.0,
    -10.0,  1.0,  10.0,
    -10.0,  1.0, -10.0,
].map(x => x * scale);

const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
];

const vertexNormals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
];

const indices            = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
];

const cubeParams = {
    arrays: {
      position: cubePositions,
      normal: vertexNormals,
      textureCoord: textureCoordinates,
      indices: indices,
    },
    vertexCount: 36,
};

const planeParams = {
    arrays: {
      position: planePositions,
      normal: vertexNormals,
      textureCoord: textureCoordinates,
      indices: indices,
    },
    vertexCount: 36,
};

/****** Global uniforms ********************/
/****** For Vieweing ***********************/
// Define perspective matrix
const defaultProjectionUniforms = {
    fieldOfView: 45 * Math.PI / 180,
    zNear      : 0.1,
    zFar       : 100.0,
};

// Define view matrix
const defaultCameraUniforms = {
    eye: [0, 0, 0],
    center: [0, 0, -10],
    up: [0, 1, 0],
};

/****** Others *****************************/
const speed = 2.5;
const density = 0.8;
/*******************************************/