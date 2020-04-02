/* eslint-disable class-methods-use-this */
/* eslint-disable array-bracket-spacing */
/* eslint-disable import/no-cycle */
/* eslint-disable indent */
import { gl } from '../../setup/webgl';
import { colorObj } from '../../utils/color';
import BasicObject from '../extensions/basicObject';

// Static variable
let offset;

export default class CubeLines extends BasicObject {
  constructor(...args) {
    super(...args);

    this.cube();
    this.prim.size = this.prim.points.length;
  }

  // Private constructor methods

  cube() {
    this.quad( 0, 1, 2 ); // Front
    this.quad( 3, 0, 4 ); // Front -> Left
    this.quad( 5, 1, 5 ); // Left
    this.quad( 6, 7, 4 ); // Back
    this.quad( 7, 3, 2, 6 ); // Right
    this.quad( 2, 1, 0); // Reset
  }

  quad(...args) {
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

    args.forEach((i) => {
      this.prim.points.push(vertices[i]);
      this.prim.colors.push(colorObj.white);
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
    gl.drawArrays(gl.LINE_STRIP, offset, this.prim.size);
  }
}
