/**
 *
 * @param slope
 * @param yIntercept
 * @param {HTMLCanvasElement} canvas
 * @param {Object} config
 */
export function drawLine(slope, yIntercept, canvas, config) {
  const ctx = canvas.getContext('2d');
  ctx.save();
  Object.keys(config).forEach(key => {
    ctx[key] = config[key];
  });

  const y = slope * canvas.width + yIntercept;
  ctx.beginPath();
  ctx.moveTo(0, yIntercept);
  ctx.lineTo(canvas.width, y);
  ctx.stroke();

  ctx.restore();
}

export function genCanvas(width, height, className) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.className = className;
  return canvas;
}

/**
 *
 * @param {number} x
 * @param {number} slope
 * @param {number} yIntercept
 * @returns {number}
 */
export function calcY(x, slope, yIntercept) {
  return slope * x + yIntercept;
}

/**
 *
 * @param {Point} point
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config
 */
export function drawPoint(point, ctx, config) {
  ctx.save();
  Object.keys(config).forEach(key => {
    ctx[key] = config[key];
  });

  ctx.beginPath();
  ctx.arc(point.x, point.y, config.radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = point.color;
  ctx.fill();

  ctx.restore();
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {string} color
 * @constructor
 */
export function Point(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
}