// @flow

export type CriterionViewModel = {
  id: string,
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  value: ?number,
  forJudgeType: JudgeType,
}

export type StateProps = {
  tournamentId: string,
  judgeId: string,
  danceId: string,
  pairId: string,
  criteria: Array<CriterionViewModel>,
}

export type DispatchProps = {
  onClick: (tournamentId: string, note: JudgeNote) => void,
}

export type Props = {
  ...StateProps,
  ...DispatchProps,
}
