import { hot } from 'react-hot-loader'
import * as React from 'react'

import { ComposerContainer } from '@/views/containers'
import { FooterComp, NavbarComp } from '@/views/components'

require('./app.styl')

class App extends React.PureComponent {

  render() {
    return (
      <div>
        <NavbarComp />
        <ComposerContainer />
        <FooterComp />
      </div>
    )
  }
}

export default hot(module)(App)
