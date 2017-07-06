function genArray(size, value) {
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    genArray,
  };
}
