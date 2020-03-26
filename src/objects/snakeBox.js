/* eslint-disable import/no-cycle */
import { gl, shader, resetRender } from '../setup/webgl';
import Options from '../options';
import Events from '../events';
import ComplexObject from './extensions/complexObject';

import Cube from './primitives/cube';
import CubeLines from './primitives/cubeLines';

export default class SnakeBox extends ComplexObject {
  constructor(s) {
    super();

    this.snakeBox = {
      size: s,
    };

    this.objects.push(new CubeLines());
    this.objects.push(new Cube());
    this.resize();
  }

  resize() {
    this.objects.forEach((o) => {
      o.setScale(this.snakeBox.size, this.snakeBox.size, this.snakeBox.size);
    });
  }

  checkOptions() {

    if (Options.cubeSize.value !== this.snakeBox.size) {
      this.snakeBox.size = Options.cubeSize.value;
      this.resize();
    }
  }

  objectUpdate(du) {
    this.checkOptions();
  }

  render() {
    this.objects.forEach((o, i) => {

      if (i === 1) {
        gl.uniform4fv(shader.fragCol, [0.2, 0, 0, 0.001]);
        gl.cullFace(gl.FRONT);
      }
      o.render();
    });
    resetRender();
  }
}
