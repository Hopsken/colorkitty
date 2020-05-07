import { Reducer } from 'redux'
import uniqBy from 'lodash/uniqBy'

import { Palette } from '@/types'
import { timeToNow } from '@/utilities'
import { AppStore } from './state'
import { types, actionTypes } from './types'

export const initState: AppStore = {
  current: null,
  palettes: [],
  userPaletteIds: [],
  likedPaletteIds: [],
  popularPaletteIds: [],
  newestPaletteIds: [],
}

export const appReducer: Reducer<AppStore> = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.likePalette:
    case types.UNLIKE_PALETTE_FAILURE:
      return {
        ...state,
        palettes: updatePalettes(state.palettes, action.payload, {
          liked: true,
        }),
      }
    case actionTypes.unlikePalette:
    case types.LIKE_PALETTE_FAILURE:
      return {
        ...state,
        palettes: updatePalettes(state.palettes, action.payload, {
          liked: false,
        }),
      }
    case types.GET_PALETTE_SUCCESS:
      return {
        ...state,
        current: action.payload,
      }
    case types.DELETE_PALETTE_SUCCESS:
      return {
        ...state,
        userPaletteIds: state.userPaletteIds.filter(
          id => id !== action.payload,
        ),
      }
  }

  if (!action.payload || !action.payload.status || !action.payload.data) {
    return state
  }

  switch (action.type) {
    case types.GET_USER_PALETTES_SUCCESS:
      return {
        ...state,
        palettes: appendPalettes(state.palettes, action.payload.data),
        userPaletteIds: action.payload.data.map((one: Palette) => one._id),
      }
    case types.GET_USER_LIKES_SUCCESS:
      return {
        ...state,
        palettes: appendPalettes(state.palettes, action.payload.data),
        likedPaletteIds: action.payload.data.map((one: Palette) => one._id),
      }
    case types.CREATE_PALETTE_SUCCESS:
      return {
        ...state,
        palettes: appendPalettes(state.palettes, action.payload.data),
        userPaletteIds: [action.payload.data.paletteId].concat(
          state.userPaletteIds,
        ),
      }
    case types.GET_POP_PALETTES_SUCCESS:
      return {
        ...state,
        palettes: appendPalettes(state.palettes, action.payload.data),
        popularPaletteIds: action.payload.data.map((one: Palette) => one._id),
      }
    case types.GET_NEW_PALETTES_SUCCESS:
      return {
        ...state,
        palettes: appendPalettes(state.palettes, action.payload.data),
        newestPaletteIds: state.newestPaletteIds.concat(
          action.payload.data.map((one: Palette) => one._id),
        ),
      }
    case actionTypes.likePalette:
    case types.UNLIKE_PALETTE_FAILURE:
      return {
        ...state,
        palettes: updatePalettes(state.palettes, action.payload, {
          liked: true,
        }),
      }
    case actionTypes.unlikePalette:
    case types.LIKE_PALETTE_FAILURE:
      return {
        ...state,
        palettes: updatePalettes(state.palettes, action.payload, {
          liked: false,
        }),
      }
    default:
      return state
  }
}

function appendPalettes(before: Palette[], after: Palette[] | Palette) {
  const singlePalette = after as Palette
  const paletteArray = after as Palette[]

  if (!paletteArray.length) {
    return uniqBy(before.concat(formatPalette(singlePalette)), 'paletteId')
  }
  return uniqBy(before.concat(paletteArray.map(formatPalette)), 'paletteId')
}

function updatePalettes(
  palettes: Palette[],
  target: string,
  params: Partial<Palette>,
) {
  if (!target) {
    return palettes
  }

  return palettes.map(one => {
    if (one._id === target) {
      const likesCount = one.likesCount || 0
      return {
        ...one,
        ...params,
        count: params.liked === true ? likesCount + 1 : likesCount - 1,
      }
    }

    return one
  })
}

function formatPalette(palette: Palette): Palette {
  return {
    ...palette,
    created: timeToNow(palette.createdAt),
  }
}
