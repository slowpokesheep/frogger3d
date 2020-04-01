/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import Options from '../options';
import ComplexObject from './extensions/complexObject';

import { colorObj } from '../utils/color';

// Primitives
import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class FroggerMap extends ComplexObject {
  constructor(s) {
    super();

    this.froggerMap = {
      size: s,
      gridSize: 15,
      blockSize: s / 15,
      row: [],
    };

    // Number of cubes left of or right of the center
    const n = Math.floor(this.froggerMap.gridSize / 2);

    const left = -n;
    const right = n;

    // Center cube
    this.objects.push(new Cube());
    this.objects.push(new CubeLines());

    // From bot-left to top-right
    // Rows
    for (let i = this.froggerMap.gridSize - n - 1; i > -n - 1; --i) {

      // Columns
      for (let j = left; j <= right; ++j) {

        const cube = new Cube();
        const cubeLines = new CubeLines();

        cube.setTranslation(j * this.froggerMap.blockSize, 0, i * this.froggerMap.blockSize);
        cubeLines.setTranslation(j * this.froggerMap.blockSize, 0, i * this.froggerMap.blockSize);

        this.objects.push(cube);
        this.objects.push(cubeLines);
      }
    }

    // The size of each row, for the render function
    for (let i = 1; i <= this.froggerMap.gridSize; ++i) {
      this.froggerMap.row.push((2 * i * this.froggerMap.gridSize) + 1);
    }

    this.resize();
  }

  resize() {
    this.objects.forEach((o, i) => {
      o.setScale(
        this.froggerMap.blockSize,
        this.froggerMap.size / 4,
        this.froggerMap.blockSize,
      );
    });
  }

  checkOptions() {

    if (Options.cubeSize.value !== this.froggerMap.size) {
      this.froggerMap.size = Options.cubeSize.value;
      this.resize();
    }
  }

  objectUpdate(du) {
    this.checkOptions();
  }

  render() {
    this.objects.forEach((o, i) => {

      // Special case center block to rotate the map correctly,
      // it has to be block 0 (so it doesn't follow the rules of the grid)
      if (i === 0) {
        gl.uniform4fv(shader.fragCol, colorObj.magenta);
      }

      if (i % 2 === 0) {

        if (i <= this.froggerMap.row[0] && i !== 0) { // Row 0
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i > this.froggerMap.row[0] && i <= this.froggerMap.row[1] && i !== 0) { // Row 1
          gl.uniform4fv(shader.fragCol, colorObj.magenta);
        }
        else if (i > this.froggerMap.row[1] && i <= this.froggerMap.row[2] && i !== 0) { // Row 2
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i > this.froggerMap.row[2] && i <= this.froggerMap.row[3] && i !== 0) { // Row 3
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i > this.froggerMap.row[3] && i <= this.froggerMap.row[4] && i !== 0) { // Row 4
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i > this.froggerMap.row[4] && i <= this.froggerMap.row[5] && i !== 0) { // Row 5
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i > this.froggerMap.row[5] && i <= this.froggerMap.row[6] && i !== 0) { // Row 6
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i > this.froggerMap.row[6] && i <= this.froggerMap.row[7] && i !== 0) { // Row 7
          gl.uniform4fv(shader.fragCol, colorObj.magenta);
        }
        else if (i > this.froggerMap.row[7] && i <= this.froggerMap.row[8] && i !== 0) { // Row 8
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i > this.froggerMap.row[8] && i <= this.froggerMap.row[9] && i !== 0) { // Row 9
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i > this.froggerMap.row[9] && i <= this.froggerMap.row[10] && i !== 0) { // Row 10
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i > this.froggerMap.row[10] && i <= this.froggerMap.row[11] && i !== 0) { // Row 11
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i > this.froggerMap.row[11] && i <= this.froggerMap.row[12] && i !== 0) { // Row 12
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i > this.froggerMap.row[12] && i <= this.froggerMap.row[13] && i !== 0) { // Row 13
          gl.uniform4fv(shader.fragCol, colorObj.green);
        }
        else if (i > this.froggerMap.row[13] && i <= this.froggerMap.row[14] && i !== 0) { // Row 14
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
      }

      o.render();
      resetRender();
    });
  }
}
