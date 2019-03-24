'use strict'
const config = require('config')
const path = require('path')
const express = require('express')

const distDir = './dist'
const port = process.env.PORT || config.port
const { publicPath } = config

express()
  // 静态资源
  .use(express.static(distDir))

  // 首页面
  // .set('views', path.resolve(distDir))
  // .set('view engine', 'html')
  // .engine('html')
  .get('*', (req, res) => {
    res.render('index', { config })
  })

  // 启动应用
  .listen(port, (err) => {
    if (err) {
      return console.error(err)
    }
    console.info(`http://localhost:${port}`)
  })
