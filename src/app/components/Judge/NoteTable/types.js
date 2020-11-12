// @flow

export type ColumnViewModel = {
  title: string,
  danceScores: Array<ScoreViewModel>,
};

export type ScoreViewModel = {
  name: string,
  value: number,
};

export type OwnProps = {};

export type StateProps = {
  columns: Array<ColumnViewModel>,
  tournamentId: string,
};

export type DispatchProps = {
  dispatch: ReduxDispatch,
};

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
};
