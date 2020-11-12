// @flow

export type OwnProps = {
  tournamentId: string,
}

export type OnSubmitParams = { name: string, judgeType: JudgeType }

export type DispatchProps = {
  onSubmit: (OnSubmitParams) => void,
}

export type Props = {
  ...OwnProps,
  ...DispatchProps,
  ...UiCreateJudgeReduxState,
}
