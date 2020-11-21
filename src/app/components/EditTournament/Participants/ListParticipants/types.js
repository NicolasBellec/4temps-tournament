// @flow

import Component from './component'

export type OwnProps = {
  tournamentId: string,
}

export type StateProps = {
  Child: typeof Component,
  shouldLoad: boolean,
  participants: Participant[],
  isClassic: boolean,
  loadArgs: ?string,
}

export type DispatchProps = {
  load: (args: ?string) => void,
  onChangeAttending: (id: string, isAttending: boolean) => void,
}

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
}
