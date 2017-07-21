export function genArray(size, opt = {}) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    if ('value' in opt) {
      arr.push(opt.value);
    } else if (opt.cb) {
      arr.push(opt.cb(i));
    } else {
      arr.push(Math.random());
    }
  }

  return arr;
}

export function matAdd(a, b) {
  return a.map((val, i) => val + b[i]);
}

export function transpose(mat) {
  return mat[0].map((_, y) => {
    return mat.map((_, x) => {
      return mat[x][y];
    });
  });
}

/**
 * If the matrix is a 2D array, its shape is <m.length x m[0].length> (assuming every element of m has the same length.
 * If the matrix is a single array of numbers, then its shape is m.length x 1.
 *
 * Examples:
 *
 *    // 4 x 2
 *    [
 *      [1,2],
 *      [3,4],
 *      [5,6],
 *      [7,8],
 *    ]
 *
 *    // 4 x 1
 *    [
 *      [1],
 *      [3],
 *      [5],
 *      [7],
 *    ]
 *
 *    // 4 x 1
 *    [
 *      1,
 *      3,
 *      5,
 *      7,
 *    ]
 *
 *    // 4 x 1
 *    [ 1, 3, 5, 7, ]
 * @param {Array} a
 * @param {Array} b
 */
export function matMult(a, b){
  b = b[0] instanceof Array ? b[0] : b.map(v => [v]);

  return a.map((row) => {
    return b[0].map((col, j) => {
      return row.reduce((acc, a0, i) => (acc + a0 * b[i][j]), 0);
    });
  })
}

export const activators = {
  ReLU(x) {
    return Math.max(0, x);
  },
  Softmax(x) {
    return 1 / (1 + Math.exp(-x));
  },
};
