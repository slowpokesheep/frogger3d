/* eslint-disable no-trailing-spaces */
/* eslint-disable array-bracket-spacing */
//  __  __       _        _               
// |  \/  | __ _| |_ _ __(_) ___ ___  ___ 
// | |\/| |/ _` | __| '__| |/ __/ _ \/ __|
// | |  | | (_| | |_| |  | | (_|  __/\__ \
// |_|  |_|\__,_|\__|_|  |_|\___\___||___/
//                                        
// Built upon MDN:
// https://github.com/gregtatum/mdn-model-view-projection/blob/master/shared/matrices.js

import { toDegrees, toRadians } from './util';

const { sin, cos, tan } = Math;

export function flattenMatrix(matrix) {
  const result = [];

  for (let i = 0; i < matrix.length; ++i) {
    for (let j = 0; j < matrix[i].length; ++j) {
      result.push(matrix[i][j]);
    }
  }
  return new Float32Array(result);
}

export function multiplyMatrices(u, v) {
  const result = [];

  for (let i = 0; i < u.length; ++i) {
    result.push([]);

    for (let j = 0; j < v.length; ++j) {
      let sum = 0.0;

      for (let k = 0; k < u.length; ++k) {
        sum += u[i][k] * v[k][j];
      }
      result[i].push(sum);
    }
  }

  return result;
}

export function multiplyArrayOfMatrices(matrices) {

  let inputMatrix = matrices[0];

  for (let i = 1; i < matrices.length; ++i) {
    inputMatrix = multiplyMatrices(inputMatrix, matrices[i]);
  }
  return inputMatrix;
}

export function rotateXMatrix(angle) {
  const theta = toRadians(angle);
  return [
    [1,            0,            0,     0],
    [0,   cos(theta),   sin(theta),     0],
    [0,  -sin(theta),   cos(theta),     0],
    [0,            0,            0,     1],
  ];
}

export function rotateYMatrix(angle) {
  const theta = toRadians(angle);
  return [
    [cos(theta),    0,   -sin(theta),     0],
    [         0,    1,             0,     0],
    [sin(theta),    0,    cos(theta),     0],
    [         0,    0,             0,     1],
  ];
}

export function rotateZMatrix(angle) {
  const theta = toRadians(angle);
  return [
    [ cos(theta),  sin(theta),    0,     0],
    [-sin(theta),  cos(theta),    0,     0],
    [          0,           0,    1,     0],
    [          0,           0,    0,     1],
  ];
}

export function translateMatrix(x, y, z) {
  return [
    [1,  0,  0,  0],
    [0,  1,  0,  0],
    [0,  0,  1,  0],
    [x,  y,  z,  1],
  ];
}

export function scaleMatrix(w, h, d) {
  return [
    [w,  0,  0,  0],
    [0,  h,  0,  0],
    [0,  0,  d,  0],
    [0,  0,  0,  1],
  ];
}

export function identityMatrix() {
  return [
    [1,  0,  0,  0],
    [0,  1,  0,  0],
    [0,  0,  1,  0],
    [0,  0,  0,  1],
  ];
}

// modelViewMatrix(scale, rotateX, rotateY, rotateZ, position)
export function modelViewMatrix(...matrices) {
  const mv = multiplyArrayOfMatrices(matrices);
  return flattenMatrix(mv);
}

export function viewMatrix(...matrices) {
  const view = multiplyArrayOfMatrices(matrices);
  return flattenMatrix(view);
}

/*
  fovy    = the angle in degrees of what's in view along the Y axis
  aspect  = the ratio of the canvas, canvas.width / canvas.height
  near    = Anything before this point in the Z direction gets
            clipped (outside of the clip space)
  far     = Anything after this point in the Z direction gets clipped
            (outside of the clip space)
*/
export function perspectiveMatrix(fovy, aspect, near, far) {
  const f = 1.0 / tan(toRadians(fovy) / 2);
  const d = 1 / (near - far);

  return new Float32Array(
    [
      f / aspect, 0,                    0,     0,
      0,          f,                    0,     0,
      0,          0,     (near + far) * d,    -1,
      0,          0,   near * far * d * 2,     0,
    ],
  );
}
