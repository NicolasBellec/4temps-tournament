// @flow

import type { RouterHistory } from 'react-router-dom';
import type { ElementType } from 'react';

export type OwnProps = {
    tournamentId: string,
    history: RouterHistory,
};

export type StateProps = {
  tournamentId: string,
  child: ElementType,
  shouldLoad: boolean,
  rounds: Round[],
  nextRound: ?string,
};

export type DispatchProps = {
  load: () => void,
  deleteRound: (id: string) => void,
  startRound: (id: string) => void,
  onClick: (id: string) => void,
};

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
};
