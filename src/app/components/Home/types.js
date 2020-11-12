// @flow

import type { Location, RouterHistory } from 'react-router-dom'

export type OwnProps = {
  location: Location,
  history: RouterHistory,
}

export type StateProps = {
  isAuthenticated: boolean,
  role: UserRoleReduxState,
}

export type DispatchProps = {
  dispatch: ReduxDispatch,
}

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
}
