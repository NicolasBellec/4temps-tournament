// @flow

import type { RouterHistory } from 'react-router-dom'
import Component from './component'

export type OwnProps = {
  tournamentId: string,
  history: RouterHistory,
}

export type StateProps = {
  tournamentId: string,
  Child: typeof Component,
  shouldLoad: boolean,
  rounds: Round[],
  nextRound: ?string,
}

export type DispatchProps = {
  load: () => void,
  deleteRound: (id: string) => void,
  startRound: (id: string) => void,
  onClick: (id: string) => void,
}

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
}
