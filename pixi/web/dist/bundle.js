/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _pixi = __webpack_require__(1);

	var _pixi2 = _interopRequireDefault(_pixi);

	var _gameLoop = __webpack_require__(2);

	var _gameLoop2 = _interopRequireDefault(_gameLoop);

	var _obj = __webpack_require__(4);

	var _camera = __webpack_require__(6);

	var _constants = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var loop = new _gameLoop2.default();

	_pixi2.default.settings.SCALE_MODE = _pixi2.default.SCALE_MODES.NEAREST;

	var renderer = _pixi2.default.autoDetectRenderer(_constants.TILE_WIDTH * _constants.TILE_SCALE * 19, _constants.TILE_HEIGHT * _constants.TILE_SCALE * 12, {
	  backgroundColor: 0x6b8cff,
	  antialias: false,
	  resolution: 1
	});
	document.body.appendChild(renderer.view);

	var stage = new _pixi2.default.Container();
	renderer.render(stage);

	_pixi2.default.loader.add('mario', '/assets/images/mario.png').add('tiles', '/assets/images/tiles.png').add('enemies', '/assets/images/enemies.png').load(function (loader, res) {
	  var mountains = new _pixi2.default.Container();
	  mountains.addChild((0, _obj.genMountain)(0, 11));
	  mountains.addChild((0, _obj.genMountain)(15, 11));
	  mountains.addChild((0, _obj.genMountain)(40, 11));

	  var ground = new _pixi2.default.Container();
	  for (var i = 0; i < 21; i++) {
	    ground.addChild((0, _obj.genBrickFloor)(i, 12));
	  }

	  bg.push(mountains);
	  bg.push(ground);

	  stage.addChild(mountains);
	  stage.addChild(ground);

	  hero = (0, _obj.genMario)(4, 5);
	  hero._velX = 0;
	  hero._velY = 0;
	  hero._accelX = 3;
	  hero._accelY = 0;
	  floorY = hero.y;
	  stage.addChild(hero);

	  loop.play();
	  updateDebug();
	});

	var hero = void 0;
	var bg = [];
	var p = document.createElement('p');
	document.body.appendChild(p);

	var d = document.createElement('div');
	d.style = 'position: absolute; top: 10px; right: 10px; border: 1px solid #c00; background: url(assets/images/tiles.png); background-position: 0 0; width: 128px; height: 128px;';
	document.body.appendChild(d);

	var d2 = document.createElement('div');
	d2.style = 'position: absolute; top: 150px; right: 10px; border: 1px solid #c00; background: url(assets/images/mario.png); background-position: -75px 0; width: 128px; height: 128px;';
	document.body.appendChild(d2);

	function updateDebug() {
	  setTimeout(updateDebug, 1000);
	  p.textContent = 'FPS: ' + Number(loop.fps).toFixed(0);
	}

	var SHOULD_RUN = true;
	document.body.addEventListener('mousedown', function (e) {
	  return SHOULD_RUN = false;
	});
	document.body.addEventListener('mouseup', function (e) {
	  return SHOULD_RUN = true;
	});
	document.body.addEventListener('keydown', function (_ref) {
	  var keyCode = _ref.keyCode;

	  if (keyCode === 32 /* space bar */) {
	      if (!jumping) {
	        jumping = true;
	        hero._accelY = -15;
	      }
	    } else if (keyCode === 112 /* P (pause) */) {
	      SHOULD_RUN = !SHOULD_RUN;
	    }
	});

	document.body.addEventListener('keypress', function (_ref2) {
	  var keyCode = _ref2.keyCode;

	  if (keyCode === 115 /* s */) {
	      slowMoCounter = 0;
	      slowMoSpeed = (slowMoSpeed + 1) % slowMoLevels;
	      slowMo = true;
	      if (slowMoSpeed === 0) {
	        slowMo = false;
	      }
	    }
	});

	var slowMoCounter = 0;
	var slowMoSpeed = 0;
	var slowMoLevels = 4;
	var slowMo = false;
	var jumping = false;
	var floorY = 0;

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

	  (0, _camera.scrollWrapContainer)(bg[0], hero._accelX, renderer.width, 0.5);
	  (0, _camera.scrollWrapRow)(bg[1], hero._accelX);

	  renderer.render(stage);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// This is here because I was not able to figure out how to solve webpack's 'PIXI is undefined' error...
	exports.default = global.PIXI;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	var requestAnimFrame = __webpack_require__(3);

	var Loop = function () {
	  this.callbacks = [];
	  this.playing = false;
	  this.fps = 0;
	  this.frame = 0;
	};

	Loop.prototype.play = function () {
	  this.playing = true;
	  this.next();
	};

	Loop.prototype.stop = function () {
	  this.playing = false;
	};

	Loop.prototype.use = function (callback) {
	  this.callbacks.push(callback);
	};

	Loop.prototype.next = function () {
	  if (this.playing) {
	    var self = this;

	    this.getFPS();

	    for (var i = 0; i < this.callbacks.length; i += 1) {
	      this.callbacks[i]();
	    }

	    this.frame+= 1;

	    requestAnimFrame(function () {
	      self.next();
	    });
	  }
	};

	Loop.prototype.getFPS = function () {
	  var delta;

	  if (!this.lastUpdate) {
	    this.lastUpdate = new Date().getTime();
	  }

	  delta = (new Date().getTime() - this.lastUpdate) / 1000;
	  this.lastUpdate = new Date().getTime();
	  this.fps = 1 / delta;
	};

	module.exports = Loop;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	var polyfill = function (callback) {
	  setTimeout(callback, 1000 / 60);
	};

	module.exports =
	  (window) ? (
	    window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    polyfill
	  ) : polyfill;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.genMountain = genMountain;
	exports.genBrickFloor = genBrickFloor;
	exports.genMario = genMario;

	var _pixi = __webpack_require__(1);

	var _pixi2 = _interopRequireDefault(_pixi);

	var _constants = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function genMountain(x, y) {
	  var scale = _constants.TILE_SCALE;
	  var width = _constants.TILE_WIDTH;
	  var height = _constants.TILE_HEIGHT;
	  var baseX = width * 5;
	  var baseY = height * 3;
	  var mountain = new _pixi2.default.Container();

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

	function genBrickFloor(x, y) {
	  var scale = _constants.TILE_SCALE;
	  var width = _constants.TILE_WIDTH;
	  var height = _constants.TILE_HEIGHT;
	  return genSprite(0, 0, width, height, 'tiles', [1, 0.5], [x * scale * width, y * scale * height], scale);
	}

	function genMario(x, y) {
	  var frames = [[80, 1, 16, 32], // standing right
	  [167, 1, 18, 32], // jumping right
	  [97, 1, 18, 32], // running right: 01
	  [115, 1, 16, 32], // running right: 02
	  [132, 1, 18, 32]];

	  var scale = _constants.TILE_SCALE;
	  var textures = [];
	  frames.forEach(function (_ref, i) {
	    var _ref2 = _slicedToArray(_ref, 4),
	        x = _ref2[0],
	        y = _ref2[1],
	        w = _ref2[2],
	        h = _ref2[3];

	    if (i > 1) {
	      textures.push(genTexture(x, y, w, h, 'mario'));
	    }
	  });
	  var running = new _pixi2.default.extras.AnimatedSprite(textures);
	  running.position.set(x * scale * running.width, y * scale * running.height);
	  running.anchor.set(0.5, 0.5);
	  running.scale.set(scale, scale);
	  running.animationSpeed = 0.15;
	  running.play();

	  var jumping = new _pixi2.default.extras.AnimatedSprite([genTexture(frames[1][0], frames[1][1], frames[1][2], frames[1][3], 'mario')]);
	  jumping.position.set(x * scale * jumping.width, y * scale * jumping.height);
	  jumping.anchor.set(0.5, 0.5);
	  jumping.scale.set(scale, scale);
	  jumping.loop = false;
	  running.play();

	  var mario = new _pixi2.default.Container();
	  mario.addChild(running);
	  mario.addChild(jumping);

	  mario.getChildAt(1).visible = false;
	  return mario;
	  // return genSprite(frames[0][0], frames[0][1], frames[0][2], frames[0][3], 'mario', [0.5, 0.5], [x * scale * 16, y * scale * 32], scale);
	}

	function genSprite(x, y, w, h, textureName, anchor, pos, scale) {
	  var texture = genTexture(x, y, w, h, textureName);
	  var sprite = new _pixi2.default.Sprite(texture);
	  sprite.anchor.x = anchor[0];
	  sprite.anchor.y = anchor[0];
	  sprite.scale.x = scale;
	  sprite.scale.y = scale;

	  sprite.x = pos[0];
	  sprite.y = pos[1];

	  return sprite;
	}

	function genTexture(x, y, w, h, textureName) {
	  return new _pixi2.default.Texture(_pixi2.default.utils.TextureCache[textureName], new _pixi2.default.Rectangle(x, y, w, h));
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var TILE_SCALE = exports.TILE_SCALE = 3;
	var TILE_WIDTH = exports.TILE_WIDTH = 16;
	var TILE_HEIGHT = exports.TILE_HEIGHT = 16;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.scrollWrapRow = scrollWrapRow;
	exports.scrollWrapContainer = scrollWrapContainer;
	function scrollWrapRow(container) {
	  var scrollBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	  var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	  var dir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;

	  container.children.forEach(function (sprite) {
	    sprite.x += scrollBy * speed * dir;
	    if (sprite.x < -sprite.width) {
	      sprite.x = container.children.length * sprite.width - sprite.width - 2;
	    }
	  });
	}

	function scrollWrapContainer(container) {
	  var scrollBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	  var rendererWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
	  var speed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	  var dir = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;

	  container.x += scrollBy * speed * dir;
	  if (container.x < -container.width) {
	    container.x = rendererWidth;
	  }
	}

/***/ }
/******/ ]);