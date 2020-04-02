/* eslint-disable import/no-cycle */
import {
  modelViewMatrix,
  viewMatrix,
  translateMatrix,
  scaleMatrix,
  rotateXMatrix,
  rotateYMatrix,
  rotateZMatrix,
} from '../../utils/matrices';
import { gl, shader } from '../../setup/webgl';
import { managers } from '../../index';
import Options from '../../options';
import { eatKey } from '../../globalKeyHandler';
import Events from '../../events';
import { flatten } from '../../Common/MV';

/*
  All primitive objects should extend this class
  Handles model and view matrices
  Handles the prim variable to initialize the buffer
*/

export default class BasicObject {
  constructor(spatial = true, k = true, p = null) {

    this.prim = {
      points: [],
      colors: [],
      size: [],
    };

    this.basicObject = {
      camera: false,
      killer: k,
      parent: p,
    };

    this.basicKeys = {
      camera: 'C'.charCodeAt(0),
      up: 'W'.charCodeAt(0),    // y+
      left: 'A'.charCodeAt(0),  // x-
      down: 'S'.charCodeAt(0),  // y-
      right: 'D'.charCodeAt(0), // x+
      in: 'E'.charCodeAt(0),    // z-
      out: 'Q'.charCodeAt(0),   // z+
    };

    this.deathVector = { x: 0, y: 0, z: 0 };

    // Model Matrix
    this.model = {
      s: { x: 1, y: 1, z: 1 },
      r: { x: 0, y: 0, z: 0 },
      t: { x: 0, y: 0, z: 0 },
      matrix: null,
    };

    // View Matrix
    this.view = {
      s: { x: 1, y: 1, z: 1 },
      r: { x: 0, y: 0, z: 0 },
      t: { x: 0, y: 0, z: 0 },
      matrix: null,
    };

    this.setModel();
    this.setView();

    this.spatialID = null;
    if (spatial) {
      this.spatialID = managers.spatial.getNewSpatialID();
    }
  }

  resetCamera() {
    // Translation
    this.view.t.x = 0;
    this.view.t.y = 0;
    this.view.t.z = -50;

    // Rotation
    this.view.r.x = 40;
    this.view.r.y = 0;
    this.view.r.z = 0;
    this.setView();

    this.updateOptions();
  }

  // Methods to initialize buffer

  getSize() { return this.prim.size; }

  getPoints() { return this.prim.points; }

  getColors() { return this.prim.colors; }

  // Checks
  isColliding() {
    managers.spatial.unregister(this);
    const e = managers.spatial.collision(this.model.t, this.model.s.x / 2);
    managers.spatial.register(this);
    return e;
  }

  isInvertColliding() {
    managers.spatial.unregister(this);
    const e = managers.spatial.invertCollision(this.model.t, this.model.s.x / 2);
    managers.spatial.register(this);
    return e;
  }

  isLeftInvertColliding() {
    managers.spatial.unregister(this);
    const e = managers.spatial.invertLeftCollision(this.model.t, this.model.s.x / 2);
    managers.spatial.register(this);
    return e;
  }

  isRightInvertColliding() {
    managers.spatial.unregister(this);
    const e = managers.spatial.invertRightCollision(this.model.t, this.model.s.x / 2);
    managers.spatial.register(this);
    return e;
  }

  isEnvColliding() {
    managers.spatial.unregister(this);
    const e = managers.spatial.envCollision(this.model.t, this.model.s.x / 2);
    managers.spatial.register(this);
    return e;
  }

  setDeathVector(x, y, z) {
    this.deathVector.x = x;
    this.deathVector.y = y;
    this.deathVector.z = z;
  }

  // Modify model matrix

  setScale(x, y, z) {
    this.model.s.x = x;
    this.model.s.y = y;
    this.model.s.z = z;
    this.setModel();
  }

  modScale(x, y, z) {
    this.model.s.x += x;
    this.model.s.y += y;
    this.model.s.z += z;
    this.setModel();
  }

  setRotation(x, y, z) {
    this.model.r.x = x;
    this.model.r.y = y;
    this.model.r.z = z;
    this.setModel();
  }

  modRotation(x, y, z) {
    this.model.r.x += x;
    this.model.r.y += y;
    this.model.r.z += z;
    this.setModel();
  }

  setTranslation(x, y, z) {
    this.model.t.x = x;
    this.model.t.y = y;
    this.model.t.z = z;
    this.setModel();
  }

  modTranslation(x, y, z) {
    this.model.t.x += x;
    this.model.t.y += y;
    this.model.t.z += z;
    this.setModel();
  }

