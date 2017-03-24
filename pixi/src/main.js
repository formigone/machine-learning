import PIXI from './pixi'
import Loop from 'game-loop';

import { genBrickFloor, genMountain, genMario } from './obj'
import { scrollWrapContainer, scrollWrapRow } from './camera';
import { TILE_SCALE, TILE_WIDTH, TILE_HEIGHT } from './constants';

const loop = new Loop();

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = PIXI.autoDetectRenderer(TILE_WIDTH * TILE_SCALE * 19, TILE_HEIGHT * TILE_SCALE * 12, {
  backgroundColor: 0x6b8cff,
  antialias: false,
  resolution: 1,
});
document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
renderer.render(stage);

PIXI.loader
  .add('mario', '/assets/images/mario.png')
  .add('tiles', '/assets/images/tiles.png')
  .add('enemies', '/assets/images/enemies.png')
  .load((loader, res) => {
    const mountains = new PIXI.Container();
    mountains.addChild(genMountain(0, 11));
    mountains.addChild(genMountain(15, 11));
    mountains.addChild(genMountain(40, 11));

    const ground = new PIXI.Container();
    for (let i = 0; i < 21; i++) {
      ground.addChild(genBrickFloor(i, 12));
    }

    bg.push(mountains);
    bg.push(ground);

    stage.addChild(mountains);
    stage.addChild(ground);

    hero = genMario(4, 5);
    hero._velX = 0;
    hero._velY = 0;
    hero._accelX = 3;
    hero._accelY = 0;
    floorY = hero.y;
    stage.addChild(hero);

    loop.play();
    updateDebug();
  });

let hero;
const bg = [];
const p = document.createElement('p');
document.body.appendChild(p);

const d = document.createElement('div');
d.style = 'position: absolute; top: 10px; right: 10px; border: 1px solid #c00; background: url(assets/images/tiles.png); background-position: 0 0; width: 128px; height: 128px;';
document.body.appendChild(d);

const d2 = document.createElement('div');
d2.style = 'position: absolute; top: 150px; right: 10px; border: 1px solid #c00; background: url(assets/images/mario.png); background-position: -75px 0; width: 128px; height: 128px;';
document.body.appendChild(d2);

function updateDebug() {
  setTimeout(updateDebug, 1000);
  p.textContent = `FPS: ${Number(loop.fps).toFixed(0)}`;
}

let SHOULD_RUN = true;
document.body.addEventListener('mousedown', e => SHOULD_RUN = false);
document.body.addEventListener('mouseup', e => SHOULD_RUN = true);
document.body.addEventListener('keydown', ({ keyCode }) => {
  if (keyCode === 32 /* space bar */) {
    if (!jumping) {
      jumping = true;
      hero._accelY = -15;
    }
  } else if (keyCode === 112 /* P (pause) */) {
    SHOULD_RUN = !SHOULD_RUN;
  }
});

document.body.addEventListener('keypress', ({ keyCode }) => {
  if (keyCode === 115 /* s */) {
    slowMoCounter = 0;
    slowMoSpeed = (slowMoSpeed + 1) % slowMoLevels;
    slowMo = true;
    if (slowMoSpeed === 0) {
      slowMo = false;
    }
  }
});

let slowMoCounter = 0;
let slowMoSpeed = 0;
let slowMoLevels = 4;
let slowMo = false;
let jumping = false;
let floorY = 0;

function update() {
  hero._velY = hero._accelY;
  hero.y += hero._velY;

  hero._accelY += 1;
  if (hero.y > floorY) {
    hero._accelY = 0;
    jumping = false;
    hero.y = floorY;
  }
}

loop.use(function () {
  if (slowMo) {
    if (++slowMoCounter % slowMoLevels < slowMoSpeed) {
      return;
    }
  }

  if (!SHOULD_RUN) {
    return;
  }

  update();

  if (jumping) {
    hero.getChildAt(0).visible = false;
    hero.getChildAt(1).visible = true;
  } else {
    hero.getChildAt(0).visible = true;
    hero.getChildAt(1).visible = false;
  }

  scrollWrapContainer(bg[0], hero._accelX, renderer.width, 0.5);
  scrollWrapRow(bg[1], hero._accelX);

  renderer.render(stage);
});