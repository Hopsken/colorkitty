import { hot } from 'react-hot-loader/root'
import * as React from 'react'

import { ComposerContainer } from '@/views/containers'
import { Footer, Header } from '@/views/components'

require('./app.styl')

class App extends React.PureComponent {

  render() {
    return (
      <div>
        <Header />
        <ComposerContainer />
        <Footer />
      </div>
    )
  }
}

export default hot(App)
