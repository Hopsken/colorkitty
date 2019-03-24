'use strict'

const webpackMerge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')


const rootDir = process.cwd()
const commonConfig = require('./webpack.common')

module.exports = webpackMerge(commonConfig, {
  mode: 'production',

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
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
                module: 'es2015'
              }
            },
          }
        ]
      },
      {
        test: /\.(styl|css)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        },{
          loader: 'css-loader'
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: {
              'primary-color': '#F27978',
              'link-color': '#F27978',
              'text-color': '#443C46',
              'heading-color': '#443C46',
              'success-color': '#7E9F5C',
              'warning-color': '#FB8F24',
              'error-color': '#F44336',
              'box-shadow-base': `0 10px 20px -12px rgba(0, 0, 0, 0.42),
                                  0 3px 20px 0px rgba(0, 0, 0, 0.12),
                                  0 8px 10px -5px rgba(0, 0, 0, 0.2)`
            },
            javascriptEnabled: true
          }
        }]
      },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash:4].css',
      chunkFileName: '[id].[hash:4].css'
    }),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: `${rootDir}/tsconfig.json`,
      tslint: `${rootDir}/tslint.json`
    })
  ]
})
