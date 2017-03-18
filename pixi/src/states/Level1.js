import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#c00';
    this.player;
  }

  preload() {
    this.load.image('block', './assets/images/mushroom2.png');
  }

  create() {
    const player = this.add.sprite(0, 0, 'block');
    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    this.player = player;
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const { player } = this;
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -350;
    }
  }
}
