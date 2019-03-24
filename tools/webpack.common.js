'use strict'

const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const rootDir = process.cwd()

module.exports = {
  entry: `${rootDir}/src/index.tsx`,

  output: {
    path: `${rootDir}/dist`,
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.styl'],
    alias: {
      '@': `${rootDir}/src`,
    }
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [{
          loader: 'style-loader'
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
      {
        test: /\.(png|jpg|jpeg|gif|webm|mp4|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash:4].[ext]',
              limit: 2048
            }
          },
        ],
      },
      {
        test: /\.eot([!?#].*)?$/,
        use: [
          { loader: 'url-loader', options: { limit: 1024, name: 'fonts/[name].[hash:4].[ext]' } }
        ]
      },
      {
        test: /\.ttf([!?#].*)?$/,
        use: [
          { loader: 'url-loader', options: { limit: 1024, minetype: 'application/octet-stream', name: 'fonts/[name].[hash:4].[ext]' } }
        ]
      },
      {
        test: /\.woff([!?#].*)?$/,
        use: [
          { loader: 'url-loader', options: { limit: 1024, minetype: 'application/font-woff', name: 'fonts/[name].[hash:4].[ext]' } }
        ]
      },
      {
        test: /\.woff2([!?#].*)?$/,
        use: [
          { loader: 'url-loader', options: { limit: 1024, minetype: 'application/font-woff2', name: 'fonts/[name].[hash:4].[ext]' } }
        ]
      },
      {
        test: /\.json5$/,
        loader: 'json5-loader'
      }
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: `${rootDir}/src/index.html`,
      minify: {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: `${rootDir}/src/views/assets/favicon.png`,
        to: `${rootDir}/dist/favicon.png`,
        toType: 'file'
      },
      {
        from: `${rootDir}/src/views/assets/colorkitty_192.png`,
        to: `${rootDir}/dist/colorkitty_192.png`,
        toType: 'file'
      }
    ])
  ]
}
