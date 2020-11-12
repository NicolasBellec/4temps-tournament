// @flow

import NoteTaker from './component';

export type OwnProps = {
  tournamentId: string,
  danceId: string,
};

export type StateProps = {
  isClassic: boolean,
  isLastRound: boolean,
  child: typeof NoteTaker,
  shouldLoad: boolean,
};

export type DispatchProps = {
  load: () => void,
};

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
};
