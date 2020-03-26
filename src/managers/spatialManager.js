/* eslint-disable import/no-cycle */
import Options from '../options';
import { vectorDistance } from '../utils/util';

export default class SpatialManager {
  constructor() {

    this.spatial = {
      objects: [],
      enviroments: [],
      nextSpatialID: 0,
    };
  }

  getNewSpatialID() {
    return this.spatial.nextSpatialID++;
  }

  registerEnviroment(object) {
    const { spatialID } = object;
    this.spatial.enviroments[spatialID] = object;
  }

  register(object) {
    const { spatialID } = object;
    this.spatial.objects[spatialID] = object;
  }

  // Prevent self-collision
  unregister(object) {
    const { spatialID } = object;
    this.spatial.objects[spatialID] = null;
  }

  // pos = model.translation, radius = model.scale.x
  collision(pos, radius) {

    for (let i = 0; i < this.spatial.objects.length; ++i) {
      const basic = this.spatial.objects[i];

      if (basic) {

        const dist = vectorDistance(pos, basic.model.t);
        const threshold = radius + basic.model.s.x / 2;
        if (dist < threshold) {
          return basic;
        }
      }
    }
    return null;
  }

  // Colliding out of on entity, like a entity in a box
  invertCollision(pos, radius) {
    for (let i = 0; i < this.spatial.enviroments.length; ++i) {
      const env = this.spatial.enviroments[i];

      if (env) {
        const cubeWall = Options.cubeSize.value / 2;

        if (   pos.x >= cubeWall || pos.x <= -cubeWall
            || pos.y >= cubeWall || pos.y <= -cubeWall
            || pos.z >= cubeWall || pos.z <= -cubeWall) {
          return env;
        }
      }
    }
    return null;
  }
}
