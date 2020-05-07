import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { withRouter } from 'react-router-dom'
import flatMap from 'lodash/flatMap'

import { RootState } from '@/types'
import { UserContainer } from './user'
import { actionTypes } from '@/views/modules/app'
import { actionTypes as rootActionTypes } from '@/views/modules/root'

const mapStateToProps = (state: RootState) => {
  const all = state.app.palettes
  const privateIds = state.app.userPaletteIds
  const likedIds = state.app.likedPaletteIds

  return {
    user: state.root.user,
    privates: flatMap(privateIds, id => all.filter(one => one._id === id)),
    likes: flatMap(likedIds, id => all.filter(one => one._id === id)),
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch(createAction(rootActionTypes.logout)()),
  fetchUserPalettes: (payload: 'private' | 'likes') =>
    dispatch(createAction(actionTypes.getUserPalettes)(payload)),
  deleteUserPalette: (payload: string) =>
    dispatch(createAction(actionTypes.deletePalette)(payload)),
})

export const User = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(UserContainer))
