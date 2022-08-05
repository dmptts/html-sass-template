const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  devtool: isDev ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `./${filename('js')}`,
  },
  optimization: {
    minimize: isProd,
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
