// @flow

import type { RouterHistory } from 'react-router-dom';
import type Moment from 'moment';

export type ComponentState = {
  name: string,
  date: Moment,
  type: TournamentType,
};

export type StateProps = {
  isLoading: boolean,
  validation: TournamentValidationSummary,
};

export type OwnProps = {
  history: RouterHistory,
};

export type DispatchProps = {
  onSubmit : (state: ComponentState) => void
};

export type Props = {
  ...StateProps,
  ...OwnProps,
  ...DispatchProps,
};
