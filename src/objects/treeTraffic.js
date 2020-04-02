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
      numberLanes: 5,
      logsPerLane: 1,
      speed: [0.5, 1, 1.5],
    };

    for (let i = 0; i < this.treeTraffic.numberLanes; ++i) {
      const z = (-i - 1) * this.treeTraffic.move;
      this.add(z);
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

  add(z) {

    const d = [-1, 1];
    const dir = d[Math.floor(Math.random() * d.length)];

    for (let i = 0; i < this.treeTraffic.logsPerLane; ++i) {
      // Treelog sizes
      const size = [2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 5, 6];
      const s = Math.floor(Math.random() * size.length);

      const x = -dir * 7 * this.treeTraffic.move; // Constant with map size 15
      const speed = this.treeTraffic.speed[Math.floor(Math.random() * this.treeTraffic.speed.length)];

      this.objects.push(new Treelog(
        this.treeTraffic.size,
        dir, // Direction x axis
        x, // x position
        z, // z position
        speed, // speed
        colorObj.brown, // color
        size[s], // size
      ));
    }
  }

  objectUpdate(du) {
    //this.checkOptions();

    // Movement update
    this.objects.forEach((obj, i) => {
      if (obj.isSubDead()) {
        obj.treelog.subDead = false;

        const { z } = obj.treelog;
        this.objects.splice(i, 1);
        this.add(z);
      }
      else obj.objectUpdate(du);
    });
  }

  render() {
    this.objects.forEach((obj) => {
      if (obj.isSubDead()) obj.deathRender();
      else obj.render();
    });
  }
}
