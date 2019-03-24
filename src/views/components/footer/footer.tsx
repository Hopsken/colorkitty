import * as React from 'react'
import { Divider, Icon } from 'antd'

const styles = require('./footer.styl')
const kitty = require('@/views/assets/logo.svg')

export const FooterComp = () => (
  <footer className={ styles['footer'] }>
    <Divider className={ styles['divider'] }>
      <img className={ styles['logo'] } alt='color kitty' src={ kitty }/>
    </Divider>
    <p>Made with <Icon type='heart' style={ { color: '#FE615C' } } /> by Sean Walker</p>
  </footer>
)
