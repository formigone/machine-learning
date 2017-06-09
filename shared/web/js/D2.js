function D2(width, height, container) {
  this.el = document.createElement('canvas');
  this.el.width = width;
  this.el.height = height;
  this.ctx = this.el.getContext('2d');
  this.isRunning = true;

  this.update = function(){};
  this.render = function(){};

  if (container) {
    this.bind(container);
  }
}

D2.prototype.bind = function(container) {
  container.appendChild(this.el);
};

D2.prototype.onUpdate = function(cb) {
  this.update = cb;
};

D2.prototype.onRender = function(cb) {
  this.render = cb;
};

D2.prototype.pause = function(pause) {
  this.isRunning = !pause;
  if (this.isRunning) {
    this.run();
  }
};

D2.prototype.run = function() {
  if (this.isRunning) {
    requestAnimationFrame(this.run.bind(this));
    this.update();
    this.render(this.ctx, this.el.width, this.el.height);
  }
};
