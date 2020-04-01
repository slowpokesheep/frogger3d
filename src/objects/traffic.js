/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import Options from '../options';
import ComplexObject from './extensions/complexObject';
import { colorObj, colorArray } from '../utils/color';
import { eatKey } from '../globalKeyHandler';

import Car from './car';

export default class Traffic extends ComplexObject {
  constructor(s) {
    super();

    this.traffic = {
      size: s,
      blockSize: s / 15,
      move: s / 15, // One grid block
      numberCars: 5,
    };

    const speed = [1, 2, 3];

    for (let i = 0; i < this.traffic.numberCars; ++i) {

      // Update from 0, 0, 0 coord
      const x = 7 * this.traffic.move;
      const z = 5 * this.traffic.move - (i * this.traffic.move);

      this.objects.push(new Car(
        this.traffic.size,
        -1, // Direction x axis
        x, // x position
        z, // z position
        speed[Math.floor(Math.random() * speed.length)], // speed
        colorArray[i + 1], // color
      ));
    }

    this.resize();
  }

  resize() {
    this.objects.forEach((o, i) => {
      o.setScale(
        this.traffic.blockSize,
        this.traffic.blockSize,
        this.traffic.blockSize,
      );
    });
  }

  objectUpdate(du) {
    //this.checkOptions();

    // Movement update
    if (eatKey('Z'.charCodeAt(0))) {
      this.objects.forEach((obj) => {
        if (obj.isSubDead()) obj.deathUpdate(du);
        else obj.objectUpdate(du);
      });
    }
  }

  render() {
    this.objects.forEach((obj) => {
      if (obj.isSubDead()) obj.deathRender();
      else obj.render();
    });
  }
}
