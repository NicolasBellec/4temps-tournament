// @flow

export type OwnProps = {
  tournamentId: string,
}

export type StateProps = {
  ...UiBatchCreateParticipantsReduxState,
  isClassic: boolean,
}

export type ComponentState = {
  csv: string
}

export type DispatchProps = {
  onSubmit: (ComponentState) => void,
}

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
}
