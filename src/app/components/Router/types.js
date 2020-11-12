// @flow

import type { ElementType } from 'react'
import type { Location, RouterHistory } from 'react-router-dom'

export type OwnProps = {
  location: Location,
  path: string,
  component: ElementType,
  history: RouterHistory,
  exact?: boolean
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
