// @flow

import type { Match, RouterHistory } from 'react-router-dom'
import LeaderboardComponent from './component'

export type OwnProps = {
  match: Match,
  history: RouterHistory,
}

export type DispatchProps = {
  load: () => void,
}

export type StateProps = {
  shouldLoad: boolean,
  Child: typeof LeaderboardComponent,
  leaderboard: ?Leaderboard,
}

export type Props = {
  ...StateProps,
  ...OwnProps,
  ...DispatchProps,
}
