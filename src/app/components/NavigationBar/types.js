// @flow

import type { ElementType } from 'react'
import type { Location, RouterHistory } from 'react-router-dom'

export type OwnProps = {
  /* Provided by withRouter function */
  location: Location,
  history: RouterHistory,
  target: {|
    current: ?ElementType
  |}
};

export type StateProps = {
  activePath: string,
  isAuthenticated: boolean,
  role: string
};

export type DispatchProps = {
  onClickLogout: () => void,
};

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
};
