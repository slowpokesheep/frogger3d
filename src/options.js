/* eslint-disable import/no-cycle */
import { addSnake, addTail } from './loader';

export default class Options {
  static init() {

    // Sliders
    this.growRate = {
      value: 50,
      id: {
        text: document.getElementById('growRateText'),
        slider: document.getElementById('growRateSlider'),
      },
    };

    this.amountMove = {
      value: 10,
      id: {
        text: document.getElementById('moveAmountText'),
        slider: document.getElementById('moveAmountSlider'),
      },
    };

    this.cubeSize = {
      value: 50,
      id: {
        text: document.getElementById('cubeSizeText'),
        slider: document.getElementById('cubeSizeSlider'),
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

    this.randomDir = {
      on: true,
      id: {
        toggle: document.getElementById('randomDirToggle'),
      },
    };

    this.xUp = {
      on: false,
      id: {
        toggle: document.getElementById('xUpToggle'),
      },
    };

    this.xDown = {
      on: false,
      id: {
        toggle: document.getElementById('xDownToggle'),
      },
    };

    this.yUp = {
      on: false,
      id: {
        toggle: document.getElementById('yUpToggle'),
      },
    };

    this.yDown = {
      on: false,
      id: {
        toggle: document.getElementById('yDownToggle'),
      },
    };

    this.zUp = {
      on: false,
      id: {
        toggle: document.getElementById('zUpToggle'),
      },
    };

    this.zDown = {
      on: false,
      id: {
        toggle: document.getElementById('zDownToggle'),
      },
    };

    // Buttons
    this.addSnake = {
      id: {
        button: document.getElementById('addSnakeButton'),
      },
    };

    this.addTail = {
      id: {
        button: document.getElementById('addTailButton'),
      },
    };

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

    this.growRate.id.slider.onchange = (e) => {
      this.growRate.value = parseInt(e.target.value, 10);
      this.growRate.id.text.textContent = this.growRate.value;
    };

    this.amountMove.id.slider.onchange = (e) => {
      this.amountMove.value = parseInt(e.target.value, 10);
      this.amountMove.id.text.textContent = this.amountMove.value;
    };

    this.cubeSize.id.slider.onchange = (e) => {
      this.cubeSize.value = parseInt(e.target.value, 10);
      this.cubeSize.id.text.textContent = this.cubeSize.value;
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

    this.randomDir.id.toggle.onchange = (e) => {
      this.resetDirectionToggles();
      this.randomDir.on = !this.randomDir.on;
      this.randomDir.id.toggle.checked = this.randomDir.on;
    };

    this.xUp.id.toggle.onchange = (e) => {
      this.resetDirectionToggles();
      this.xUp.on = !this.xUp.on;
      this.xUp.id.toggle.checked = this.xUp.on;
    };

    this.xDown.id.toggle.onchange = (e) => {
      this.resetDirectionToggles();
      this.xDown.on = !this.xDown.on;
      this.xDown.id.toggle.checked = this.xDown.on;
    };

    this.yUp.id.toggle.onchange = (e) => {
      this.resetDirectionToggles();
      this.yUp.on = !this.yUp.on;
      this.yUp.id.toggle.checked = this.yUp.on;
    };

    this.yDown.id.toggle.onchange = (e) => {
      this.resetDirectionToggles();
      this.yDown.on = !this.yDown.on;
      this.yDown.id.toggle.checked = this.yDown.on;
    };

    this.zUp.id.toggle.onchange = (e) => {
      this.resetDirectionToggles();
      this.zUp.on = !this.zUp.on;
      this.zUp.id.toggle.checked = this.zUp.on;
    };

    this.zDown.id.toggle.onchange = (e) => {
      this.resetDirectionToggles();
      this.zDown.on = !this.zDown.on;
      this.zDown.id.toggle.checked = this.zDown.on;
    };

    // Buttons

    this.addSnake.id.button.onclick = (e) => {
      addSnake();
    };

    this.addTail.id.button.onclick = (e) => {
      addTail();
    };

    this.reset.id.button.onclick = (e) => {
      window.location.reload();
    };

    this.resetCamera.id.button.onclick = (e) => {
      this.resetCamera.on = true;
    };
  }

  static resetDirectionToggles() {
    this.randomDir.on = false;
    this.randomDir.id.toggle.checked = this.randomDir.on;

    this.xUp.on = false;
    this.xUp.id.toggle.checked = this.xUp.on;

    this.xDown.on = false;
    this.xDown.id.toggle.checked = this.xDown.on;

    this.yUp.on = false;
    this.yUp.id.toggle.checked = this.yUp.on;

    this.yDown.on = false;
    this.yDown.id.toggle.checked = this.yDown.on;

    this.zUp.on = false;
    this.zUp.id.toggle.checked = this.zUp.on;

    this.zDown.on = false;
    this.zDown.id.toggle.checked = this.zDown.on;
  }
}
