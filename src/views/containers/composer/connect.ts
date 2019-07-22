import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'
import { withRouter } from 'react-router-dom'

import { RootState } from '@/types'
import { ComposerContainer } from './composer'
import { actionTypes } from '@/views/modules/app'
import { SavePalettePayload } from '@/services'

const mapStateToProps = (state: RootState) => {
  return {
    user: state.root.user,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  savePalette: (payload: SavePalettePayload) => dispatch(createAction(actionTypes.createPalette)(payload)),
})

export const Composer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ComposerContainer))
