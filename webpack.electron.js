const { DefinePlugin, NoEmitOnErrorsPlugin, IgnorePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const PROD = process.env.NODE_ENV === 'production';

const config = {
  name: 'main-process',
  mode: PROD ? 'production' : 'development',
  devtool: PROD ? 'source-map' : 'inline-source-map',
  entry: {
    main: path.resolve(__dirname, 'src/main-process/main.ts'),
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
    new IgnorePlugin(/\/iconv-loader$/),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src/core/preload.js'),
        to: '',
      },
      {
        from: path.resolve(__dirname, 'src/assets/'),
        to: 'assets/',
      },
    ]),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  target: 'electron-main',
  externals: {
    keytar: 'require("keytar")',
    '@sentry/electron': 'require("@sentry/electron")',
  },
};

module.exports = config;
