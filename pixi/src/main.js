import PIXI from './pixi'

const renderer = PIXI.autoDetectRenderer(800, 600, {
  backgroundColor: 0x1099bb,
  antialias: false,
  resolution: 1,
});
document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
renderer.render(stage);

PIXI.loader.add('mushroom', '/assets/images/mushroom2.png')
  .load((loader, res) => {
    const mushroom = new PIXI.Sprite(res.mushroom.texture);
    mushroom.x = renderer.width / 2;
    mushroom.y = renderer.height / 2;
    mushroom.anchor.x = 0.5;
    mushroom.anchor.y = 0.5;

    stage.addChild(mushroom);
    renderer.render(stage);
  });
