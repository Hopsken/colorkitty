import * as React from 'react'

const brandImg = require('@/views/assets/colorkitty.png')
const styles = require('./header.styl')

export const Header = () => (
    <header className={ styles['header'] } >
      <img alt='colorkitty' src={ brandImg } />
      <span>Find perfect palettes from delicious pictures</span>
    </header>)
