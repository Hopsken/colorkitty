import { hot } from 'react-hot-loader/root'
import { Route } from 'react-router-dom'
import * as React from 'react'
import { Layout } from 'antd'

import { ComposerContainer, ExploreContainer } from '@/views/containers'
import { Header } from '@/views/components'

require('./app.styl')

class App extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Header />
        <Route exact={ true } path='/' component={ ComposerContainer } />
        <Route exact={ true } path='/explore' component={ ExploreContainer } />
      </Layout>
    )
  }
}

export default hot(App)
