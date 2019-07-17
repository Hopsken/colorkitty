import { Action, createAction } from 'redux-actions'
import { call, put, takeLatest } from 'redux-saga/effects'

import {
  LoginPayload,
  SignupPayload,
  login,
  getUser,
  logout,
  signup,
  updateUserInfo,
  UpdateUserInfoPayload,
} from '@/services'
import { actionTypes, types } from './types'

function* userSignUp(action: Action<SignupPayload>) {
  if (!action.payload) {
    yield put(createAction(types.SIGNUP_FAILURE)(`Can't not be empty`))
    return
  }
  try {
    const result = yield call(signup, action.payload)
    yield put(createAction(types.SIGNUP_SUCCESS)(result))
    yield userLogin(
      createAction(actionTypes.login)({
        username: action.payload['username'],
        password: action.payload['password'],
      }),
    )
  } catch (error) {
    yield put(createAction(types.LOGIN_FAILURE)(error))
  }
}

function* userLogin(action: Action<LoginPayload>) {
  if (!action.payload) {
    yield put(createAction(types.LOGIN_FAILURE)(`Can't not be empty`))
    return
  }
  try {
    const user = yield call(login, action.payload)
    yield put(createAction(types.LOGIN_SUCCESS)(user))
    yield getCurrentUser()
  } catch (error) {
    yield put(createAction(types.LOGIN_FAILURE)(error))
  }
}

function* getCurrentUser() {
  try {
    const user = yield call(getUser)
    if (!user) {
      yield put(createAction(types.GET_CURRENT_USER_FAILURE)())
      return
    }
    yield put(createAction(types.GET_CURRENT_USER_SUCCESS)(user))
  } catch (error) {
    yield put(createAction(types.GET_CURRENT_USER_FAILURE)(error))
  }
}

function* userLogout() {
  try {
    yield call(logout)
    yield put(createAction(types.LOGOUT_SUCCESS)())
  } catch (error) {
    yield put(createAction(types.LOGOUT_FAILURE)(error))
  }
}

function* userInfo(action: Action<UpdateUserInfoPayload>) {
  if (!action.payload) {
    return
  }
  try {
    const result = yield call(updateUserInfo, action.payload)
    yield put(createAction(types.UPDATE_USER_INFO_SUCCESS)(result))
    if (action.payload['password']) {
      yield put(createAction(types.LOGOUT_SUCCESS)('Password changed.'))
    }
  } catch {
    yield put(createAction(types.UPDATE_USER_INFO_FAILURE)())
  }
}

export function* rootSaga() {
  yield takeLatest(actionTypes.signup, userSignUp)
  yield takeLatest(actionTypes.login, userLogin)
  yield takeLatest(actionTypes.getCurrentUser, getCurrentUser)
  yield takeLatest(actionTypes.logout, userLogout)
  yield takeLatest(actionTypes.updateUserInfo, userInfo)
}
