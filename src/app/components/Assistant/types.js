// @flow

export type Tabs = 'groups' | 'participants'

export type StateProps = {
  tournamentId: string,
}

export type DispatchProps = {
  dispatch: ReduxDispatch,
}

export type Props = {
  ...StateProps,
  ...DispatchProps,
}
export type State = { activeTab: Tabs }
