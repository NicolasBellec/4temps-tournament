// @flow

export type StateProps = {
  ...UiNotesReduxState,
  tournamentId: string,
  notes: Array<JudgeNote>,
  hasAllNotes: boolean,
};

export type DispatchProps = {
  onSubmit: (tournamentId: string, notes: Array<JudgeNote>) => void,
};

export type Props = {
  ...StateProps,
  ...DispatchProps,
};
