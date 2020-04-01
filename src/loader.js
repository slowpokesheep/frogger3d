/* eslint-disable import/no-cycle */
import Options from './options';
import { managers } from './index';

import Template from './objects/template';
import Tester from './objects/tester';
import Box from './objects/box';

import Snake from './objects/snake';

// Enviroments
import SnakeBox from './objects/snakeBox';
import FroggerMap from './objects/froggerMap';


export function init() {
  managers.obj.addEnviroment(new FroggerMap(Options.cubeSize.value));
  
  /*
  managers.obj.add(
    new Snake(),
  );
  */
}

export function addSnake() {
  managers.obj.add(new Snake());
}

export function addTail() {
  managers.obj.objects.forEach((o) => {
    o.add();
  });
}

export function changeDirectionSnake() {
  managers.obj.objects.forEach((o) => {
    o.add();
  });
}
