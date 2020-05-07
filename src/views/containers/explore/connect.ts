import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'
import { withRouter } from 'react-router-dom'
import flatMap from 'lodash/flatMap'

import { RootState } from '@/types'
import { ExploreContainer } from './explore'
import { GetPalettesParams } from '@/services'
import { actionTypes } from '@/views/modules/app'

const mapStateToProps = (state: RootState) => {
  const all = state.app.palettes
  const popularIds = state.app.popularPaletteIds
  const newestIds = state.app.newestPaletteIds
  const user = state.root.user

  return {
    user,
    popular: flatMap(popularIds, id => all.filter(one => one._id === id)),
    newest: flatMap(newestIds, id => all.filter(one => one._id === id)),
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  likePalette: (paletteId: string) =>
    dispatch(createAction(actionTypes.likePalette)(paletteId)),
  unlikePalette: (paletteId: string) =>
    dispatch(createAction(actionTypes.unlikePalette)(paletteId)),
  fetchPalettes: (params: GetPalettesParams) =>
    dispatch(createAction(actionTypes.getPalettes)(params)),
})

export const Explore = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ExploreContainer))
