import * as React from 'react'
import { Skeleton } from 'antd'
import { RouteComponentProps } from 'react-router-dom'

import { Palette } from '@/types'
import { UserPalettes } from './palettes'
import { ProfileComp } from './profile'

const styles = require('./user.styl')

interface Props extends RouteComponentProps<undefined> {
  user: any
  privates: Palette[]
  likes: Palette[]

  logout: () => void
  deleteUserPalette: (payload: string) => void
  fetchUserPalettes: (
    payload: 'private' | 'likes'
  ) => void
}

export class UserContainer extends React.PureComponent<Props> {

  loadingStyle = {
    margin: '3rem auto',
    minHeight: '70vh'
  }

  render() {
    if (!this.props.user) {
      return (
        <section
          style={this.loadingStyle}
        >
          <Skeleton
            active={true}
            title={false}
            avatar={true}
            paragraph={{ rows: 4 }}
          />
        </section>
      )
    }

    return (
      <section className={styles['wrapper']}>
        <ProfileComp
          username={this.props.user.username}
          logout={this.handleLogout}
        />
        <UserPalettes
          privates={this.props.privates}
          likes={this.props.likes}
          fetchUserPalettes={this.props.fetchUserPalettes}
          onDelete={this.props.deleteUserPalette}
        />
      </section>
    )
  }

  private handleLogout = () => {
    this.props.logout()
    this.props.history.push('/')
  }
}
