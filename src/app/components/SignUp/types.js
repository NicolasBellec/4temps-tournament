// @flow

import type { Location, RouterHistory } from 'react-router-dom';

export type OwnProps = {
  history: RouterHistory,
  location: Location,
};

export type StateProps = {
  validation: AdminCreateValidationSummary,
  isLoading: boolean,
};

export type DispatchProps = {
  onSubmit: (admin: AdminWithPassword) => void,
};

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
};

export type InternalState = AdminWithPassword;
