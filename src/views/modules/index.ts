import {  applyMiddleware, combineReducers, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import { rootReducer, rootSaga } from './root'
import { appReducer, appSaga } from './app'

function* combinedSage() {
  yield all([
    rootSaga(),
    appSaga()
  ])
}
const sagaMiddleware = createSagaMiddleware()

const combinedReducer = combineReducers({
  root: rootReducer,
  app: appReducer
})

function configureStore() {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const finalStore = createStore(
    combinedReducer,
    {},
    composeEnhancers(applyMiddleware(sagaMiddleware))
  )

  sagaMiddleware.run(combinedSage)

  return finalStore
}

export const store = configureStore()
