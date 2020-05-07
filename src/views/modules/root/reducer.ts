import { Reducer } from 'redux'

import { RootStore } from './state'
import { actionTypes, types } from './types'

export const initState = {
  cache: null,
  user: null,
  loadingUser: false
}

export const rootReducer: Reducer<RootStore> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case actionTypes.login:
    case actionTypes.getCurrentUser:
    case actionTypes.signup:
      return {
        ...state,
        loadingUser: true
      }
    case types.LOGIN_FAILURE:
    case types.GET_CURRENT_USER_FAILURE:
    case types.SIGNUP_FAILURE:
      return {
        ...state,
        loadingUser: false
      }
    case types.LOGIN_SUCCESS:
      if (!action.payload || !action.payload.data) {
        return state
      }

      localStorage.setItem('token', action.payload.data)
      return state
    case types.GET_CURRENT_USER_SUCCESS:
      if (!action.payload) {
        return { ...state, loadingUser: false }
      }

      return {
        ...state,
        user: action.payload.data,
        loadingUser: false
      }
    case types.UPDATE_USER_INFO_SUCCESS:
      if (!action.payload || !action.payload.status) {
        return state
      }
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.data
        }
      }
    case types.LOGOUT_SUCCESS:
      localStorage.removeItem('token')
      return initState
    default:
      return state
  }
}
