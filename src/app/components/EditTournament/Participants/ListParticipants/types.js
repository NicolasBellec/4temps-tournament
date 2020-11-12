// @flow

import type { ElementType } from 'react'

export type OwnProps = {
  tournamentId: string,
}

export type StateProps = {
  child: ElementType,
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
