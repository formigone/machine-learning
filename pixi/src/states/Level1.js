import Phaser from 'phaser';

const phy = {
  velX: 250,
  velY: 550,
};

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#c00';
    this.player = null;
    this.platforms = null;
    this.pipes = [];
  }

  preload() {
    this.load.image('mushroom', './assets/images/mushroom2.png');
    this.load.image('block', './assets/images/loader-bar.png');
  }

  create() {
    this.world.resize(this.world.width * 100, this.world.height);

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 1000;


    const player = this.add.sprite(0, 0, 'mushroom');
    const platforms = this.add.group();
    platforms.enableBody = true;

    const ground = platforms.create(0, this.world.height - 64, 'block');
    ground.width = this.world.width;
    ground.height = 64;
    ground.body.immovable = true;
    ground.body.collideWorldBounds = true;

    this.physics.arcade.enable(player);
    // player.body.bounce.y = 0.1;
    player.body.gravity.y = 250;
    player.body.collideWorldBounds = true;
    // player.fixedToCamera = true;


    this.player = player;
    this.platforms = platforms;

    const style = { font: "16px monospace", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.txt = this.add.text(0, 0, 'player: ', style);
    this.txt.fixedToCamera = true;
  }

  update() {
    const { platforms, player, pipes, game } = this;
    const hitPlatform = this.physics.arcade.collide(player, platforms);
    const cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -phy.velX;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = phy.velX;
    }

    if (cursors.up.isDown && hitPlatform) {
      player.body.velocity.y -= phy.velY;
    }

    if (player.body.x > 100 && pipes.length === 0) {
      const pipe = platforms.create(player.body.x + 300, this.world.height - 128 - 64, 'block');
      pipe.width = 100;
      pipe.height = 128;
      // pipe.body.gravity = 0;
      // pipe.body.immovable = true;
      // pipe.body.colliodeWorldBounds = true;
      pipes.push(pipe);
    }

    game.camera.x = player.body.x - 100;
  }

  render() {
    this.txt.text = `player: ${Number(this.player.body.x).toFixed(3)}; view: ${this.camera.x}`;
  }
}
