import path from 'path'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { Configuration } from 'webpack'

module.exports = {
  mode: 'production',
  entry: './index.ts',
  devtool: 'source-map',
  output: {
    filename: 'main_[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.d.ts', '.tsx', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      dry: false,
    }),
  ],
  optimization: {
    usedExports: false,
  },
} as Configuration
