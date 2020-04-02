/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import { currentTime } from '../render';
import Options from '../options';
import ComplexObject from './extensions/complexObject';
import { colorObj } from '../utils/color';
import { eatKey } from '../globalKeyHandler';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class Treelog extends ComplexObject {
  constructor(s, direction, x = 0, z = 0, speed = 1, color = colorObj.red, size = 2) {
    super();

    this.treelog = {
      size,
      blockSize: s / 15,
      x,
      y: 6,
      z,
      move: s / 15,
      direction, // -x
      speed,
      color,
      left: 0,
      right: 0,
      subDead: false, // Hotfix
    };

    // Left and right side of the water
    this.treelog.left = 7 * this.treelog.move;
    this.treelog.right = -7 * this.treelog.move;

    // Head
    this.objects.push(new Cube(true, false));
    this.objects[0].setTranslation(this.treelog.x, this.treelog.y, this.treelog.z);
    this.objects.push(new CubeLines(true, false));
    this.objects[1].setTranslation(this.treelog.x, this.treelog.y, this.treelog.z);

    const head = {
      x: this.objects[0].model.t.x,
      y: this.objects[0].model.t.y,
      z: this.objects[0].model.t.z,
    };

    for (let i = 1; i < this.treelog.size; ++i) {
      const cube = new Cube(true, false);
      cube.setTranslation(head.x + (i * this.treelog.move), head.y, head.z);
      this.objects.push(cube);

      const cubeLines = new CubeLines(true, false);
      cubeLines.setTranslation(head.x + (i * this.treelog.move), head.y, head.z);
      this.objects.push(cubeLines);
    }

    this.resize();
  }

  resize() {
    this.objects.forEach((o, i) => {
      o.setScale(
        this.treelog.blockSize,
        this.treelog.blockSize,
        this.treelog.blockSize,
      );
    });
  }

  isSubDead() {
    if (this.subDead) return true;
    return false;
  }

  checkCollision(du, object, i) {

    // Inverse collision, move it to the other side of the box
    const ob = this.isObjectInvertColliding(i);
    if (ob) {

      if (i === 0) this.subDead = true;
      /*
      if (this.treelog.direction) { // right, +x
        object.setTranslation(this.treelog.left, this.treelog.y, this.treelog.z);
      }
      else { // left, -x
        object.setTranslation(this.treelog.left, this.treelog.y, this.treelog.z);
      }
      */
    }
  }

  move(o) {
    const m = this.treelog.speed * this.treelog.move;

    if (this.treelog.direction) { // +x
      o.modTranslation(-m, 0, 0);
    }
    else { // -x
      o.modTranslation(m, 0, 0);
    }
  }

  objectUpdate(du) {
    //this.checkOptions();

    // Movement update
    this.objects.forEach((o, i) => {
      this.move(o, i);
      this.checkCollision(du, o, i);
    });
  }

  render() {
    this.objects.forEach((o, i) => {
      if (i % 2 === 0 ) gl.uniform4fv(shader.fragCol, this.treelog.color);
      o.render();
      resetRender();
    });
  }
}
