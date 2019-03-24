import * as React from 'react'

const brandImg = require('@/views/assets/colorkitty.png')
const styles = require('./navbar.styl')

export const NavbarComp = () => (
    <nav className={ styles['nav'] } >
      <img src={ brandImg } />
    </nav>)
