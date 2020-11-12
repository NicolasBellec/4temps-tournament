// @flow

import type { Location, RouterHistory } from 'react-router-dom'

export type OwnProps = {
  location: Location,
  history: RouterHistory,
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
