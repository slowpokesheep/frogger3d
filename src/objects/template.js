/* eslint-disable import/no-cycle */
import Events from '../events';
import ComplexObject from './extensions/complexObject';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class Template extends ComplexObject {
  constructor() {
    super();
    this.objects.push(new Cube());
    this.objects.push(new CubeLines());

    this.objects[0].setTranslation(0, 0, 0);
    this.objects[1].setTranslation(-1, 0, 0);
  }

  objectUpdate(du) {
    this.objects.forEach((o) => {

      if (!Events.toggleKeys['C'.charCodeAt(0)]) {
        if (Events.mouse.update) {
          const { spin } = Events.mouse;
          o.setRotation(spin.x, spin.y, 0);
        }
      }
    });
  }
}
