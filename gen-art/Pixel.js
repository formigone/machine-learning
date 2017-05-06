var PixelList = {
  takeRows: function (grid, width, cb) {
    for (var row = [], x, y, r, g, b, i = 0, len = grid.length; i < len; i += 4) {
      x = i % width;
      y = Math.floor(i / width);
      r = grid[i];
      g = grid[i + 1];
      b = grid[i + 2];

      if (y > 0 && x % width === 0) {
        cb(row, y - 1);
        row = [[r, g, b]];
      } else {
        row.push([r, g, b]);
      }
    }

    cb(row, y - 1);
  },
};

function Pixel(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

Pixel.prototype.diff = function (pixel) {
  return ['r', 'g', 'b'].reduce((acc, channel) => {
    const diff = Math.abs(this[channel] - pixel[channel]);
    return acc + Math.max(0, 100 - diff);
  }, 0);
};

Pixel.avg = function (a, b) {
  var pixel = new Pixel(0, 0, 0);
  pixel.r = Math.random() > 0.5 ? a.r : b.r;
  pixel.g = Math.random() > 0.5 ? a.g : b.g;
  pixel.b = Math.random() > 0.5 ? a.b : b.b;

  return pixel;
};

Pixel.prototype.mix = function(rate) {
  if (Math.random() < rate) {
    var channels = ['r', 'g', 'b'];
    var channel = randInt(0, 2);
    this[channels[channel]] = randInt(0, 255);
  }

  return this;
};

Pixel.prototype.asRGBA = function (alpha) {
  return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
};

Pixel.prototype.toString = function () {
  return `rgb(${this.r}, ${this.g}, ${this.b})`;
};
