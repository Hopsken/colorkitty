import * as React from 'react'
import { Skeleton, Layout } from 'antd'
import { RouteComponentProps } from 'react-router'
import QS from 'querystring'
import { Link } from 'react-router-dom'

import { Palette } from '@/types'
import { GetPalettesParams } from '@/services'
import { toHex } from '@/utilities'
import { PaletteComponent } from './explore.palette'

const styles = require('./explore.styl')

interface FetchPalettesParams {
  sorts: 'trendy' | 'newest' | 'likes'
  page?: number
  limit?: number
}

interface Props extends RouteComponentProps<null> {
  popular: Palette[]
  newest: Palette[]

  fetchPalettes: (params: GetPalettesParams) => void
  likePalette: (palette_id: string) => void
  unlikePalette: (palette_id: string) => void
}

export class ExploreContainer extends React.PureComponent<Props> {

  componentDidMount() {
    const params = QS.parse(this.props.location.search)
    const sorts = (params.sorts || 'newest') as FetchPalettesParams['sorts']
    if (sorts === 'trendy') {
      if (this.props.popular.length === 0) {
        this.props.fetchPalettes({ sorts: 'likes' })
      }
    } else {
      if (this.props.newest.length === 0) {
        this.props.fetchPalettes({ sorts: 'newest' })
      }
    }
  }

  renderPalette = (palette: Palette) => {
    const onLike = palette.liked
      ? this.unlike(palette.palette_id)
      : this.like(palette.palette_id)

    return (
      <Link
        key={palette.palette_id}
        to={`/${palette.colors.map(one => toHex(one).slice(1).toLowerCase()).join('-')}?name=${palette.name}`}
      >
        <PaletteComponent
          className={styles['item']}
          colors={palette.colors}
          name={palette.name}
          likes={palette.likes}
          liked={palette.liked}
          onLike={onLike}
        />
      </Link>
    )
  }

  renderFeed() {
    return (
      <Layout.Content className={styles['feed-wrapper']}>
        <Skeleton
          active={true}
          loading={this.palettes.length === 0}
          title={false}
          paragraph={{ rows: 4 }}
        >
          <div className={styles['feed']}>
            {(this.palettes || []).map(this.renderPalette)}
          </div>
        </Skeleton>
      </Layout.Content>
    )
  }

  render() {
    return (
      <Layout className={styles['container']}>
        {this.renderFeed()}
      </Layout>
    )
  }

  like = (palette_id: string) => () => {
    this.props.likePalette(palette_id)
  }

  unlike = (palette_id: string) => () => {
    this.props.unlikePalette(palette_id)
  }

  private get palettes() {
    const params = QS.parse(this.props.location.search)
    const sorts = (params.sorts || 'likes') as FetchPalettesParams['sorts']
    const { popular, newest } = this.props
    return sorts === 'trendy' ? popular : newest
  }
}
