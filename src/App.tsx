import { hot } from 'react-hot-loader/root'
import { Route, Redirect } from 'react-router-dom'
import * as React from 'react'
import { Layout } from 'antd'

import { Footer } from '@/views/components'
import {
  Composer,
  Explore,
  Navbar,
  User,
  Account,
  GradientGame,
} from '@/views/containers'
import { parseColorsFromUrl } from './utilities'
import { Playground } from './views/containers/playground'

require('./app.styl')

class App extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Navbar />
        <main style={{ marginTop: 72 }}>
          <Route exact={true} path="/explore" component={Explore} />
          <Route exact={true} path="/" component={Composer} />
          <Route exact={true} path="/account" component={Account} />
          <Route exact={true} path="/gradient-game" component={GradientGame} />
          <Route path="/u/:username" component={User} />
          <Route path="/:colors" render={this.handleRedirectOld} />
          <Route path="/play" component={Playground} />
        </main>
        {location.pathname !== '/' && <Footer />}
      </Layout>
    )
  }

  handleRedirectOld = (props: any) => {
    const colors = props.match.params.colors
    const search = props.location.search

    if (!parseColorsFromUrl(colors)) {
      return <Redirect to={props.location.pathname} />
    }

    let url = `/?colors=${colors}`
    if (search) {
      url += '&' + search.slice(1)
    }
    return <Redirect to={url} />
  }
}

export default hot(App)
