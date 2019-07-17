import * as React from 'react'
import { Tabs, Icon } from 'antd'

import { User } from '@/types'
import { ProfileForm } from './profile'
import { SettingsForm } from './settings'

const styles = require('./account.styl')

interface Props {
  user: User

  updateUserInfo: (payload: Partial<User>) => void
}

export class Account extends React.PureComponent<Props> {

  render() {
    return (
      <section className={ styles['wrapper'] }>
        <Tabs defaultActiveKey='1' tabPosition='left'>
          <Tabs.TabPane
            tab={ <span><Icon type='user' />Profile</span> }
            key='1'
          >
            <ProfileForm
              user={ this.props.user }
              updateUserInfo={ this.props.updateUserInfo }
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={ <span><Icon type='setting' />Settings</span> }
            key='2'
          >
            <SettingsForm
              updateUserInfo={ this.props.updateUserInfo }
            />
          </Tabs.TabPane>
        </Tabs>
      </section>
    )
  }
}
