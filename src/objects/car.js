/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import Options from '../options';
import ComplexObject from './extensions/complexObject';
import { colorObj } from '../utils/color';
import { eatKey } from '../globalKeyHandler';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class Car extends ComplexObject {
  constructor(s, direction, x = 0, z = 0, speed = 1, color = colorObj.red) {
    super();

    this.car = {
      blockSize: s / 15,
      x,
      y: 8,
      z,
      move: s / 15,
      direction, // -x
      speed,
      color,
      left: 0,
      right: 0,
      subDead: false, // Hotfix
    };

    // Left and right side of the street
    this.car.left = 7 * this.car.move;
    this.car.right = -7 * this.car.move;

    this.objects.push(new Cube());
    this.objects[0].setTranslation(this.car.x, this.car.y, this.car.z);

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

  isSubDead() {
    if (this.subDead) return true;
    return false;
  }

  checkCollision(du, object, i) {

    // Inverse collision, move it to the other side of the box
    const ob = this.isSingleInvertColliding();
    if (ob) {

      // if (i === 0) this.subDead = true;

      if (this.car.direction) { // right, +x
        object.setTranslation(this.car.left, this.car.y, this.car.z);
      }
      else { // left, -x
        object.setTranslation(this.car.left, this.car.y, this.car.z);
      }
    }
  }

  move(o) {
    const m = this.car.speed * this.car.move;

    if (this.car.direction) { // +x
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
      this.move(o);
      this.checkCollision(du, o, i);
    });
  }

  render() {
    this.objects.forEach((o) => {
      gl.uniform4fv(shader.fragCol, this.car.color);
      o.render();
    });
  }
}
