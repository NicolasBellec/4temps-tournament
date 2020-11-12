// @flow

export type CriterionViewModel = {
  name: string,
  minValue: ?number,
  maxValue: ?number,
  description: string,
  type: string,
  forJudgeType: JudgeType,
}

export type RoundViewModel = {
  name: string,
  danceCount: ?number,
  minPairCountPerGroup: ?number,
  maxPairCountPerGroup: ?number,
  passingCouplesCount: ?number,
  multipleDanceScoringRule: MultipleDanceScoringRule,
  notationSystem: NotationSystem,
  criteria: Array<CriterionViewModel>,
  errorOnSameScore: boolean,
}

export type OwnProps = {
  tournamentId: string,
}

export type StateProps = UiCreateRoundReduxState

export type DispatchProps = {
  onSubmit: (round: Round) => void,
}

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
}
