/* eslint-disable import/no-cycle */
import Options from './options';
import { managers } from './index';

// Enviroments
import SnakeBox from './objects/snakeBox';
import FroggerMap from './objects/froggerMap';

// Objects
import Template from './objects/template';
import Tester from './objects/tester';
import Box from './objects/box';
import Snake from './objects/snake';
import Frog from './objects/frog';
import Traffic from './objects/traffic';
import TreeTraffic from './objects/treeTraffic';

export function init() {
  managers.obj.addEnviroment(new FroggerMap(Options.cubeSize.value));
  managers.obj.add(
    new Frog(Options.cubeSize.value),
    new Traffic(Options.cubeSize.value),
    new TreeTraffic(Options.cubeSize.value),
  );
}

export function addFrog() {
  managers.obj.add(new Frog(Options.cubeSize.value));
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
