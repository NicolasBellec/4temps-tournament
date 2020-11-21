// @flow

import type { ElementType } from 'react'
import type { Location, RouterHistory, Match, ContextRouter } from 'react-router-dom'

export type OwnProps = {
  location: Location,
  path: string,
  Component: ElementType,
  history: RouterHistory,
  match: Match,
  exact?: boolean,
  ...ContextRouter
}

export type StateProps = {
  isAuthenticated: boolean,
  referer: string,
}

export type DispatchProps = {
  dispatch: ReduxDispatch,
}

export type Props = {
  ...StateProps,
  ...OwnProps,
  ...DispatchProps,
}