  setModel() {
    this.model.matrix = modelViewMatrix(
      scaleMatrix(this.model.s.x, this.model.s.y, this.model.s.z),
      rotateXMatrix(this.model.r.x),
      rotateYMatrix(this.model.r.y),
      rotateZMatrix(this.model.r.z),
      translateMatrix(this.model.t.x, this.model.t.y, this.model.t.z),
    );
  }

  setView() {
    this.view.matrix = viewMatrix(
      scaleMatrix(this.view.s.x, this.view.s.y, this.view.s.z),
      rotateXMatrix(this.view.r.x),
      rotateYMatrix(this.view.r.y),
      rotateZMatrix(this.view.r.z),
      translateMatrix(this.view.t.x, this.view.t.y, this.view.t.z),
    );
  }

  kill() {
    managers.spatial.unregister(this);
  }

  checkOptions() {

    let optionsChange = false;

    // Translation
    if (Options.camera.t.x.value !== this.view.t.x) {
      this.view.t.x = Options.camera.t.x.value;
      optionsChange = true;
    }

    if (Options.camera.t.y.value !== this.view.t.y) {
      this.view.t.y = Options.camera.t.y.value;
      optionsChange = true;
    }

    if (Options.camera.t.z.value !== this.view.t.z) {
      this.view.t.z = Options.camera.t.z.value;
      optionsChange = true;
      Events.mouse.z = Options.camera.t.z.value;
    }

    // Rotation
    if (Options.camera.r.x.value !== this.view.r.x) {
      this.view.r.x = Options.camera.r.x.value;
      optionsChange = true;
    }

    if (Options.camera.r.y.value !== this.view.r.y) {
      this.view.r.y = Options.camera.r.y.value;
      optionsChange = true;
    }

    if (Options.camera.r.z.value !== this.view.r.z) {
      this.view.r.z = Options.camera.r.z.value;
      optionsChange = true;
    }

    if (optionsChange) this.setView();

    if (Options.resetCamera.on) {
      this.resetCamera();
      Options.resetCamera.on = false;
    }
  }

  updateOptions() {

    const e = { target: { value: null } };

    // Translation
    e.target.value = this.view.t.x;
    Options.camera.t.x.id.slider.onchange(e);

    e.target.value = this.view.t.y;
    Options.camera.t.y.id.slider.onchange(e);

    e.target.value = this.view.t.z;
    Options.camera.t.z.id.slider.onchange(e);

    // Rotation
    e.target.value = this.view.r.x;
    Options.camera.r.x.id.slider.onchange(e);

    e.target.value = this.view.r.y;
    Options.camera.r.y.id.slider.onchange(e);

    e.target.value = this.view.r.z;
    Options.camera.r.z.id.slider.onchange(e);
  }

  update(du) {

    this.checkOptions();

    if (Events.mouse.update) {
      const { spin } = Events.mouse;
      this.view.r.x = spin.x;
      this.view.r.y = spin.y;

      this.updateOptions();
      this.setView();
    }

    if (Events.mouse.z !== Events.mouse.last.z) {
      Events.mouse.last.z = Events.mouse.z;
      this.view.t.z = Events.mouse.z;
      this.updateOptions();
      this.setView();
    }

    if (eatKey(this.basicKeys.camera)) {
      this.basicObject.camera = !this.basicObject.camera;
    }

    if (this.basicObject.camera) {

      // Keyboard camera movement
      if (eatKey(this.basicKeys.up)) {
        this.view.t.y += 1;
        this.updateOptions();
        this.setView();
      }

      if (eatKey(this.basicKeys.down)) {
        this.view.t.y -= 1;
        this.updateOptions();
        this.setView();
      }

      if (eatKey(this.basicKeys.right)) {
        this.view.t.x += 1;
        this.updateOptions();
        this.setView();
      }

      if (eatKey(this.basicKeys.left)) {
        this.view.t.x -= 1;
        this.updateOptions();
        this.setView();
      }

      if (eatKey(this.basicKeys.in)) {
        this.view.t.z -= 1;
        this.updateOptions();
        this.setView();
      }

      if (eatKey(this.basicKeys.out)) {
        this.view.t.z += 1;
        this.updateOptions();
        this.setView();
      }
    }
  }

  render() {
    gl.uniformMatrix4fv(shader.modelView, false, this.model.matrix);
    gl.uniformMatrix4fv(shader.view, false, flatten(this.view.matrix));
  }
}
