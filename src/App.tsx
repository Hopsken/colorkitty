import { hot } from 'react-hot-loader/root'
import { Route } from 'react-router-dom'
import * as React from 'react'
import { Layout } from 'antd'

import { ComposerContainer, Explore, Navbar } from '@/views/containers'

require('./app.styl')

class App extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Navbar />
        <Route exact={true} path='/explore' component={Explore} />
        <Route path='/' component={ComposerContainer} />
      </Layout>
    )
  }
}

export default hot(App)
