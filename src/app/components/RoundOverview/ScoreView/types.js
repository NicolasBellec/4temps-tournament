// @flow

import type { Dispatch } from 'redux'

export type ScoreViewModel = {
  participant: Participant,
  position: number,
  score: number,
}

export type ScoreViewTableProps = {
  winningLeaderScores: Array<ScoreViewModel>,
  winningFollowerScores: Array<ScoreViewModel>,
  losingLeaderScores: Array<ScoreViewModel>,
  losingFollowerScores: Array<ScoreViewModel>,
}

export type StateProps = {
  isFinished: boolean,
  ...ScoreViewTableProps,
}

export type OwnProps = {
  roundId: string,
}

export type DispatchProps = {
  dispatch: Dispatch<ReduxAction>,
}

export type Props = {
  ...StateProps,
  ...OwnProps,
  ...DispatchProps,
}
