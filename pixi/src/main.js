import PIXI from './pixi'
var Loop = require('game-loop'),
  loop = new Loop();

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

const renderer = PIXI.autoDetectRenderer(800, 600, {
  backgroundColor: 0x000000,
  antialias: false,
  resolution: 1,
});
document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
renderer.render(stage);

PIXI.loader
  .add('mushroom', '/assets/images/mushroom2.png')
  .add('mario', '/assets/images/mario.png')
  .add('level1', '/assets/images/level-1.png')
  .add('enemies', '/assets/images/enemies.png')
  .load((loader, res) => {
    const sky = new PIXI.Container();
    sky.addChild(genSky(renderer.width / 2, renderer.height / 2));

    const mountains = new PIXI.Container();
    mountains.addChild(genMountain(10, renderer.height));
    mountains.addChild(genMountain(800, renderer.height));
    mountains.addChild(genMountain(2000, renderer.height));
    mountains._halfWidth = mountains.width / 2;

    bg.push(sky);
    bg.push(mountains);

    stage.addChild(sky);
    stage.addChild(mountains);

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
d.style = 'position: absolute; top: 10px; right: 10px; border: 1px solid #c00; background: url(assets/images/level-1.png); background-position: -10px -10px; width: 50px; height: 50px;';
document.body.appendChild(d);

function genMountain(x, y) {
  return genTile(0, 164, 80, 35, 'level1', [1, 0.5], [x, y], 3);
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

let counter = 0;
let inc = Math.PI * 0.5 / 100;

loop.use(function () {
  const mountains = bg[1];
  mountains.x -= mushroom._accelX;
  if (mountains.x < -mountains.width) {
    mountains.x = renderer.width + mountains._halfWidth;
  }


  mushroom.rotation += 0.025;
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