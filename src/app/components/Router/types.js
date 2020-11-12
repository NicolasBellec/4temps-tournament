// @flow

import type { ComponentType } from 'react';
import type { Location, RouterHistory } from 'react-router-dom';

export type OwnProps = {
  location: Location,
  path: string,
  component: ComponentType<mixed>,
  history: RouterHistory,
};

export type StateProps = {
  isAuthenticated: boolean,
  referer: string,
};

export type DispatchProps = {
  dispatch: ReduxDispatch,
};

export type Props = {
  ...StateProps,
  ...OwnProps,
  ...DispatchProps,
};
