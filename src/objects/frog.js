/* eslint-disable key-spacing */
/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import { currentTime } from '../render';
import Options from '../options';
import ComplexObject from './extensions/complexObject';
import { eatKey } from '../globalKeyHandler';
import { colorObj } from '../utils/color';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class Frog extends ComplexObject {
  constructor(s) {
    super(true);

    this.frog = {
      size: s,
      blockSize: s / 15,
      move: s / 15,
      keys: {
        up: 'W'.charCodeAt(0),
        left: 'A'.charCodeAt(0),
        down: 'S'.charCodeAt(0),
        right: 'D'.charCodeAt(0),
      },
      direction: -1, // -1 = -x, 1 = x, -2 = -z, 2 = z
      left: 0, // left side of the map
      right: 0, // right side of the map
    };

    // Update from 0, 0, 0 coord
    const z = 7 * this.frog.move;
    const y = 8;

    // Left and right side of the map
    this.frog.left = -7 * this.frog.move;
    this.frog.right = 7 * this.frog.move;

    this.objects.push(new Cube());
    this.objects[0].setTranslation(0, y, z);

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

  move(o) {

    // Move up, -z
    if (eatKey(this.frog.keys.up)) {
      o.modTranslation(0, 0, -this.frog.move);
      this.frog.direction = -2;
    }
    // Move left, -x
    if (eatKey(this.frog.keys.left)) {
      o.modTranslation(-this.frog.move, 0, 0);
      this.frog.direction = -1;
    }
    // Move up, +z
    if (eatKey(this.frog.keys.down)) {
      o.modTranslation(0, 0, this.frog.move);
      this.frog.direction = 2;
    }
    // Move right, +x
    if (eatKey(this.frog.keys.right)) {
      o.modTranslation(this.frog.move, 0, 0);
      this.frog.direction = 1;
    }
  }

  checkCollision(du, object, i) {

    // Inverse collision, map collision
    let ob = this.isSingleInvertColliding();
    if (ob) {

      const { x, y, z } = object.model.t;

      // Loops on the x axis, restricted to the map on z axis
      if (this.frog.direction === 2) { // down, +z
        object.setTranslation(x, y, z - this.frog.move);
      }
      else if (this.frog.direction === -2) { // up, -z
        object.setTranslation(x, y, z + this.frog.move);
      }
      else if (this.frog.direction === 1) { // right, +x
        object.setTranslation(this.frog.left, y, z);
      }
      else { // left, -x
        object.setTranslation(this.frog.right, y, z);
      }
    }

    // Object collision
    ob = this.isColliding();

    // Specific check for platforms (treelogs)
    if (ob && !ob.basicObject.killer) {
      /* Flow control, platforms overwrite enviroment deaths */
    }
    else if (ob && !this.dead && !Options.mortal.on) {

      this.dead = true;
      this.death(); // Spawn death animation
      this.timeOfDeath = currentTime; // Death animation play time

      console.log('Collision Death!');
    }
    else { // Enviroment hazards (water)
      ob = this.isEnvColliding();
      if (ob) {
        this.dead = true;
        this.death(); // Spawn death animation
        this.timeOfDeath = currentTime; // Death animation play time
        console.log('Water Death!');
      }
    }
  }

  death() {

    const miniCubes = [
      { x: -0.5, y: -0.5, z:  0.5 }, // front - bot-left
      { x: -0.5, y:  0.5, z:  0.5 }, // front - top-left
      { x:  0.5, y:  0.5, z:  0.5 }, // front - top-right
      { x:  0.5, y: -0.5, z:  0.5 }, // front - bot- right
      { x: -0.5, y: -0.5, z: -0.5 }, // back - bot-left
      { x: -0.5, y:  0.5, z: -0.5 }, // back - top-left
      { x:  0.5, y:  0.5, z: -0.5 }, // back - top-right
      { x:  0.5, y: -0.5, z: -0.5 }, // back - bot- right
    ];

    for (let i = 0; i < this.objects.length; ++i) {

      for (let j = 0; j < 8; ++j) {
        const mini = new Cube(false);

        // Trajectory
        mini.setDeathVector(
          miniCubes[j].x / 16,
          miniCubes[j].y / 16,
          miniCubes[j].z / 16,
        );

        mini.setTranslation(
          this.objects[i].model.t.x + miniCubes[j].x,
          this.objects[i].model.t.y + miniCubes[j].y,
          this.objects[i].model.t.z + miniCubes[j].z,
        );

        // Quarter the size
        mini.setScale(
          this.objects[i].model.s.x / 4,
          this.objects[i].model.s.y / 4,
          this.objects[i].model.s.z / 4,
        );

        this.deathObjects.push(mini);
      }
    }
  }

  deathUpdate(du) {
    this.deathObjects.forEach((o) => {
      o.modTranslation(o.deathVector.x, o.deathVector.y, o.deathVector.z);
      o.update(du);
    });
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
      gl.uniform4fv(shader.fragCol, colorObj.green);
      o.render();
    });
  }
}
