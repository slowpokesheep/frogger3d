/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import Options from '../options';
import ComplexObject from './extensions/complexObject';
import { eatKey } from '../globalKeyHandler';
import { colorObj } from '../utils/color';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class Frog extends ComplexObject {
  constructor(s) {
    super();

    this.frog = {
      size: s,
      blockSize: s / 15,
      x: 0,
      y: 8,
      z: 0,
      move: s / 15,
      keys: {
        up: 'W'.charCodeAt(0),
        left: 'A'.charCodeAt(0),
        down: 'S'.charCodeAt(0),
        right: 'D'.charCodeAt(0),
      },
    };

    // Update from 0, 0, 0 coord
    this.frog.z = 7 * this.frog.move;

    this.objects.push(new Cube());
    this.objects[0].setTranslation(this.frog.x, this.frog.y, this.frog.z);

    this.resize();
  }

  resize() {
    this.objects.forEach((o, i) => {
      o.setScale(
        this.frog.blockSize,
        this.frog.blockSize,
        this.frog.blockSize,
      );
    });
  }

  move() {

    // Move up, -z
    if (eatKey(this.frog.keys.up)) {
      this.frog.z -= this.frog.move;
    }
    // Move left, -x
    if (eatKey(this.frog.keys.left)) {
      this.frog.x -= this.frog.move;
    }
    // Move up, +z
    if (eatKey(this.frog.keys.down)) {
      this.frog.z += this.frog.move;
    }
    // Move up, +x
    if (eatKey(this.frog.keys.right)) {
      this.frog.x += this.frog.move;
    }
  }

  objectUpdate(du) {
    //this.checkOptions();

    // Movement update
    this.move();

    this.objects.forEach((o, i) => {
      o.setTranslation(this.frog.x, this.frog.y, this.frog.z);
      //this.checkCollision(du);
    });
  }

  render() {
    this.objects.forEach((o) => {
      gl.uniform4fv(shader.fragCol, colorObj.green);
      o.render();
    });
  }
}
