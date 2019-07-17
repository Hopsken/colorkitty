import { Link, RouteComponentProps } from 'react-router-dom'
import { Modal, Icon, Spin, Input, Button, Layout } from 'antd'
import { InputProps } from 'antd/lib/input'
import * as React from 'react'

import { LoginPayload, login, signup } from '@/services'

const brandImg = require('@/views/assets/colorkitty.png')
const styles = require('./navbar.styl')

const cx = require('classnames/bind').bind(styles)

interface Props extends RouteComponentProps<null> {
  user: any
  loadingUser: boolean

  login: (payload: LoginPayload) => void
  logout: () => void
  getCurrentUser: () => void
}

enum modalState { login, signup }

interface State {
  showModal: boolean
  modalContent: modalState
  username: string
  email: string
  password: string
  error: string
  isLoading: boolean
}

export class NavbarContianer extends React.PureComponent<Props, State> {

  readonly inputProps = {
    required: true,
    className: styles['input'],
    size: 'large' as InputProps['size']
  }

  state = {
    showModal: false,
    modalContent: modalState.login,
    username: '',
    email: '',
    password: '',
    isLoading: false,
    error: ''
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.props.getCurrentUser()
    }
  }

  renderMe = () => {
    const { user, loadingUser } = this.props

    const loginLink = (
      <Button
        className={cx('menu-item')}
        onClick={this.showModalForLogin}
      >
        LOG IN
      </Button>
    )

    const loading = (
      <Spin
        className={styles['loading']}
        size='small'
        indicator={<Icon type='loading' spin={true} />}
      />
    )

    const userLink = user && (
      <Link className={styles['menu-item']} to={`/u/${user.username}`}>
        <img
          className={styles['avatar']}
          src={`https://ui-avatars.com/api/?length=1&background=F27978&color=fff&name=${user.username}`}
        />
      </Link>
    )

    return (
      <div className={styles['menu']}>
        {user ? userLink : (loadingUser ? loading : loginLink)}
      </div>
    )
  }

  renderLogin() {
    const { password, error, username } = this.state
    const { isLoading } = this.state
    return (
      <form className={styles['modal-wrapper']}>
        <div className={styles['modal-header']}>
          <h3>Welcome back!</h3>
          <p>Sign into your account here.</p>
        </div>
        <Input
          {...this.inputProps}
          value={username}
          placeholder='Username'
          prefix={<Icon type='user' />}
          onChange={this.handleEdit('username')}
        />
        <Input
          {...this.inputProps}
          type='password'
          value={password}
          placeholder='Password'
          prefix={<Icon type='lock' />}
          onChange={this.handleEdit('password')}
        />

        {error && <p className={styles['error']}>{error}</p>}

        <Button
          type='primary'
          block={true}
          size='large'
          loading={isLoading}
          onClick={this.handleLogin}
        >
          Continue
        </Button>

        <p className={styles['tip']}>
          Don't have an account?
            <a onClick={this.showModalForSignUp}>Sign up</a>
        </p>
      </form>
    )
  }

  renderSignUp() {
    const { email, password, username, error, isLoading } = this.state

    return (
      <form className={styles['modal-wrapper']}>
        <div className={styles['modal-header']}>
          <h3>Join Now!</h3>
          <p>Sign up to compose your palettes.</p>
        </div>
        <Input
          {...this.inputProps}
          value={username}
          placeholder='Username'
          prefix={<Icon type='user' />}
          onChange={this.handleEdit('username')}
        />
        <Input
          {...this.inputProps}
          type='email'
          value={email}
          placeholder='Email'
          prefix={<Icon type='mail' />}
          onChange={this.handleEdit('email')}
        />
        <Input
          {...this.inputProps}
          type='password'
          value={password}
          placeholder='Password'
          prefix={<Icon type='lock' />}
          onChange={this.handleEdit('password')}
        />

        {error && <p className={styles['error']}>{error}</p>}

        <Button
          type='primary'
          block={true}
          size='large'
          loading={isLoading}
          onClick={this.handleSignUp}
        >
          Sign Up
        </Button>
        <p className={styles['tip']}>
          Already have an account?
          <a onClick={this.showModalForLogin}>Login</a>
        </p>
      </form>
    )
  }

  render() {
    const { showModal, modalContent } = this.state
    const { user } = this.props

    let modal: React.ReactNode = null
    if (modalContent === modalState.login) {
      modal = this.renderLogin()
    } else if (modalContent === modalState.signup) {
      modal = this.renderSignUp()
    }

    return (
      <Layout.Header className={styles['header']} >
        <nav className={styles['nav']}>
          <Link to='/'><img alt='colorkitty' src={brandImg} /></Link>
          <Link to='/explore'>Explore</Link>
        </nav>
        {this.renderMe()}
        <Modal
          visible={showModal && !user}
          footer={null}
          onCancel={this.toggleModal}
          width='400px'
          style={{ top: '20%' }}
        >
          {modal}
        </Modal>
      </Layout.Header>
    )
  }

  private toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  private handleEdit = (key: string) => (ev: React.FormEvent<HTMLInputElement>) => {
    const target = ev.target as HTMLInputElement
    this.setState({
      ...this.state,
      [key]: target.value
    })
  }

  private handleLogin = () => {
    const { username, password } = this.state

    if (!username || !password) {
      this.setState({
        error: "Username or password can't be empty"
      })
      return
    }

    this.setState({
      isLoading: true
    })

    login({ username, password })
      .then(res => {
        if (!res['status']) {
          this.setState({
            error: res['msg'],
            isLoading: false
          })
        } else {
          this.props.login({ username, password })
          this.setState({
            showModal: false,
            isLoading: false
          })
        }
      })
      .catch(() => this.setState({
        error: 'Unexpected error.',
        isLoading: false
      }))
  }

  private handleSignUp = () => {
    const { email, password, username } = this.state
    this.setState({
      isLoading: true
    })

    signup({ email, username, password })
      .then(res => {
        if (!res['status']) {
          this.setState({
            error: res['msg'],
            isLoading: false
          })
        } else {
          this.props.login({ username, password })
          this.setState({
            showModal: false,
            isLoading: false
          })
        }
      })
      .catch(() => this.setState({
        error: 'Unexpected error.',
        isLoading: false
      }))
  }

  private showModalForLogin = () => {
    this.setState({
      modalContent: modalState.login,
      showModal: true
    })
  }

  private showModalForSignUp = () => {
    this.setState({
      modalContent: modalState.signup,
      showModal: true
    })
  }

}
