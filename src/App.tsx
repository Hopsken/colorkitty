import { hot } from 'react-hot-loader/root'
import { Route } from 'react-router-dom'
import * as React from 'react'
import { Layout } from 'antd'

import { ComposerContainer, Explore, Navbar, User } from '@/views/containers'

require('./app.styl')

class App extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Navbar />
        <main style={{ marginTop: 72 }}>
          <Route exact={true} path='/explore' component={Explore} />
          <Route exact={true} path='/' component={ComposerContainer} />
          <Route path='/u/:username' component={User} />
        </main>
      </Layout>
    )
  }
}

export default hot(App)
