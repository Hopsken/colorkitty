import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { Layout } from 'antd'

import { ComposerContainer } from '@/views/containers'
import { Header } from '@/views/components'

require('./app.styl')

class App extends React.PureComponent {

  render() {
    return (
      <Layout>
        <Header />
        <ComposerContainer />
      </Layout>
    )
  }
}

export default hot(App)
