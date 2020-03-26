/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-cycle */

import initShaders from './initShaders';
import { perspectiveMatrix, flattenMatrix } from '../utils/matrices';
import { managers } from '../index';

export let gl;
export const shader = {};

let program;
export const bufferSize = 10000; // 10 kb // 8 * 3

export const resetRender = () => {
  gl.uniform4fv(shader.fragCol, [0, 0, 0, 0]);
  gl.uniform4fv(shader.fragAlpha, [0, 0, 0, 0]);
  gl.cullFace(gl.BACK);
};

export async function setup(canvas, man) {
  gl = canvas.getContext('webgl');
  if (!gl) console.error('WebGL isn\'t available');

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.enable(gl.CULL_FACE);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  //  Load shaders
  const shaders = [
    '../shaders/shader.vert',
    '../shaders/shader.frag',
  ];

  // Wait for program
  program = await initShaders(gl, shaders);

  gl.useProgram(program);
  bufferSetup(managers.obj.getPoints(), managers.obj.getColors());
  shaderVariables();
}

// Order sensitive, vBuffer -> vPosition
// cBuffer -> vColor
function bufferSetup(points, colors) {

  // Vertex //
  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flattenMatrix(points), gl.STATIC_DRAW);

  const vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // COLOR //
  const cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flattenMatrix(colors), gl.STATIC_DRAW);

  const vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
}

function shaderVariables() {
  // Vertex shader
  shader.projection = gl.getUniformLocation(program, 'projection');
  shader.view = gl.getUniformLocation(program, 'view');
  shader.modelView = gl.getUniformLocation(program, 'modelView');

  // Fragment shader
  shader.fragCol = gl.getUniformLocation(program, 'fragCol');
  shader.fragAlpha = gl.getUniformLocation(program, 'fragAlpha');

  // Initial values
  const pro = perspectiveMatrix(90, 1.0, 0.1, 300);

  gl.uniformMatrix4fv(shader.projection, false, pro);
}
