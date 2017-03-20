module.exports = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}/web/dist`,
    filename: 'bundle.js'
  },
  watch: true,
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ]
  },
  externals: {
    pixi: 'PIXI',
  },
};
