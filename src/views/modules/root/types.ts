export enum types {
  'GET_CURRENT_USER_SUCCESS' = 'GET_CURRENT_USER_SUCCESS',
  'GET_CURRENT_USER_FAILURE' = 'GET_CURRENT_USER_FAILURE',

  'LOGIN_SUCCESS' = 'LOGIN_SUCCESS',
  'LOGIN_FAILURE' = 'LOGIN_FAILURE',

  'SIGNUP_SUCCESS' = 'SIGNUP_SUCCESS',
  'SIGNUP_FAILURE' = 'SIGNUP_FAILURE',

  'LOGOUT_SUCCESS' = 'LOGOUT_SUCCESS',
  'LOGOUT_FAILURE' = 'LOGOUT_FAILURE',

  'UPDATE_USER_INFO_SUCCESS' = 'UPDATE_USER_INFO_SUCCESS',
  'UPDATE_USER_INFO_FAILURE' = 'UPDATE_USER_INFO_FAILURE',
}

export enum actionTypes {
  'login' = 'login',
  'logout' = 'logout',
  'signup' = 'signup',
  'getCurrentUser' = 'getCurrentUser',
  'updateUserInfo' = 'updateUserInfo',
}
