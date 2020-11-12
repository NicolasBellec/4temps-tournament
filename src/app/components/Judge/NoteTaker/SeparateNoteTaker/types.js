// @flow

export type StateProps = {
  tournamentId: string,
  judgeId: string,
  danceId: string,
  leaderId: string,
  followerId: string,
  leaderCriteria: Array<CriterionViewModel>,
  followerCriteria: Array<CriterionViewModel>,
};

export type CriterionViewModel = {
  id: string,
  name: string,
  minValue: number,
  maxValue: number,
  description: string,
  value: ?number,
  forJudgeType: JudgeType,
};

export type JudgeNoteOptionalValue = {
  ...JudgeNote,
  value: ?number
};

export type DispatchProps = {
  onClick: (tournamentId: string, note: JudgeNoteOptionalValue) => void,
};

export type Props = {
  ...DispatchProps,
  ...StateProps,
};
