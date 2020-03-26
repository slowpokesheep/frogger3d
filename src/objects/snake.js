/* eslint-disable key-spacing */
/* eslint-disable import/no-cycle */
import { currentTime } from '../render';
import { eatKey } from '../globalKeyHandler';
import Options from '../options';
import ComplexObject from './extensions/complexObject';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class Snake extends ComplexObject {
  constructor() {
    super();

    this.snake = {
      len: 5,
      growRate: 50, // Grow every x blocks moved
      move: {
        currCount: 0, // Counter until next added block
        curr: -1, // Current direction
        last: -1, // Last direction, tail is in x+ direction, first direction needs to be x-
        amount: {
          total: 10, // Always moves x blocks in a given direction
          curr: 0,
        },
      },
    };

    // Head
    this.objects.push(new CubeLines());

    this.spawnLocation(Options.cubeSize.value);
    const { x, y, z } = this.objects[0].model.t;

    for (let i = 1; i < this.snake.len; ++i) {
      this.objects.push(new Cube());
      this.objects[i].setTranslation(x + i, y, z);
    }
  }

  spawnLocation(size) {
    // Size with padding, size = 10
    const newSize = size - 1; // [0 - 9)
    const interval = Math.floor(newSize / 2); // [-4 - 5)

    const pos = Math.floor(Math.random() * newSize) - interval;

    // Tail always begins in x+ direction, needs room
    let x = pos;
    if (pos + this.snake.len > interval + 1) {
      x = pos - this.snake.len;
    }
    this.objects[0].setTranslation(x, pos, pos);
  }

  add() {
    const tail = this.objects[this.snake.len - 1].model.t;
    const off = { x: 0, y: 0, z: 0 };
    const cm = this.snake.currMove;

    if (cm === Math.abs(1)) off.x = -cm;
    else if (cm === Math.abs(2)) off.y = -cm;
    else off.z = -cm;

    this.objects.push(new Cube());
    this.objects[this.snake.len].setTranslation(tail.x + off.x, tail.y + off.y, tail.z + off.z);
    this.snake.len++;
  }

  moveRandom() {
    // 6 directions = -z, -y, -x, x, y, z
    const directions = [-3, -2, -1, 1, 2, 3];
    const currIndex = Math.floor(Math.random() * directions.length);

    this.snake.move.curr = directions[currIndex];

    // Cant only travel in 5 directions
    if (this.snake.move.last === -this.snake.move.curr) {

      // Pick a new direction next to the current one in the direction array
      if (currIndex + 1 >= directions.length) {
        this.snake.move.curr = directions[currIndex - 1];
      }
      else {
        this.snake.move.curr = directions[currIndex + 1];
      }
    }
  }

  moveAmount() {
    if (this.snake.move.amount.curr === 0) {
      if (Options.randomDir.on) this.moveRandom();
      else if (Options.xUp.on) this.snake.move.curr = 1;
      else if (Options.xDown.on) this.snake.move.curr = -1;
      else if (Options.yUp.on) this.snake.move.curr = 2;
      else if (Options.yDown.on) this.snake.move.curr = -2;
      else if (Options.zUp.on) this.snake.move.curr = 3;
      else if (Options.zDown.on) this.snake.move.curr = -3;

    }

    this.snake.move.currCount++;
    this.snake.move.amount.curr++;

    // Check for direciton change
    if (this.snake.move.amount.curr === this.snake.move.amount.total) {
      this.snake.move.amount.curr = 0;
    }

    // Check for grow
    if (this.snake.move.currCount === this.snake.growRate) {
      this.snake.move.currCount = 0;
      this.add();
    }
  }

  moveHead() {
    this.moveAmount();

    switch (this.snake.move.curr) {
      case 1: // Right, x
        this.objects[0].modTranslation(1, 0, 0);
        break;
      case -1: // Left, x
        this.objects[0].modTranslation(-1, 0, 0);
        break;
      case 2: // Up, y
        this.objects[0].modTranslation(0, 1, 0);
        break;
      case -2: // Down, y
        this.objects[0].modTranslation(0, -1, 0);
        break;
      case 3: // Out, z
        this.objects[0].modTranslation(0, 0, 1);
        break;
      case -3: // In, z
        this.objects[0].modTranslation(0, 0, -1);
        break;
      default: // Should never happen
        this.objects[0].setTranslation(0, 0, 0);
        break;
    }

    this.snake.move.last = this.snake.move.curr;
  }

  moveTail(num, prevT) {
    this.objects[num].setTranslation(prevT.x, prevT.y, prevT.z);
  }

  checkCollision(du, object, currT) {

    // Check normal collision
    let ob = this.isColliding();
    // Lock out, so it's only called ones
    if (ob && !this.dead && Options.mortal.on) {

      this.dead = true;
      this.death(); // Spawn death animation
      this.timeOfDeath = currentTime; // Death animation play time
    }

    // Inverse collision of the head, move it to the other side
    // of the box
    ob = this.isSingleInvertColliding();
    if (ob) {
      const { x, y, z } = this.objects[0].model.t;

      switch (this.snake.move.curr) {
        case 1:
        case -1: // x
          object.setTranslation(-x, y, z);
          break;
        case 2:
        case -2: // y
          object.setTranslation(x, -y, z);
          break;
        case 3:
        case -3: // z
          object.setTranslation(x, y, -z);
          break;
        default: // Should never happen
          object.setTranslation(0, 0, 0);
          break;
      }
    }
  }

  checkOptions() {

    if (Options.growRate.value !== this.snake.growRate) {
      this.snake.growRate = Options.growRate.value;
      this.snake.move.currCount = 0;
    }

    if (Options.amountMove.value !== this.snake.move.amount.total) {
      this.snake.move.amount.total = Options.amountMove.value;
      this.snake.move.amount.curr = 0;
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
    this.checkOptions();

    // Movement update

    let currT; let prevT;
    this.objects.forEach((o, i) => {

      currT = {
        x: o.model.t.x,
        y: o.model.t.y,
        z: o.model.t.z,
      };

      // The head of the snake
      if (i === 0) {
        this.moveHead();
        this.checkCollision(du, o, currT);
      }
      else this.moveTail(i, prevT);

      prevT = currT;
    });
  }
}
