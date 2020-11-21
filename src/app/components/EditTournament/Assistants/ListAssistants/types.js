// @flow

import Component from './component'

export type OwnProps = {
  tournamentId: string,
}

type AssistantViewModel = {
  ...Assistant,
  accessKey: AccessKey,
}

export type StateProps = {
  Child: typeof Component,
  shouldLoad: boolean,
  assistants: Array<AssistantViewModel>,
}

export type DispatchProps = {
  load: () => void,
}

export type Props = {
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
}
