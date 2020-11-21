// @flow

import type { RouterHistory } from 'react-router-dom'
import TournamentList from '../TournamentList'

export type OwnProps = {
  history: RouterHistory,
}

export type StateProps = {
  shouldLoad: boolean,
  isLoading: boolean,
  Child: typeof TournamentList,
  tournaments: TournamentViewModel[],
}

export type DispatchProps = {
  load: () => void,
  onClick: (id: string) => void,
}

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
}
