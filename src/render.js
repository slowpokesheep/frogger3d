/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-cycle */
import { gl } from './setup/webgl';
import Options from './options';
import { managers } from './index';

const NOMINAL_UPDATE_INTERVAL = 16.666; // 60 fps
let previousTime = 0;
let du = 0;
export let currentTime;

export default function render() {

  gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
  managers.obj.render();

  // time = milliseconds sice first frame drawn
  window.requestAnimationFrame((time) => {

    // Current time in seconds
    currentTime = time / 1000;

    // Milliseconds between renders
    du = (time - previousTime) / NOMINAL_UPDATE_INTERVAL;
    previousTime = time;

    managers.obj.update(du);

    render();
  });
}
