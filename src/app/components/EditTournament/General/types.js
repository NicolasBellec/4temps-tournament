// @flow

import type { RouterHistory } from 'react-router-dom';
import type { ElementType } from 'react';
import type Moment from 'moment';

export type OwnProps = {
  tournamentId: string,
  history: RouterHistory,
};

export type StateProps = {
  ...UiEditTournamentsReduxState,
  tournament: ?Tournament,
  shouldLoad: boolean,
  child: ElementType,
};

export type DispatchProps = {
  onSubmit: (tournament: Tournament) => void,
  onClickLeaderboard: () => void,
  load: () => void,
};

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
};
