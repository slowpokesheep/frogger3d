/* eslint-disable import/no-cycle */
import Options from './options';
import { globalKeyHandling } from './globalKeyHandler';

export default class Events {
  static init(canvas, view) {
    this.mouse = {
      x: Options.camera.t.x.value,
      y: Options.camera.t.y.value,
      z: Options.camera.t.z.value,
      last: {
        z: Options.camera.t.z.value,
      },
      spin: {
        x: Options.camera.r.x.value,
        y: Options.camera.t.y.value,
      },
      update: false,
    };

    this.keys = [];
    this.toggleKeys = [];

    // Capture context menu to disable it
    canvas.oncontextmenu = () => false;

    // ===============
    // MOUSE LISTENERS
    // ===============

    canvas.addEventListener('mousedown', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.update = true;

      e.preventDefault();
    });

    canvas.addEventListener('mouseup', (e) => {
      this.mouse.update = false;
    });

    canvas.addEventListener('mousemove', (e) => {

      if (this.mouse.update) {
        this.mouse.spin.x = (this.mouse.spin.x + (e.y - this.mouse.y)) % 360;
        this.mouse.spin.y = (this.mouse.spin.y + (e.x - this.mouse.x)) % 360;
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      }
    });

    canvas.addEventListener('wheel', (e) => {
      this.mouse.last.z = this.mouse.z;
      // Scrolling down
      if (e.deltaY > 0) {
        this.mouse.z -= 1;
      }
      // Scrolling up
      else {
        this.mouse.z += 1;
      }
      e.preventDefault(); // Prevent scrolling
    });

    // ==================
    // KEYBOARD LISTENERS
    // ==================

    document.addEventListener('keydown', (e) => {
      this.keys[e.keyCode] = true;
      this.toggleKeys[e.keyCode] = !this.toggleKeys[e.keyCode];
      globalKeyHandling();
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.keyCode] = false;
    });
  }
}
