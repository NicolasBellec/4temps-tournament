// @flow

import type { ElementType } from 'react'

export type OwnProps = {
  tournamentId: string,
}

type AssistantViewModel = {
  ...Assistant,
  accessKey: AccessKey,
}

export type StateProps = {
  child: ElementType,
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
