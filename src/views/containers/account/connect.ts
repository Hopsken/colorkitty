import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'

import { RootState } from '@/types'
import { UpdateUserInfoPayload } from '@/services'
import { Account as AccountComp } from './account'
import { actionTypes } from '@/views/modules/root'

const mapStateToProps = (state: RootState) => ({
  user: state.root.user
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateUserInfo: (payload: UpdateUserInfoPayload) =>
    dispatch(createAction(actionTypes.updateUserInfo)(payload))
})

export const Account = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountComp)
