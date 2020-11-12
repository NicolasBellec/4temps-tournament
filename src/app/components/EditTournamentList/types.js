// @flow

import type { RouterHistory } from 'react-router-dom'
import type { ElementType } from 'react'

export type OwnProps = {
  history: RouterHistory,
}

export type StateProps = {
  shouldLoad: boolean,
  isLoading: boolean,
  child: ElementType,
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
