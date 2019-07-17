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

  return {
    popular: flatMap(popularIds, id => all.filter(one => one.palette_id === id)),
    newest: flatMap(newestIds, id => all.filter(one => one.palette_id === id))
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  likePalette: (palette_id: string) => dispatch(createAction(actionTypes.likePalette)(palette_id)),
  unlikePalette: (palette_id: string) => dispatch(createAction(actionTypes.unlikePalette)(palette_id)),
  fetchPalettes: (params: GetPalettesParams) => dispatch(createAction(actionTypes.getPalettes)(params))
})

export const Explore = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ExploreContainer))
