import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import SplashState from './states/Splash';
import Level_1 from './states/Level1';
import GameState from './states/Game';

import config from './config';

class Game extends Phaser.Game {
  constructor () {
    super(config.width, config.height, Phaser.AUTO, 'content', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Level-1', Level_1, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('Game', GameState, false);

    this.state.start('Level-1');
  }
}

window.game = new Game();
