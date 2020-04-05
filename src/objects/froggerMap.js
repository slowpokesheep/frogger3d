/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import Options from '../options';
import ComplexObject from './extensions/complexObject';

import { colorObj, colorComplexObj } from '../utils/color';

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

    let id = 0;

    // From bot-left to top-right, center of the map has to be at 0, 0 for it to rotate correctly
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
        id++;
      }
    }

    // The size of each row, for the render function
    for (let i = 1; i <= this.froggerMap.gridSize; ++i) {
      this.froggerMap.row.push((2 * i * this.froggerMap.gridSize));
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

      if (i % 2 === 0) {

        // Row 0 closest row (+z)
        if (i < this.froggerMap.row[0]) { // Row 0

          if (i >= Options.frogLifes.value * 2) {
            gl.uniform4fv(shader.fragCol, colorObj.black);
          }
          // Draw frog lifes
          else if (i >= (Options.frogLifes.value - 15) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transRed2);
          }
          else if (i >= (Options.frogLifes.value - 30) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transGreen2);
          }
          else if (i >= (Options.frogLifes.value - 45) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transYellow2);
          }
          else if (i >= (Options.frogLifes.value - 60) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transBlue2);
          }
          else if (i >= (Options.frogLifes.value - 75) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transRed);
          }
          else if (i >= (Options.frogLifes.value - 90) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transGreen);
          }
          else {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transBlue);
          }
        }
        else if (i >= this.froggerMap.row[0] && i < this.froggerMap.row[1]) { // Row 1
          gl.uniform4fv(shader.fragCol, colorObj.magenta);
        }
        else if (i >= this.froggerMap.row[1] && i < this.froggerMap.row[2]) { // Row 2
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i >= this.froggerMap.row[2] && i < this.froggerMap.row[3]) { // Row 3
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i >= this.froggerMap.row[3] && i < this.froggerMap.row[4]) { // Row 4
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i >= this.froggerMap.row[4] && i < this.froggerMap.row[5]) { // Row 5
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i >= this.froggerMap.row[5] && i < this.froggerMap.row[6]) { // Row 6
          gl.uniform4fv(shader.fragCol, colorObj.black);
        }
        else if (i >= this.froggerMap.row[6] && i < this.froggerMap.row[7]) { // Row 7
          gl.uniform4fv(shader.fragCol, colorObj.magenta);
        }
        else if (i >= this.froggerMap.row[7] && i < this.froggerMap.row[8]) { // Row 8
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i >= this.froggerMap.row[8] && i < this.froggerMap.row[9]) { // Row 9
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i >= this.froggerMap.row[9] && i < this.froggerMap.row[10]) { // Row 10
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i >= this.froggerMap.row[10] && i < this.froggerMap.row[11]) { // Row 11
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i >= this.froggerMap.row[11] && i < this.froggerMap.row[12]) { // Row 12
          gl.uniform4fv(shader.fragCol, colorObj.blue);
        }
        else if (i >= this.froggerMap.row[12] && i < this.froggerMap.row[13]) { // Row 13
          gl.uniform4fv(shader.fragCol, colorObj.green);
        }
        else if (i >= this.froggerMap.row[13] && i < this.froggerMap.row[14]) { // Row 14
          if (i >= this.froggerMap.row[13] + Options.frogWins.value * 2) {
            gl.uniform4fv(shader.fragCol, colorObj.black);
          }
          // Draw wins
          else if (i >= this.froggerMap.row[13] + (Options.frogWins.value - 15) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transRed2);
          }
          else if (i >= this.froggerMap.row[13] + (Options.frogWins.value - 30) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transGreen2);
          }
          else if (i >= this.froggerMap.row[13] + (Options.frogWins.value - 45) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transYellow2);
          }
          else if (i >= this.froggerMap.row[13] + (Options.frogWins.value - 60) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transBlue2);
          }
          else if (i >= this.froggerMap.row[13] + (Options.frogWins.value - 75) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transRed);
          }
          else if (i >= this.froggerMap.row[13] + (Options.frogWins.value - 90) * 2) {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transGreen);
          }
          else {
            gl.uniform4fv(shader.fragCol, colorComplexObj.transBlue);
          }
        }
      }

      o.render();
      resetRender();
    });
  }
}
