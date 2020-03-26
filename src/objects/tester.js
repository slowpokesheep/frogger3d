/* eslint-disable import/no-cycle */
import Events from '../events';
import ComplexObject from './extensions/complexObject';

import Cube from './primitives/cube';

export default class Tester extends ComplexObject {
  constructor() {
    super();
    this.objects.push(new Cube());
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
