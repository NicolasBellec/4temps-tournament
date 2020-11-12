// @flow

export type ScoreViewModel = {
  score: number,
  participant: Participant
};

export type OwnProps = {
  tournamentId: string,
  activeRound: ?Round
};

type ParticipantResults = {
  winners: Array<ScoreViewModel>,
  losers: Array<ScoreViewModel>,
  draw: Array<ScoreViewModel>,
};

export type StateProps = {
  roundName: string,
  isPairRound: boolean,
  passingCouplesCount: number,
  leaders: ParticipantResults,
  followers: ParticipantResults,
  ...UiSettleDrawReduxState,
};

export type DispatchProps = {
  submitRoundScores: (roundScores: Array<Score>) => void,
};

export type Props = {
  ...StateProps,
  ...DispatchProps,
  ...OwnProps
};
