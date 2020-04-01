/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import Options from '../options';
import ComplexObject from './extensions/complexObject';
import { colorObj, colorArray } from '../utils/color';
import { eatKey } from '../globalKeyHandler';

import Treelog from './treelog';

export default class TreeTraffic extends ComplexObject {
  constructor(s) {
    super();

    this.treeTraffic = {
      size: s,
      blockSize: s / 15,
      move: s / 15, // One grid block
      numberLogs: 5,
    };

    const speed = [1, 2, 3];

    for (let i = 0; i < this.treeTraffic.numberLogs; ++i) {

      // Update from 0, 0, 0 coord
      const x = 7 * this.treeTraffic.move;
      const z = (-i - 1) * this.treeTraffic.move;

      const sp = Math.floor(Math.random() * speed.length);
      const size = 3;

      this.objects.push(new Treelog(
        this.treeTraffic.size,
        -1, // Direction x axis
        x, // x position
        z, // z position
        speed[sp], // speed
        colorObj.brown, // color
        size, // size
      ));

      console.log(`speed = ${speed[sp]}`)
    }

    this.resize();
  }

  resize() {
    this.objects.forEach((o, i) => {
      o.setScale(
        this.treeTraffic.blockSize,
        this.treeTraffic.blockSize,
        this.treeTraffic.blockSize,
      );
    });
  }

  objectUpdate(du) {
    //this.checkOptions();

    // Movement update
    if (eatKey('X'.charCodeAt(0))) {
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
