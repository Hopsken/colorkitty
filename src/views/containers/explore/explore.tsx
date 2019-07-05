import * as React from 'react'
import { Skeleton, Layout } from 'antd'
import { RouteComponentProps } from 'react-router'
import QS from 'querystring'
import { Link } from 'react-router-dom'

import { saveLikeById, getLikeIds, removeLikeById } from '@/utilities'
import { baseUrl } from '@/config'
import { PaletteComponent } from './explore.palette'

const styles = require('./explore.styl')

interface FetchPalettesParams {
  sorts: 'trendy' | 'newest' | 'likes'
  page?: number
  limit?: number
}

interface Palette {
  id: number
  colors: string[]
  name: string
  verified: boolean
  likes: number
}

interface Props extends RouteComponentProps { }

interface State {
  page: number
  likes: number[]

  palettes: Palette[]
}

export class ExploreContainer extends React.PureComponent<Props, State> {
  state: State = {
    page: 0,
    likes: [],

    palettes: [],
  }

  componentDidMount() {
    const params = QS.parse(this.props.location.search)
    const sorts = (params.sorts || 'trendy') as FetchPalettesParams['sorts']
    if (this.state.palettes.length === 0) {
      if (['trendy', 'newest', 'likes'].includes(sorts)) {
        this.fetchPalettes({ sorts })
      }
    }

    this.setState({
      likes: getLikeIds()
    })
  }

  renderPalette = (palette: Palette) => {
    const liked = this.state.likes.includes(palette.id)
    const onLike = liked
      ? this.unlike(palette.id)
      : this.like(palette.id)

    return (
      <Link
        key={ palette.id }
        to={ `/${palette.colors.map(one => one.slice(1).toLowerCase()).join('-')}?name=${palette.name}` }
      >
        <PaletteComponent
          className={ styles['item'] }
          colors={ palette.colors }
          name={ palette.name }
          likes={ palette.likes }
          liked={ liked }
          onLike={ onLike }
        />
      </Link>
    )
  }

  renderFeed() {
    return (
      <Layout.Content className={ styles['feed-wrapper'] }>
        <Skeleton
          active={ true }
          loading={ this.state.palettes.length === 0 }
          title={ false }
          paragraph={ { rows: 4 } }
        >
          <div className={ styles['feed'] }>
            { (this.state.palettes || []).map(this.renderPalette) }
          </div>
        </Skeleton>
      </Layout.Content>
    )
  }

  render() {
    return (
      <Layout className={ styles['container'] }>
        { this.renderFeed() }
      </Layout>
    )
  }

  private fetchPalettes(params: FetchPalettesParams) {
    fetch(`${baseUrl}/palettes?${ QS.stringify(params) }`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          palettes: res.data
        })
      })
  }

  like = (id: number) => () => {
    fetch(`${baseUrl}/palette/${id}/like`, {
      method: 'post'
    })
    .then(() => {
      saveLikeById(id)
      this.setState({
        likes: this.state.likes.concat(id),
        palettes: this.state.palettes.map(one => {
          if (one.id === id) {
            return {
              ...one,
              likes: ++one.likes
            }
          }
          return one
        })
      })
    })
  }

  unlike = (id: number) => () => {
    removeLikeById(id)
    this.setState({
      likes: this.state.likes.filter(one => id !== one)
    })
  }
}
