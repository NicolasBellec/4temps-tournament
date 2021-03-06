// @flow

import Judge from './component'

export type JudgeProps = {
  tournamentId: string,
  judgeId: string,
  activeRound: ?Round,
  activeDanceId: ?string,
  notesSubmitted: boolean,
}

export type StateProps = {
  Child: typeof Judge,
  shouldLoad: boolean,
  ...JudgeProps,
}

export type DispatchProps = {
  load: () => void,
}

export type Props = {
  ...StateProps,
  ...DispatchProps,
}
