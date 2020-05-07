import * as React from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Button } from 'antd'
import isEmpty from 'lodash/isEmpty'

import { Palette } from '@/types'
import { PaletteComponent } from '@/views/components'

const styles = require('./user.palettes.styl')
const TabPane = Tabs.TabPane

interface Props {
  privates: Palette[]
  likes: Palette[]

  onDelete: (payload: string) => void
  fetchUserPalettes: (payload: 'private' | 'likes') => void
}

const Placeholder = (
  <div className={styles.placeholder}>
    <h3>None Palettes Yet</h3>
    <Button type='primary' size='large'>
      <Link to='/generate'>GENERATE</Link>
    </Button>
  </div>
)

export class UserPalettes extends React.PureComponent<Props> {

  componentDidMount() {
    if (isEmpty(this.props.privates)) {
      this.props.fetchUserPalettes('private')
    }
    if (isEmpty(this.props.likes)) {
      this.props.fetchUserPalettes('likes')
    }
  }

  renderPalettes = (palettes: Palette[]) => {
    const items = palettes.map((palette, index) => (
      <PaletteComponent
        key={index}
        className={styles.item}
        palette={palette}
        onDelete={this.props.onDelete}
      />
    ))

    return (
      <div className={styles.palettes}>
        {palettes.length === 0 ? Placeholder : items}
      </div>
    )
  }

  render() {
    const { privates, likes } = this.props

    return (
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Collections' key='1'>
          {this.renderPalettes(privates)}
        </TabPane>
        <TabPane tab='Likes' key='2'>
          {this.renderPalettes(likes)}
        </TabPane>
      </Tabs>
    )
  }
}
