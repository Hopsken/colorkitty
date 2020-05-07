import * as React from 'react'
import { Skeleton, Layout, notification } from 'antd'
import { RouteComponentProps } from 'react-router'
import QS from 'querystring'
import { Link } from 'react-router-dom'

import { Palette, User } from '@/types'
import { GetPalettesParams } from '@/services'
import { toHex } from '@/utilities'
import { PaletteComponent } from '@/views/components'

const styles = require('./explore.styl')

interface FetchPalettesParams {
  sorts: 'trendy' | 'newest' | 'likes'
  page?: number
  limit?: number
}

interface Props extends RouteComponentProps<null> {
  user: User
  popular: Palette[]
  newest: Palette[]

  fetchPalettes: (params: GetPalettesParams) => void
  likePalette: (paletteId: string) => void
  unlikePalette: (paletteId: string) => void
}

export class ExploreContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const params = QS.parse(this.props.location.search)
    const sorts = (params.sorts || 'newest') as FetchPalettesParams['sorts']
    if (sorts === 'trendy') {
      if (this.props.popular.length === 0) {
        this.props.fetchPalettes({ sortBy: 'likes' })
      }
    } else {
      if (this.props.newest.length === 0) {
        this.props.fetchPalettes({ sortBy: 'created' })
      }
    }
  }

  renderPalette = (palette: Palette) => {
    const onLike = palette.liked
      ? this.unlike(palette._id)
      : this.like(palette._id)

    return (
      <Link
        key={palette._id}
        to={`/?colors=${palette.colors
          .map(one =>
            toHex(one)
              .slice(1)
              .toLowerCase(),
          )
          .join('-')}&name=${palette.name}`}
      >
        <PaletteComponent
          className={styles.item}
          palette={palette}
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
          <div className={styles.feed}>
            {(this.palettes || []).map(this.renderPalette)}
          </div>
        </Skeleton>
      </Layout.Content>
    )
  }

  render() {
    return <Layout className={styles.container}>{this.renderFeed()}</Layout>
  }

  like = (paletteId: string) => () => {
    if (!this.props.user) {
      notification.info({
        message: 'Please login first.',
      })
      return
    }
    this.props.likePalette(paletteId)
  }

  unlike = (paletteId: string) => () => {
    this.props.unlikePalette(paletteId)
  }

  private get palettes() {
    const params = QS.parse(this.props.location.search)
    const sorts = (params.sorts || 'likes') as FetchPalettesParams['sorts']
    const { popular, newest } = this.props
    return sorts === 'trendy' ? popular : newest
  }
}
