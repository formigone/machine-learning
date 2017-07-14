export function genArray(size, opt) {
  const arr = [];
  opt = opt || {};
  for (let i = 0; i < size; i++) {
    if (opt.value) {
      arr.push(value);
    } else if (opt.cb) {
      arr.push(opt.cb(i));
    } else {
      arr.push(Math.random());
    }
  }

  return arr;
}

export const activators = {
  ReLU(x) {
    return Math.max(0, x);
  },
  Softmax(x) {
    return 1 / (1 + Math.exp(-x));
  },
};
