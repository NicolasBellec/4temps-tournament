// @flow

export type OwnProps = {
  tournamentId: string,
};

export type StateProps = UiCreateAssistantReduxState;

export type DispatchProps = {
  onSubmit: (name: string) => void,
};

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
};
