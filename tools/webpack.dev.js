'use strict'

const config = require('config')
const webpackMerge = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const tsImportPluginFactory = require('ts-import-plugin')


const rootDir = process.cwd()
const commonConfig = require('./webpack.common')

module.exports = webpackMerge(commonConfig, {
  mode: 'development',

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader'
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-syntax-typescript',
                '@babel/plugin-syntax-jsx',
                'react-hot-loader/babel',
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [ tsImportPluginFactory({
                  libraryName: 'antd',
                  libraryDirectory: 'lib',
                  style: true
                }) ]
              }),
              compilerOptions: {
                sourceMap: true,
                allowJs: true,
                module: 'es2015'
              }
            }
          }
        ]
      },
      {
        test: /\.(styl|css)$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[local]-[hash:4]',
            }
          },
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(css)$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },

  plugins: [
    new HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: `${rootDir}/tsconfig.json`,
      tslint: `${rootDir}/tslint.json`
    })
  ],

  devServer: {
    open: true,
    hot: true,
    historyApiFallback: true,
    port: config.port,
    host: '0.0.0.0',
    publicPath: '/',
    public: 'localhost:5555'
  }
})
