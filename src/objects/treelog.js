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
  constructor(s, direction, x = 0, z = 0, updateSpeed = 1, color = colorObj.red, size = 2) {
    super();

    this.treelog = {
      size,
      blockSize: s / 15,
      x,
      y: 7,
      z,
      move: s / 15,
      direction, // x
      updateSpeed,
      color,
      left: 0,
      right: 0,
      subDead: false, // Hotfix
      subTimeOfDeath: 0,
      prevTime: 0,
      moving: false,
    };

    // Left and right side of the water
    this.treelog.right = 7 * this.treelog.move;
    this.treelog.left = -7 * this.treelog.move;

    // Head
    this.objects.push(new Cube(true, false, this));
    this.objects[0].setTranslation(this.treelog.x, this.treelog.y, this.treelog.z);
    this.objects.push(new CubeLines(true, false, this));
    this.objects[1].setTranslation(this.treelog.x, this.treelog.y, this.treelog.z);

    const head = {
      x: this.objects[0].model.t.x,
      y: this.objects[0].model.t.y,
      z: this.objects[0].model.t.z,
    };

    for (let i = 1; i < this.treelog.size; ++i) {
      const cube = new Cube(true, false, this);
      cube.setTranslation(head.x + (i * this.treelog.move), head.y, head.z);
      this.objects.push(cube);

      const cubeLines = new CubeLines(true, false, this);
      cubeLines.setTranslation(head.x + (i * this.treelog.move), head.y, head.z);
      this.objects.push(cubeLines);
    }

    this.resize();
  }

  resize() {
    this.objects.forEach((o, i) => {
      o.setScale(
        this.treelog.blockSize,
        this.treelog.blockSize / 16,
        this.treelog.blockSize,
      );
    });
  }

  isSubDead() {
    if (this.treelog.subDead) return true;
    return false;
  }

  checkCollision(du, object, i) {

    // Only deal with left collision if the logs is moving to the left
    let ob = this.isLeftInvertColliding();
    if (ob) { // left, -x
      if (this.treelog.direction === -1) {
        this.objects.splice(i, 2);
        if (this.objects.length === 0) {
          this.treelog.subDead = true;
          this.treelog.subTimeOfDeath = currentTime;
        }
        return true;
      }
    }
    // Only deal with right collision if the logs is moving to the right
    ob = this.isRightInvertColliding();
    if (ob) { // right, +x
      if (this.treelog.direction === 1) {
        this.objects.splice(i, 2);
        if (this.objects.length === 0) {
          this.treelog.subDead = true;
          this.treelog.subTimeOfDeath = currentTime;
        }
        return true;
      }
    }

    return false;
  }

  move(o) {
    const m = this.treelog.move;

    if (this.treelog.direction === 1) { // right, +x
      o.modTranslation(m, 0, 0);
    }
    else { // left, -x
      o.modTranslation(-m, 0, 0);
    }
  }

  objectUpdate(du) {
    //this.checkOptions();

    // Movement update
    if (currentTime - this.treelog.prevTime >= this.treelog.updateSpeed) {

      // Movement and collision detection seperate because of splice
      // and smoother transiton
      this.treelog.moving = true;
      this.objects.forEach((o) => {
        this.move(o);
      });

      this.objects.forEach((o, i) => {
        if (i % 2 === 0) this.checkCollision(du, o, i);
      });
      this.treelog.prevTime = currentTime;
    }
  }

  render() {
    this.objects.forEach((o, i) => {
      if (i % 2 === 0 ) gl.uniform4fv(shader.fragCol, this.treelog.color);
      o.render();
      resetRender();
    });
  }
}
