/* eslint-disable class-methods-use-this */
/* eslint-disable array-bracket-spacing */
/* eslint-disable import/no-cycle */
/* eslint-disable indent */
import { gl } from '../../setup/webgl';
import { colorArray } from '../../utils/color';
import BasicObject from '../extensions/basicObject';

// Static variable
let offset;

export default class Cube extends BasicObject {
  constructor(args) {
    super(args);

    this.colorCube();
    this.prim.size = this.prim.points.length;
  }

  // Private constructor methods

  colorCube() {
    this.quad( 1, 0, 3, 2 ); // Front
    this.quad( 2, 3, 7, 6 ); // Right
    this.quad( 3, 0, 4, 7 ); // Bot
    this.quad( 6, 5, 1, 2 ); // Top
    this.quad( 4, 5, 6, 7 ); // Back
    this.quad( 5, 4, 0, 1 ); // Left
  }

  quad(a, b, c, d) {
    const vertices = [
      [-0.5, -0.5,  0.5],
      [-0.5,  0.5,  0.5],
      [ 0.5,  0.5,  0.5],
      [ 0.5, -0.5,  0.5],
      [-0.5, -0.5, -0.5],
      [-0.5,  0.5, -0.5],
      [ 0.5,  0.5, -0.5],
      [ 0.5, -0.5, -0.5],
    ];

    // Two triangles to makeup one side of the cube
    const indices = [a, b, c, a, c, d];

    indices.forEach((i, j) => {
      this.prim.points.push(vertices[i]);
      this.prim.colors.push(colorArray[a]);
    });
  }

  // Methods for objectManager to initialize the buffers
  setOffset(off) {
    offset = off;
  }

  // For debugging
  getOffset() { return offset; }

  render() {
    super.render();
    gl.drawArrays(gl.TRIANGLES, offset, this.prim.size);
  }
}
