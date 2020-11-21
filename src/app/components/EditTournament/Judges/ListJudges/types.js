// @flow

import Component from './component'

export type OwnProps = {
  tournamentId: string,
}

export type StateProps = {
  Child: typeof Component,
  shouldLoad: boolean,
  judges: Array<JudgeViewModel>,
}

export type JudgeViewModel = {
  data: ?Judge,
  accessKey: ?AccessKey,
}

export type DispatchProps = {
  load: () => void,
}

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
}
