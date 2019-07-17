import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'
import { withRouter } from 'react-router-dom'

import { RootState } from '@/types'
import { NavbarContianer } from './navbar'
import { actionTypes } from '@/views/modules/root'
import { LoginPayload } from '@/services'

const mapStateToProps = (state: RootState) => ({
  user: state.root.user,
  loadingUser: state.root.loadingUser
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (payload: LoginPayload) => dispatch(createAction(actionTypes.login)(payload)),
  logout: () => dispatch(createAction(actionTypes.logout)()),
  getCurrentUser: () => dispatch(createAction(actionTypes.getCurrentUser)())
})

export const Navbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavbarContianer))
