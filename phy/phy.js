function Vec2(x, y) {
  this.x = x;
  this.y = y;
}

Vec2.prototype.add = function (vec) {
//    return new Vec2(this.x + vec.x, this.y + vec.y);
  this.x += vec.x;
  this.y += vec.y;
  return this;
};

Vec2.prototype.mult = function (vec) {
  this.x *= vec.x;
  this.y *= vec.y;
  return this;
};

Vec2.prototype.scale = function (val) {
  this.x *= val;
  this.y *= val;
  return this;
};

Vec2.prototype.mag = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec2.prototype.norm = function () {
  var mag = this.mag();
  this.x = this.x / mag;
  this.y = this.y / mag;
};

Vec2.INV_HOR = new Vec2(-1, 1);
Vec2.INV_VERT = new Vec2(1, -1);

function Circle(pos, r, color) {
  this.pos = pos;
  this.vel = new Vec2(0, 0);
  this.r = r;
  this.color = color;
}

Circle.prototype.render = function (ctx) {
  ctx.save();
  ctx.fillStyle = this.color;
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI, true);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};

Circle.prototype.move = function () {
  this.vel.x = Math.min(this.vel.x, Circle.MAX_VEL_X);
  this.vel.y = Math.min(this.vel.y, Circle.MAX_VEL_Y);
  this.pos.add(this.vel);
};

Circle.prototype.applyForce = function (force) {
  this.vel.add(force);
};

Circle.MAX_VEL_X = 100;
Circle.MAX_VEL_Y = 10;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randColor() {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}


var __phy = {
  width: window.WIDTH || 900,
  height: window.HEIGHT || 450,
};

function randCircle() {
  var r = randInt(5, 15);
  var loc = new Vec2(__phy.width / 2, __phy.height / 2);
  var vel = new Vec2(0, 0);
  var color = randColor();
  return new Circle(loc, vel, r, color);
}

function initCanvas(container) {
  var canvas = document.createElement('canvas');
  canvas.width = __phy.width;
  canvas.height = __phy.height;
  var ctx = canvas.getContext('2d');

  container = container || document.body;
  container.appendChild(canvas);

  return { canvas: canvas, ctx: ctx };
}


function Neuron () {
}

Neuron.prototype.sigmoid = function(val) {
  return 1 / (1 + Math.exp(1 - val));
};

Neuron.prototype.activate = function(inputs, weight, bias, sumOnly) {
  // console.log('    Sum(');
  var sum = inputs.reduce(function(acc, input) {
    // console.log('      [' + input + ' x ' + weight + ' + ' + bias + ']');
    return acc + (input * weight + bias);
  }, 0);

  // console.log('    ) => ' + sum);

  if (sumOnly) {
    return sum;
  }

  return 1 / (1 + Math.exp(1 - sum));
};

function DNA(dna) {
  this.dna = dna;
  this.fitness = 0;
}

function Net (inputs, hiddenLayers, outputLayer) {
  this.inputs = inputs;
  this.layers = [];
  this.weights = [];
  this.outputLayer = [];
  this.bias = 1;

  this.layers = hiddenLayers.map(function(size) {
    var layer = [];
    for (var l = 0; l < size; l++) {
      layer.push(new Neuron());
    }
    return layer;
  });


  this.weights = hiddenLayers.map(function(size, layerIndex) {
    var prevLayerSize = layerIndex === 0 ? inputs : hiddenLayers[layerIndex - 1];
    return Net.genWeightsForLayer(size, prevLayerSize);
  });

  this.weights.push(Net.genWeightsForLayer(outputLayer, hiddenLayers[hiddenLayers.length - 1]));

  for (var i = 0; i < outputLayer; i++) {
    this.outputLayer.push(new Neuron());
  }

  console.log('Layers:');
  console.log(JSON.stringify(this.layers, null, 2));

  console.log('Weights:');
  console.log(JSON.stringify(this.weights, null, 2));

  console.log('Output layer:');
  console.log(JSON.stringify(this.outputLayer, null, 2));
}

Net.genWeightsForLayer = function(size, prevLayerSize) {
  var weights = [];
  for (var lw = 0; lw < size; lw++) {
    var w = [];
    for (var i = 0; i <= prevLayerSize; i++) {
      w.push(Number(`${lw + 1}${i}`));
    }
    weights.push(w);
  }

  return weights;
};

// layer: [Neuron, Neuron, Neuron]

/**
 *
 * @param {Array} inputs
 */
Net.prototype.run = function(inputs) {
  // console.log('----')
  // console.log(`Running with inputs: ${inputs}`)
  if (inputs.length !== this.inputs) {
    throw new Error('Provided inputs do not match the size of your network [' + inputs + ':' + this.inputs + ']');
  }

  var self = this;
  var hidden = this.layers.reduce(function(input, layer, l){
    // console.log(`  Layer ${l}  inputs: ${JSON.stringify(input)}`)
    var out = layer.map(function(neuron, i){
      // console.log(` SUM(`);
      var out = self.weights[l][i].reduce(function(acc, weight, wi) {
        // console.log(`    (${input[wi]} * ${weight} + ${self.bias}),`);
        return acc + (input[wi] * weight + self.bias);
      }, 0);
      // console.log(' )');
      return neuron.sigmoid(out);
    });

    // console.log(`   out: ${JSON.stringify(out)}`);
    return [1].concat(out);
  }, [1].concat(inputs));

  var weights = this.weights[this.weights.length - 1];
  var res = this.outputLayer.map(function(neuron, i){
    // console.log('---')
    // console.log(`Final input: ${hidden}`);
    // console.log(`Final weights: ${weights}`);
    var sum = hidden.reduce(function(acc, val, l){
      var weight = weights[0][l];
      return acc + (val * weight + self.bias);
    }, 0);

    // console.log('sum: ' + sum)
    return neuron.sigmoid(sum);
  });

  // console.log(' >>>> ' + JSON.stringify(res, null, 2));
  return res;
};

Net.prototype.mutateWeights = function(predicate) {
  return this.weights.map(function(layer, layerIndex) {
    return layer.map(function(weights, weightsIndex) {
      return weights.map(function(value, valueIndex) {
        return predicate(value, layerIndex, weightsIndex, valueIndex);
      });
    });
  });
};

function frand(min, max) {
  // If only valMin is supplied, make range [0, valMin]
  if (min && !max) {
    max = min;
    min = 0;
  }

  return Math.random() * (max - min) + min;
}

function formatTime(millies) {
  var d = Number(millies / 1000);

  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  return `00${h}`.slice(-2) + ':' + `00${m}`.slice(-2) + ':' + `00${s}`.slice(-2);
}
