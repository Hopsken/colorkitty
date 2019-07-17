import { createAction, Action } from 'redux-actions'
import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects'

import {
  getPalettes, getPalette,
  likePalette, unlikePalette,
  userPalettes, userLikes,
} from '@/services'
import { selectPalette } from './selector'
import { GetPalettesParams } from '@/services'
import { actionTypes, types } from './types'

function* fetchUserPalettes(action: Action<string>) {
  if (!action.payload) {
    return
  }
  try {
    if (action.payload === 'private') {
      const result = yield call(userPalettes)
      yield put(createAction(types.GET_USER_PALETTES_SUCCESS)(result))
    } else if (action.payload === 'likes') {
      const result = yield call(userLikes)
      yield put(createAction(types.GET_USER_LIKES_SUCCESS)(result))
    }
  } catch {
    yield put(createAction(types.GET_USER_PALETTES_FAILURE)())
  }
}

function* fetchPalette(action: Action<{ palette_id: string}>) {
  if (!action.payload) {
    return
  }
  try {
    let palette = yield select(selectPalette, action.payload.palette_id)
    if (!palette) {
      palette = (yield call(getPalette, action.payload.palette_id))['data']
    }
    yield put(createAction(types.GET_PALETTE_SUCCESS)(palette))
  } catch {
    yield put(createAction(types.GET_PALETTE_FAILURE)())
  }
}

function* fetchPalettes(action: Action<GetPalettesParams>) {
  if (!action.payload) {
    return
  }
  try {
    const result = yield call(getPalettes, action.payload)
    if (action.payload['sorts'] === 'likes') {
      yield put(createAction(types.GET_POP_PALETTES_SUCCESS)(result))
    } else {
      yield put(createAction(types.GET_NEW_PALETTES_SUCCESS)(result))
    }
  } catch (error) {
    yield put(createAction(types.GET_PALETTES_FAILURE)(error))
  }
}

function* like(action: Action<number>) {
  if (!action.payload) {
    return
  }
  try {
    yield call(likePalette, action.payload)
    yield put(createAction(types.LIKE_PALETTE_SUCCESS)(action.payload))
  } catch {
    yield put(createAction(types.LIKE_PALETTE_FAILURE)())
  }
}

function* unlike(action: Action<number>) {
  if (!action.payload) {
    return
  }
  try {
    yield call(unlikePalette, action.payload)
    yield put(createAction(types.UNLIKE_PALETTE_SUCCESS)(action.payload))
  } catch {
    yield put(createAction(types.UNLIKE_PALETTE_FAILURE)())
  }
}

export function* appSaga() {
  yield takeLatest(actionTypes.getPalettes, fetchPalettes)
  yield takeLatest(actionTypes.likePalette, like)
  yield takeLatest(actionTypes.unlikePalette, unlike)
  yield takeEvery(actionTypes.getUserPalettes, fetchUserPalettes)
  yield takeLatest(actionTypes.getPalette, fetchPalette)
}
