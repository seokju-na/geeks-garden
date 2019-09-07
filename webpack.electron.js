const { DefinePlugin, NoEmitOnErrorsPlugin } = require('webpack');
const path = require('path');

const PROD = process.env.NODE_ENV === 'production';

const config = {
  name: 'main-process',
  mode: PROD ? 'production' : 'development',
  devtool: PROD ? 'source-map' : 'inline-source-map',
  entry: {
    main: path.resolve(__dirname, 'src/main-process/main.ts'),
    preload: path.resolve(__dirname, 'src/core/preload.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /dist/],
        options: {
          presets: [
            '@babel/preset-typescript',
            [
              '@babel/preset-env',
              {
                targets: {
                  electron: require('./package.json').devDependencies.electron,
                },
              },
            ],
          ],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      },
    ],
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  target: 'electron-main',
};

module.exports = config;
