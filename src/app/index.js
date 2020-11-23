// @flow

import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { loadableReady } from '@loadable/component'

import { setup as setupRealTimeUpdates } from './api/realtime'
import { appWithStore, initializeStore } from './components/App'

// loadableReady(() => {
  const preloadedState: ReduxState = window.__PRELOADED_STATE__
  delete window.__PRELOADED_STATE__

  const root = document.getElementById('root')
  if (root) {
    const store = initializeStore(preloadedState)

    setupRealTimeUpdates(store.dispatch)

    hydrate(<BrowserRouter>{appWithStore(store)}</BrowserRouter>, root)
  } else {
    throw new Error('Could not find react root')
  }
// })
