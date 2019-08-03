import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'
import { withRouter } from 'react-router-dom'

import { RootState, Palette } from '@/types'
import { ComposerContainer } from './composer'
import { types as actionTypes } from '@/views/modules/app'

const mapStateToProps = (state: RootState) => {
  return {
    user: state.root.user,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSavePaletteSuccess: (payload: Palette) => dispatch(createAction(actionTypes.CREATE_PALETTE_SUCCESS)(payload)),
})

export const Composer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ComposerContainer))
