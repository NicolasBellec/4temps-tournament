// @flow

import type { Match, RouterHistory } from 'react-router-dom'
import Component from './component'

export type OwnProps = {
  match: Match,
  history: RouterHistory,
}

export type StateProps = {
  shouldLoad: boolean,
  child: typeof Component,
  roundId: string,
  tournamentId: string,
}

export type DispatchProps = {
  load: () => void,
}

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
}
