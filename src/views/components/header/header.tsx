import * as React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Layout } from 'antd'

const brandImg = require('@/views/assets/colorkitty.png')
const styles = require('./header.styl')

export const Header = () => (
  <Layout.Header className={ styles['header'] } >
    <nav className={ styles['nav'] }>
      <Link to='/'><img alt='colorkitty' src={ brandImg } /></Link>
      <Link to='/explore'>Explore</Link>
    </nav>

    <div className={ styles['social'] }>
      <a target='_blank' rel='noopener' href='https://github.com/Hopsken/colorkitty'><Icon type='github' /></a>
      <a target='_blank' rel='noopener' href='https://www.instagram.com/colorkitty_com/'><Icon type='instagram' /></a>
      <a target='_blank' rel='noopener' href='https://twitter.com/@colorkitty_com/'><Icon type='twitter' /></a>
      <a href='mailto:oscar@mg.colorkitty.com'><Icon type='mail' /></a>
    </div>
  </Layout.Header>)
