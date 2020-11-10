// @flow

import type { RouterHistory } from 'react-router-dom';
import type { ElementType } from 'react';
import type Moment from 'moment';

export type OwnProps = {
  tournamentId: string,
  history: RouterHistory,
};

export type TournamentRepresentation = {
  id: string,
  creatorId: string,
  name: string,
  date: Moment,
  type: TournamentType,
  judges: Array < string > ,
  participants: Array < string > ,
  rounds: Array < string > ,
  dancesNoted: {
    [judgeId: string]: Array < string >
  }
};

export type StateProps = {
  ...UiEditTournamentsReduxState,
  tournament: {
    data: ?TournamentRepresentation,
    rounds: Round[],
    judges: Judge[],
    participants: Participant[],
  },
  shouldLoad: boolean,
  child: ElementType,
};

export type DispatchProps = {
  onSubmit: (tournament: TournamentRepresentation) => void,
  onClickLeaderboard: () => void,
  load: () => void,
};

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
};
