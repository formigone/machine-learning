import PIXI from './pixi'

import { TILE_SCALE, TILE_WIDTH, TILE_HEIGHT } from './constants';

export function genMountain(x, y) {
  const scale = TILE_SCALE;
  const width = TILE_WIDTH;
  const height = TILE_HEIGHT;
  const baseX = width * 5;
  const baseY = height * 3;
  const mountain = new PIXI.Container();

  mountain.addChild(genSprite(baseX + width * 0, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 0, 0], scale));
  mountain.addChild(genSprite(baseX + width * 1, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 1, 0], scale));
  mountain.addChild(genSprite(baseX + width * 2, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 2, 0], scale));
  mountain.addChild(genSprite(baseX + width * 3, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 3, 0], scale));
  mountain.addChild(genSprite(baseX + width * 4, baseY, width, height, 'tiles', [0.5, 0.5], [width * scale * 4, 0], scale));

  mountain.addChild(genSprite(baseX + width * 1, baseY - height, width, height, 'tiles', [0.5, 0.5], [width * scale * 1, -height * scale * 1], scale));
  mountain.addChild(genSprite(baseX + width * 2, baseY - height, width, height, 'tiles', [0.5, 0.5], [width * scale * 2, -height * scale * 1], scale));
  mountain.addChild(genSprite(baseX + width * 3, baseY - height, width, height, 'tiles', [0.5, 0.5], [width * scale * 3, -height * scale * 1], scale));
  mountain.addChild(genSprite(baseX + width * 2, baseY - height * 2, width, height, 'tiles', [0.5, 0.5], [width * scale * 2, -height * scale * 2], scale));

  mountain.x = x * scale * width;
  mountain.y = y * scale * height - height - scale * 3;
  return mountain;
}

export function genBrickFloor(x, y) {
  const scale = TILE_SCALE;
  const width = TILE_WIDTH;
  const height = TILE_HEIGHT;
  return genSprite(0, 0, width, height, 'tiles', [1, 0.5], [x * scale * width, y * scale * height], scale);
}

export function genMario(x, y) {
  const frames = [
    [80, 1, 16, 32], // standing right
    [167, 1, 18, 32], // jumping right
    [97, 1, 18, 32], // running right: 01
    [115, 1, 16, 32], // running right: 02
    [132, 1, 18, 32], // running right: 03
  ];

  const scale = TILE_SCALE;
  const textures = [];
  frames.forEach(([x, y, w, h], i) => {
    if (i > 1) {
      textures.push(genTexture(x, y, w, h, 'mario'));
    }
  });
  const running = new PIXI.extras.AnimatedSprite(textures);
  running.position.set(x * scale * running.width, y * scale * running.height);
  running.anchor.set(0.5, 0.5);
  running.scale.set(scale, scale);
  running.animationSpeed = 0.15;
  running.play();

  const jumping = new PIXI.extras.AnimatedSprite([genTexture(frames[1][0], frames[1][1], frames[1][2], frames[1][3], 'mario')]);
  jumping.position.set(x * scale * jumping.width, y * scale * jumping.height);
  jumping.anchor.set(0.5, 0.5);
  jumping.scale.set(scale, scale);
  jumping.loop = false;
  running.play();

  const mario = new PIXI.Container();
  mario.addChild(running);
  mario.addChild(jumping);

  mario.getChildAt(1).visible = false;
  return mario;
  // return genSprite(frames[0][0], frames[0][1], frames[0][2], frames[0][3], 'mario', [0.5, 0.5], [x * scale * 16, y * scale * 32], scale);
}

function genSprite(x, y, w, h, textureName, anchor, pos, scale) {
  const texture = genTexture(x, y, w, h, textureName);
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.x = anchor[0];
  sprite.anchor.y = anchor[0];
  sprite.scale.x = scale;
  sprite.scale.y = scale;

  sprite.x = pos[0];
  sprite.y = pos[1];

  return sprite;
}

function genTexture(x, y, w, h, textureName) {
  return new PIXI.Texture(PIXI.utils.TextureCache[textureName], new PIXI.Rectangle(x, y, w, h));
}