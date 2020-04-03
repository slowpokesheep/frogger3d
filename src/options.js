/* eslint-disable import/no-cycle */
import { addSnake, addTail } from './loader';

export default class Options {
  static init() {

    this.lookAt = false;

    this.cubeSize = {
      value: 50,
    };

    // Sliders
    this.frogLifes = {
      value: 3,
      id: {
        text: document.getElementById('frogLifesText'),
        slider: document.getElementById('frogLifesSlider'),
      },
    };

    this.frogWins = {
      value: 0,
      id: {
        text: document.getElementById('frogWinsText'),
        slider: document.getElementById('frogWinsSlider'),
      },
    };

    // Camera
    this.camera = {
      t: {
        x: {
          value: 0,
          id: {
            text: document.getElementById('cameraTXText'),
            slider: document.getElementById('cameraTXSlider'),
          },
        },
        y: {
          value: 0,
          id: {
            text: document.getElementById('cameraTYText'),
            slider: document.getElementById('cameraTYSlider'),
          },
        },
        z: {
          value: -50,
          id: {
            text: document.getElementById('cameraTZText'),
            slider: document.getElementById('cameraTZSlider'),
          },
        },
      },
      r: {
        x: {
          value: 40,
          id: {
            text: document.getElementById('cameraRXText'),
            slider: document.getElementById('cameraRXSlider'),
          },
        },
        y: {
          value: 0,
          id: {
            text: document.getElementById('cameraRYText'),
            slider: document.getElementById('cameraRYSlider'),
          },
        },
        z: {
          value: 0,
          id: {
            text: document.getElementById('cameraRZText'),
            slider: document.getElementById('cameraRZSlider'),
          },
        },
      },
    };

    // Toggles
    this.mortal = {
      on: false,
      text: [
        'Mortal',
        'Immortal',
      ],
      id: {
        text: document.getElementById('mortalText'),
        toggle: document.getElementById('mortalToggle'),
      },
    };

    // Buttons
    this.reset = {
      id: {
        button: document.getElementById('resetButton'),
      },
    };

    this.resetCamera = {
      on: false,
      id: {
        button: document.getElementById('resetCameraButton'),
      },
    };

    // Sliders

    this.frogLifes.id.slider.onchange = (e) => {
      this.frogLifes.value = parseInt(e.target.value, 10);
      this.frogLifes.id.slider.value = this.frogLifes.value;
      this.frogLifes.id.text.textContent = this.frogLifes.value;
    };

    this.frogWins.id.slider.onchange = (e) => {
      this.frogWins.value = parseInt(e.target.value, 10);
      this.frogWins.id.slider.value = this.frogWins.value;
      this.frogWins.id.text.textContent = this.frogWins.value;
    };

    // Camera

    // Translation
    this.camera.t.x.id.slider.onchange = (e) => {
      this.camera.t.x.id.slider.value = e.target.value;
      this.camera.t.x.value = parseInt(e.target.value, 10);
      this.camera.t.x.id.text.textContent = this.camera.t.x.value;
    };

    this.camera.t.y.id.slider.onchange = (e) => {
      this.camera.t.y.id.slider.value = e.target.value;
      this.camera.t.y.value = parseInt(e.target.value, 10);
      this.camera.t.y.id.text.textContent = this.camera.t.y.value;
    };

    this.camera.t.z.id.slider.onchange = (e) => {
      this.camera.t.z.id.slider.value = e.target.value;
      this.camera.t.z.value = parseInt(e.target.value, 10);
      this.camera.t.z.id.text.textContent = this.camera.t.z.value;
    };

    // Rotation
    this.camera.r.x.id.slider.onchange = (e) => {
      this.camera.r.x.id.slider.value = e.target.value;
      this.camera.r.x.value = parseInt(e.target.value, 10);
      this.camera.r.x.id.text.textContent = this.camera.r.x.value;
    };

    this.camera.r.y.id.slider.onchange = (e) => {
      this.camera.r.y.id.slider.value = e.target.value;
      this.camera.r.y.value = parseInt(e.target.value, 10);
      this.camera.r.y.id.text.textContent = this.camera.r.y.value;
    };

    this.camera.r.z.id.slider.onchange = (e) => {
      this.camera.r.z.id.slider.value = e.target.value;
      this.camera.r.z.value = parseInt(e.target.value, 10);
      this.camera.r.z.id.text.textContent = this.camera.r.z.value;
    };

    // Toggles

    this.mortal.id.toggle.onchange = (e) => {
      this.mortal.on = !this.mortal.on;
      const toggle = this.mortal.on ? 0 : 1;
      this.mortal.id.text.textContent = this.mortal.text[toggle];
    };

    // Buttons
    this.reset.id.button.onclick = (e) => {
      window.location.reload();
    };

    this.resetCamera.id.button.onclick = (e) => {
      this.resetCamera.on = true;
    };
  }
}
