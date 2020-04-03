/* eslint-disable import/no-cycle */
import Events from './events';
import { managers } from './index';

// Handles key events on a global scale
export function globalKeyHandling() {
  const { obj } = managers;
  const { objManKeys } = obj;

  // Debug messages
  if (Events.keys['T'.charCodeAt(0)]) {
    obj.objects.forEach((o) => {
      console.log(o);
    });
  }

  // Single step through one update
  if (Events.toggleKeys[objManKeys.pause] && Events.keys[objManKeys.singleStep]) {
    obj.objects.forEach((o) => {
      if (o.isDead()) o.deathUpdate();
      else o.objectUpdate();
    });

    obj.enviroments.forEach((o) => {
      if (o.isDead()) o.deathUpdate();
      else o.objectUpdate();
    });
  }
}

export function pressKey(keyCode) {
  const isDown = Events.keys[keyCode];
  return isDown;
}


// Single shot keys, keys that need to be triggered only ones
export function eatKey(keyCode) {
  const isDown = Events.keys[keyCode];
  Events.keys[keyCode] = false;
  return isDown;
}
