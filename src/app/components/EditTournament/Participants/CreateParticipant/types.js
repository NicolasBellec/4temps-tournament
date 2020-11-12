// @flow

export type OwnProps = {
  tournamentId: string,
};

export type StateProps = {
  ...UiCreateParticipantsReduxState,
  isClassic: boolean,
};

export type ComponentState = {
  name: string,
  role: ParticipantRole,
};

export type DispatchProps = {
  onSubmit: (ComponentState) => void,
};

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
};
