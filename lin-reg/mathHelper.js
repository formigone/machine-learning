export function genArray(size, value) {
  var arr = [];
  for (var i = 0; i < size; i++) {
    if (value instanceof Function) {
      arr.push(value(arr, i));
    } else {
      arr.push(value);
    }
  }

  return arr;
}

/**
 *
 * @param {number} rgb
 */
export function intToRgb(rgb) {
  rgb = parseInt(rgb, 10);
  return 'rgb(' + ((rgb >> 16) & 0xFF) + ',' + ((rgb >> 8) & 0xFF) + ',' + (rgb & 0xFF) + ')';
}

/**
 *
 * @param {number} r Integer, base 10 (0-255)
 * @param {number} g Integer, base 10 (0-255)
 * @param {number} b Integer, base 10 (0-255)
 */
export function rgbToInt(r, g, b) {
  return parseInt(
    String('0' + Number(r).toString(16)).slice(-2) +
    String('0' + Number(g).toString(16)).slice(-2) +
    String('0' + Number(b).toString(16)).slice(-2), 16
  );
}

/**
 * Given some <x, y> point, create a vector length (width * height) with all zeroes and a one at coordinate <x, y>
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {Array<number>}
 */
export function ptToVec(x, y, width, height) {
  var vec = genArray(width * height, 0);
  var i = (y * width) + x;
  vec[i] = 1;
  return vec;
}

/**
 * Given a point vector representing a grid some width, find the element representing the active point, and return its <x,y> coordinate
 * @param {Array<number>} vec
 * @param {number} width
 * @returns {Array<number>}
 */
export function ptVecToPt(vec, width) {
  var pt = 0;
  vec.some(function(val, i) {
    pt = i;
    return val > 0;
  });

  return [pt % width, parseInt(pt / width, 10)];
}

/**
 * @param {number} i
 * @param {number} width
 * @returns {Array<number>}
 */
export function iToPt(i, width) {
  return [i % width, parseInt(i / width, 10)];
}
