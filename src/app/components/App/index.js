// @flow
import React from 'react'
import { Ref } from 'semantic-ui-react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { middleware as reduxPackMiddleware } from 'redux-pack'
import type { Store } from 'redux'

import Router from '../Router'
import NavigationBar from '../NavigationBar'
import reducer, { getInitialState } from '../../reducers'

let store: Store<ReduxState, ReduxPackAction>

export function getReduxState(): ReduxState {
  if (store) {
    return store.getState()
  }
  return getInitialState()
}

export function appWithStore(store: mixed) {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export function appWithPreloadedState(preloadedState: mixed) {
  store = initializeStore(preloadedState)
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export function initializeStore(preloadedState: mixed) {
  const state: ReduxState = { ...getInitialState(), ...preloadedState }
  return createStore<ReduxState, ReduxPackAction, ReduxDispatch>(
    reducer,
    state,
    applyMiddleware(reduxPackMiddleware)
  )
}

function App() {
  const segmentRef = React.useRef()

  return (
    <div>
      <NavigationBar target={segmentRef} />
      <Ref innerRef={segmentRef}>
        <Router />
      </Ref>
    </div>
  )
}

export default App
