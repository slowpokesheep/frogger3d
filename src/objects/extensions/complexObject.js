/* eslint-disable import/no-cycle */
/*
  All Normal objects (objects that encapsulate multiple primitives)
  should extend this class
*/
import { managers } from '../../index';
import { currentTime } from '../../render';
import { addFrog } from '../../loader';

export default class ComplexObject {
  constructor(p = false) {
    this.objects = [];
    this.deathObjects = [];
    this.dead = false;
    this.timeOfDeath = 0;
    this.deathAnimation = 3;
    this.player = p; // Object is a player
  }

  isDead() {
    if (this.dead) return true;
    return false;
  }

  isColliding() {
    for (let i = 0; i < this.objects.length; ++i) {
      const e = this.objects[i].isColliding();
      if (e) return e;
    }
    return null;
  }

  isEnvColliding() {
    for (let i = 0; i < this.objects.length; ++i) {
      const e = this.objects[i].isEnvColliding();
      if (e) return e;
    }
    return null;
  }

  isInvertColliding() {
    for (let i = 0; i < this.objects.length; ++i) {
      const e = this.objects[i].isInvertColliding();
      if (e) return e;
    }
    return null;
  }

  isLeftInvertColliding() {
    for (let i = 0; i < this.objects.length; ++i) {
      const e = this.objects[i].isLeftInvertColliding();
      if (e) return e;
    }
    return null;
  }

  isRightInvertColliding() {
    for (let i = 0; i < this.objects.length; ++i) {
      const e = this.objects[i].isRightInvertColliding();
      if (e) return e;
    }
    return null;
  }

  // To check only the controlling object, snake head
  isSingleInvertColliding() {
    const e = this.objects[0].isInvertColliding();
    if (e) return e;
    return null;
  }

  // To check only one object
  // eslint-disable-next-line class-methods-use-this
  isObjectInvertColliding(i) {
    const e = this.objects[i].isInvertColliding();
    if (e) return e;
    return null;
  }

  setScale(x, y, z) {
    this.objects.forEach((o) => {
      o.setScale(x, y, z);
    });
  }

  setRotation(x, y, z) {
    this.objects.forEach((o) => {
      o.setRotation(x, y, z);
    });
  }

  setTranslation(x, y, z) {
    this.objects.forEach((o) => {
      o.setTranslation(x, y, z);
    });
  }

  update(du) {
    this.objects.forEach((o) => {
      if (this.dead) o.kill(); // Unregister from spatial manager
      o.update(du);
    });

    // Death animation plays and then the object is removed
    if (this.dead && currentTime - this.timeOfDeath >= this.deathAnimation) {
      this.dead = false;
      managers.obj.remove(this); // Remove from object manager
      if (this.player) addFrog();
    }
  }

  render() {
    this.objects.forEach((o) => {
      o.render();
    });
  }

  deathUpdate(du) {
    this.deathObjects.forEach((o) => {
      o.update(du);
    });
  }

  deathRender() {
    this.deathObjects.forEach((o) => {
      o.render();
    });
  }
}
