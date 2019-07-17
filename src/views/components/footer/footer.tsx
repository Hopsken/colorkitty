import * as React from 'react'
import { Divider, Icon, Layout } from 'antd'

const styles = require('./footer.styl')
const kitty = require('@/views/assets/logo.svg')

export const Footer = () => (
  <Layout.Footer className={styles['footer']}>
    <Divider className={styles['divider']}>
      <img className={styles['logo']} alt='color kitty' src={kitty} />
    </Divider>
    <p>
      Made with <Icon type='heart' style={{ color: '#FE615C' }} /> by
      <a href='https://github.com/hopsken'> Hopsken</a>
    </p>
    <div className={styles['social']}>
      <a target='_blank' rel='noopener' href='https://github.com/Hopsken/colorkitty'><Icon type='github' /></a>
      <a target='_blank' rel='noopener' href='https://www.instagram.com/colorkitty_com/'><Icon type='instagram' /></a>
      <a target='_blank' rel='noopener' href='https://twitter.com/@colorkitty_com/'><Icon type='twitter' /></a>
      <a href='mailto:oscar@mg.colorkitty.com'><Icon type='mail' /></a>
    </div>
  </Layout.Footer>
)
