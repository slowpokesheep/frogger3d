/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import { currentTime } from '../render';
import Options from '../options';
import ComplexObject from './extensions/complexObject';
import { colorObj } from '../utils/color';
import { eatKey } from '../globalKeyHandler';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class Car extends ComplexObject {
  constructor(s, z = 0, color = colorObj.red) {
    super();

    this.car = {
      blockSize: s / 15,
      x: 0,
      y: 8,
      z,
      move: s / 15,
      direction: 0, // -x
      updateSpeed: 0,
      color,
      left: 0,
      right: 0,
      subDead: false, // Hotfix
      prevTime: 0,
    };

    this.init();

    // Left and right side of the street
    this.car.right = 7 * this.car.move;
    this.car.left = -7 * this.car.move;

    //this.objects.push(new Cube());
    //this.objects[0].setTranslation(this.car.x, this.car.y, this.car.z);

    // Head
    this.objects.push(new Cube());
    this.objects[0].setTranslation(this.car.x, this.car.y, this.car.z);
    this.objects.push(new CubeLines());
    this.objects[1].setTranslation(this.car.x, this.car.y, this.car.z);

    const head = {
      x: this.objects[0].model.t.x,
      y: this.objects[0].model.t.y,
      z: this.objects[0].model.t.z,
    };

    for (let i = 1; i < this.car.size; ++i) {
      const cube = new Cube();
      cube.setTranslation(head.x + (i * this.car.move), head.y, head.z);
      this.objects.push(cube);

      const cubeLines = new CubeLines();
      cubeLines.setTranslation(head.x + (i * this.car.move), head.y, head.z);
      this.objects.push(cubeLines);
    }

    this.resize();
  }

  resize() {
    this.objects.forEach((o, i) => {
      o.setScale(
        this.car.blockSize,
        this.car.blockSize,
        this.car.blockSize,
      );
    });
  }

  init() {
    // Direction, pos
    this.car.direction = Math.random() >= 0.5 ? 1 : -1;
    this.car.x = -this.car.direction * 7 * this.car.move;

    // Size
    const size = [1, 1, 2, 2, 2, 2, 3, 3, 4];
    this.car.size = size[Math.floor(Math.random() * size.length)];

    this.resetOnCollision();
  }

  resetOnCollision() {
    // Speed
    const speed = [0.125, 0.25, 0.25, 0.5, 0.5, 0.5, 1, 1, 1, 1.5];
    this.car.updateSpeed = speed[Math.floor(Math.random() * speed.length)]; // speed
  }

  isSubDead() {
    if (this.subDead) return true;
    return false;
  }

  checkCollision(du, object, i) {

    // Only deal with left collision if the logs is moving to the left
    let ob = this.isLeftInvertColliding();
    if (ob) { // left, -x
      if (this.car.direction === -1) {
        object.setTranslation(this.car.right, this.car.y, this.car.z);
        this.resetOnCollision();
        return true;
      }
    }
    // Only deal with right collision if the logs is moving to the right
    ob = this.isRightInvertColliding();
    if (ob) { // right, +x
      if (this.car.direction === 1) {
        object.setTranslation(this.car.left, this.car.y, this.car.z);
        this.resetOnCollision();
        return true;
      }
    }
  }

  move(o) {
    const m = this.car.move;

    if (this.car.direction === 1) { // right, +x
      o.modTranslation(m, 0, 0);
    }
    else { // left, -x
      o.modTranslation(-m, 0, 0);
    }
  }

  objectUpdate(du) {
    //this.checkOptions();

    // Movement update
    if (currentTime - this.car.prevTime >= this.car.updateSpeed) {
      this.objects.forEach((o, i) => {
        this.move(o);
        this.checkCollision(du, o, i);
      });
      this.car.prevTime = currentTime;
    }
  }

  render() {
    this.objects.forEach((o, i) => {
      if (i % 2 === 0 ) gl.uniform4fv(shader.fragCol, this.car.color);
      o.render();
      resetRender();
    });
  }
}
