import * as React from 'react'
import { Icon, Layout } from 'antd'

const brandImg = require('@/views/assets/colorkitty.png')
const styles = require('./header.styl')

export const Header = () => (
    <Layout.Header className={ styles['header'] } >
      <img alt='colorkitty' src={ brandImg } />
      <span>Find perfect palettes from delicious pictures</span>

      <div className={ styles['social'] }>
        <a target='_blank' href='https://www.instagram.com/colorkitty_com/'><Icon type='instagram' /></a>
        <a target='_blank' href='https://twitter.com/@colorkitty_com/'><Icon type='twitter' /></a>
        <a href='mailto:oscar@mg.colorkitty.com'><Icon type='mail' /></a>
      </div>
    </Layout.Header>)
