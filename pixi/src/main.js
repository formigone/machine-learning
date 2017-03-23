import PIXI from './pixi'
var Loop = require('game-loop'),
  loop = new Loop();

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

const TILE_SCALE = 3;
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;

const renderer = PIXI.autoDetectRenderer(TILE_WIDTH * TILE_SCALE * 19, TILE_HEIGHT * TILE_SCALE * 12, {
  backgroundColor: 0x6b8cff,
  antialias: false,
  resolution: 1,
});
document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
renderer.render(stage);

PIXI.loader
  .add('mushroom', '/assets/images/mushroom2.png')
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

    mushroom = new PIXI.Sprite(res.mushroom.texture);
    mushroom.x = renderer.width - renderer.width / 4;
    mushroom.y = renderer.height / 4;
    mushroom.anchor.x = 0.5;
    mushroom.anchor.y = 0.5;
    mushroom._accelX = 3;
    stage.addChild(mushroom);

    loop.play();
    updateDebug();
  });

let mushroom;
const bg = [];
const p = document.createElement('p');
document.body.appendChild(p);

const d = document.createElement('div');
d.style = 'position: absolute; top: 10px; right: 10px; border: 1px solid #c00; background: url(assets/images/tiles.png); background-position: 0 0; width: 128px; height: 128px;';
document.body.appendChild(d);

function genMountain(x, y) {
  const scale = TILE_SCALE;
  const width = TILE_WIDTH;
  const height = TILE_HEIGHT;
  const baseX = width * 5;
  const baseY = height * 3;
  const mountain = new PIXI.Container();

  mountain.addChild(genTile(baseX + width * 0, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 0, 0], scale));
  mountain.addChild(genTile(baseX + width * 1, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 1, 0], scale));
  mountain.addChild(genTile(baseX + width * 2, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 2, 0], scale));
  mountain.addChild(genTile(baseX + width * 3, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 3, 0], scale));
  mountain.addChild(genTile(baseX + width * 4, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 4, 0], scale));

  mountain.addChild(genTile(baseX + width * 1, baseY - height, width, height, 'tiles', [0.5, 0.5], [width * scale * 1, -height * scale * 1], scale));
  mountain.addChild(genTile(baseX + width * 2, baseY - height, width, height, 'tiles', [0.5, 0.5], [width * scale * 2, -height * scale * 1], scale));
  mountain.addChild(genTile(baseX + width * 3, baseY - height, width, height, 'tiles', [0.5, 0.5], [width * scale * 3, -height * scale * 1], scale));
  mountain.addChild(genTile(baseX + width * 2, baseY - height * 2, width, height, 'tiles', [0.5, 0.5], [width * scale * 2, -height * scale * 2], scale));

  mountain.x = x * scale * width;
  mountain.y = y * scale * height - height - scale * 3;
  return mountain;
}

function genBrickFloor(x, y) {
  const scale = TILE_SCALE;
  const width = TILE_WIDTH;
  const height = TILE_HEIGHT;
  return genTile(0, 0, width, height, 'tiles', [1, 0.5], [x * scale * width, y * scale * height], scale);
}

function genSky(x, y) {
  return genTile(0, 0, 10, 10, 'level1', [0.5, 0.5], [x, y], 1000);
}

function genTile(x, y, w, h, textureName, anchor, pos, scale) {
  const texture = new PIXI.Texture(PIXI.utils.TextureCache[textureName], new PIXI.Rectangle(x, y, w, h));
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.x = anchor[0];
  sprite.anchor.y = anchor[0];
  sprite.scale.x = scale;
  sprite.scale.y = scale;

  sprite.x = pos[0];
  sprite.y = pos[1];

  return sprite;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateDebug() {
  setTimeout(updateDebug, 1000);
  p.textContent = `FPS: ${Number(loop.fps).toFixed(0)}`;
}

function scrollWrapRow(container, speed = 1, dir = -1) {
  container.children.forEach(sprite => {
    sprite.x += mushroom._accelX * speed * dir;
    if (sprite.x < -sprite.width) {
      sprite.x = container.children.length * sprite.width - sprite.width - 2;
    }
  });
}

function scrollWrapContainer(container, speed = 1, dir = -1) {
  container.x += mushroom._accelX * speed * dir;
  if (container.x < -container.width) {
    container.x = renderer.width;
  }
}

let counter = 0;
let inc = Math.PI * 0.5 / 100;
let SHOULD_RUN = true;
document.body.addEventListener('mousedown', e => SHOULD_RUN = false);
document.body.addEventListener('mouseup', e => SHOULD_RUN = true);
document.body.addEventListener('keydown', ({ keyCode }) => {
  if (keyCode === 32 /* space bar */) {
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

loop.use(function () {
  if (slowMo) {
    if (++slowMoCounter % slowMoLevels < slowMoSpeed) {
      return;
    }
  }

  if (!SHOULD_RUN) {
    return;
  }

  scrollWrapContainer(bg[0], 0.5);
  scrollWrapRow(bg[1]);

  mushroom.rotation -= 0.05;
  mushroom.y += Math.sin(counter) * 2;
  // mushroom.x += mushroom._accelX;
  counter += inc;

  if (mushroom.x > renderer.width) {
    mushroom.x = 0;
  }

  if (mushroom.y > renderer.height) {
    mushroom.y = 0;
  }

  renderer.render(stage);
});