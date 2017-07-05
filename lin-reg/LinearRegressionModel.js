function LinearRegressionModel() {
  this.params = [Math.random(), Math.random()];
}

LinearRegressionModel.prototype.train = function() {
  throw new Error('Not implemented yet');
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LinearRegressionModel;
}
