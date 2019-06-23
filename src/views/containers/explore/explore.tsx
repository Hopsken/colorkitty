import * as React from 'react'
import { Skeleton, Input, Layout, Col, Row } from 'antd'
import { RouteComponentProps } from 'react-router'

import QS from 'querystring'
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

    palettes: mockPalettes || [],
  }

  componentDidMount() {
    const params = QS.parse(this.props.location.search)
    const sorts = (params.sorts || 'trendy') as FetchPalettesParams['sorts']
    console.log(sorts)
    if (this.state.palettes.length === 0) {
      if (['trendy', 'newest', 'likes'].includes(sorts)) {
        this.fetchPalettes({ sorts })
      }
    }
  }

  renderPalette = (palette: Palette) => {
    const liked = palette.id in this.state.likes
    const onLike = liked
      ? this.unlike(palette.id)
      : this.like(palette.id)

    return (
      // <Link
      //   key={ index }
      //   to={ `/palette/${ palette.id }` }
      // >
      // <Col span={ 8 }>
        <PaletteComponent
          key={ palette.id }
          className={ styles['item'] }
          colors={ palette.colors }
          name={ palette.name }
          likes={ palette.likes }
          liked={ liked }
          onLike={ onLike }
        />
      // </Col>
      // </Link>
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
    fetch(`https://colorkitty.herokuapp.com/palettes?${ QS.stringify(params) }`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          palettes: res.data
        })
      })
  }

  like = (id: number) => () => {
    // this.props.likePalette(id)
  }

  unlike = (id: number) => () => {
    // this.props.unlikePalette(id)
  }
}

const mockPalettes = [
  {
    colors: ['#ffdada', '#777'],
    id: 1,
    name: 'ONE',
    verified: true,
    likes: 1,
  },
  {
    colors: ['#ffdada', '#777'],
    id: 2,
    name: 'ONE',
    verified: true,
    likes: 1,
  },
  {
    colors: ['#ffdada', '#777'],
    id: 3,
    name: 'ONE',
    verified: true,
    likes: 1,
  },
  {
    colors: ['#ffdada', '#777'],
    id: 4,
    name: 'ONE',
    verified: true,
    likes: 1,
  },
  {
    colors: ['#ffdada', '#777'],
    id: 5,
    name: 'ONE',
    verified: true,
    likes: 1,
  }, {
    colors: ['#ffdada', '#777'],
    id: 6,
    name: 'ONE',
    verified: true,
    likes: 1,
  },

  {
    colors: ['#ffdada', '#777'],
    id: 7,
    name: 'ONE',
    verified: true,
    likes: 1,
  },
]
