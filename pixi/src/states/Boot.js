import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#c00'
    this.fontsReady = false
  }

  preload() {
    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', {
      font: '42px monospace',
      fill: '#dddddd',
      align: 'center',
    });

    text.anchor.setTo(0.5, 0.5);
    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');

    setTimeout(() => {
      this.fontsReady = true
    }, 3000)
  }

  render() {
    if (this.fontsReady) {
      // this.state.start('Splash')
    }
  }
}
