/* eslint-disable import/no-cycle */
import { managers } from '../index';
import Events from '../events';

// Primitives
import Cube from '../objects/primitives/cube';
import CubeLines from '../objects/primitives/cubeLines';

// Complex
import Snake from '../objects/snake';

export default class ObjectManager {
  constructor() {
    this.objects = [];
    this.enviroments = [];

    this.objManKeys = {
      pause: 'P'.charCodeAt(0),
      singleStep: 'O'.charCodeAt(0),
    };

    // All objects will be comprised of primitive shapes, cube, triangle, etc.
    this.primitives = [];
    this.primitives.push(new Cube());
    this.primitives.push(new CubeLines());

    // Points of all primitives, to set in vBuffer and cBuffer
    this.points = [];
    this.colors = [];

    // Load primitives into the buffer
    let prevSize = 0;
    let currOffset = 0;

    this.primitives.forEach((p) => {

      // Static variable in primitive to keep an offset where it's placed
      currOffset += prevSize;
      p.setOffset(currOffset);

      // Primitive shapes points
      p.getPoints().forEach((point) => {
        this.points.push(point);
      });

      // Primitive shapes color
      p.getColors().forEach((color) => {
        this.colors.push(color);
      });
      prevSize = p.getSize();
    });
  }

  // Webgl setup
  getPoints() {
    return this.points;
  }

  getColors() {
    return this.colors;
  }

  // Classes comprised of primitives
  add(...args) {
    for (const obj of args) {
      this.objects.push(obj);

      // Register each basic object in the complex object to the spatial manager
      for (const o of obj.objects) {
        managers.spatial.register(o);
      }

    }
  }

  // Remove object from the object manager
  remove(object) {
    const i = this.objects.findIndex((obj) => obj === object);
    this.objects.splice(i, 1);
  }

  // Classes comprised of primitives,
  // that only detect collision on the edges
  addEnviroment(...args) {
    for (const obj of args) {
      this.enviroments.push(obj);

      // Register each basic object in the complex object to the spatial manager
      for (const o of obj.objects) {
        managers.spatial.registerEnviroment(o);
      }
    }
  }

  update(du) {

    // Complex object update, view matrix
    this.objects.forEach((obj) => {
      obj.update(du);
    });

    this.enviroments.forEach((obj) => {
      obj.update(du);
    });

    // Single object update, model matrix
    if (!Events.toggleKeys[this.objManKeys.pause]) {
      this.objects.forEach((obj) => {
        if (obj.isDead()) obj.deathUpdate(du);
        else obj.objectUpdate(du);
      });

      this.enviroments.forEach((obj) => {
        if (obj.isDead()) obj.deathUpdate(du);
        else obj.objectUpdate(du);
      });
    }
  }

  render() {
    this.objects.forEach((obj) => {
      if (obj.isDead()) obj.deathRender();
      else obj.render();
    });

    this.enviroments.forEach((obj) => {
      if (obj.isDead()) obj.deathRender();
      else obj.render();
    });
  }
}
