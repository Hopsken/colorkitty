import { hot } from 'react-hot-loader/root'
import { Route } from 'react-router-dom'
import * as React from 'react'
import { Layout } from 'antd'

import { ComposerContainer, Explore } from '@/views/containers'
import { Header } from '@/views/components'

require('./app.styl')

class App extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Header />
        <Route exact={true} path='/explore' component={Explore} />
        <Route path='/' component={ComposerContainer} />
      </Layout>
    )
  }
}

export default hot(App)
