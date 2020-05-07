import * as React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Dropdown, Menu } from 'antd'

const styles = require('./profile.styl')

interface Props {
  username: string
  avatar?: string

  logout: () => void
}

export class ProfileComp extends React.PureComponent<Props> {

  renderDropdown() {
    return (
      <Menu>
        <Menu.Item>
          <Link to='/account'>Account Settings</Link>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.props.logout}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const { username, avatar } = this.props

    return (
      <Row className={styles.profile}>
        <Col span={8}>
          <img
            className={styles.avatar}
            src={avatar || `https://ui-avatars.com/api/?size=150&length=1&background=F27978&color=fff&name=${username}`}
          />
        </Col>
        <Col span={16} className={styles.info}>
          <div className={styles.title}>
            <h5 className={styles['title-name']}>
              {username}
            </h5>
            <div className={styles['title-more']}>
              <Link to='/account'>
                <Button>Edit Account</Button>
              </Link>
              <Dropdown overlay={this.renderDropdown()} trigger={['click']}>
                <Button>···</Button>
              </Dropdown>
            </div>
          </div>
          <p className={styles.desc}>{`Palettes collected by ${username}.`}</p>
        </Col>
      </Row>
    )
  }
}
