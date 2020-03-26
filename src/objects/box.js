import { gl, shader } from '../setup/webgl';
import {
  translateMatrix,
  rotateXMatrix,
  rotateYMatrix,
  perspectiveMatrix,
  modelViewMatrix,
  scaleMatrix,
} from '../utils/matrices';

import Events from '../events';

import CubeLines from './primitives/cubeLines';
import ComplexObject from './extensions/complexObject';


/// BROKEN TODO MAYBE

export default class Box extends ComplexObject {
  constructor(size = 3) {
    super();
    this.objects.push(new CubeLines());
    this.box = {
      size,
    };
  }

  update(du) {

    /*
    this.cubes.forEach((c) => {
      c.update(du);
    });
    */
    //this.cubes.update(du);
    
    /*
    for (let i = 0; i < this.size; ++i) {
    }*/

    super.update(du);

    /*
    if (!Events.toggleKeys['C'.charCodeAt(0)]) {
      if (Events.mouse.update) {
        const { spin } = Events.mouse;
        
        this.r.x = spin.x;
        this.r.y = spin.y;
        
        this.setMv();
      }
    }
    */
  }

  render() {


    //gl.uniformMatrix4fv(shader.modelView, false, this.mv);
    super.render();

    for (let floor = 0; floor < this.box.size; ++floor) {
      // What side of the grid is being drawn
      const side = {
        left: false,
        top: false,
        right: false,
        bot: false,
      };

      const off = {
        x: 0,
        y: floor,
        z: 0,
      };

      for (let i = 3; i < this.box.size + 1; i += 2) {
        
        // Bottom left corner (closer to left)
        const corner = {
          x: this.c.x - i - 1,
          y: 0,
          z: this.c.z + i - 1,
        };
        
        for (let j = 0; j < 4; ++j) {
          
          // Left z -= 1;
          if (j === 0) side.left = true;
          // Top x += 1;
          if (j === 1) side.top = true;
          // Right z += 1;
          if (j === 2) side.right = true;
          // Bot x -= 1
          if (j === 3) side.bot = true;
          
          for (let k = 0; k < (i - 1); ++k) {
            
            this.setTranslation(
              corner.x + off.x,
              corner.y + off.y,
              corner.z + off.z,
            );
              
            //gl.uniformMatrix4fv(shader.modelView, false, this.mv);
            super.render();
              
            if (side.left) off.z -= 2;
            if (side.top) off.x += 2;
            if (side.right) off.z += 2;
            if (side.bot) off.x -= 2;
          }
            
          side.left = false;
          side.top = false;
          side.right = false;
          side.bot = false;
        }
      }
    }
  }

}
