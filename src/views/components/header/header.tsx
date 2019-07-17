import * as React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from 'antd'

const brandImg = require('@/views/assets/colorkitty.png')
const styles = require('./header.styl')

export const Header = () => (
  <Layout.Header className={styles['header']} >
    <nav className={styles['nav']}>
      <Link to='/'><img alt='colorkitty' src={brandImg} /></Link>
      <Link to='/explore'>Explore</Link>
    </nav>
  </Layout.Header>)
