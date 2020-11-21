// @flow

import { connect } from 'react-redux'
import PreloadContainer from '../../containers/PreloadContainer'
import Component from './component'
import { getLeaderboardAction } from '../../action-creators/leaderboard';

import type { OwnProps, StateProps, DispatchProps, Props } from './types'

function mapStateToProps({ leaderboards }: ReduxState, { match }: OwnProps): StateProps {
  const tournamentId = match.params.tournamentId || ''
  return {
    shouldLoad: leaderboards.byId[tournamentId] == null,
    Child: Component,
    leaderboard: leaderboards.byId[tournamentId],
  }
}

function mapDispatchToProps(dispatch: ReduxDispatch, { match, history }: OwnProps): DispatchProps {
  const { tournamentId } = match.params

  if (tournamentId == null) {
    history.push('/404')
  }

  return {
    load: () =>
      dispatch(getLeaderboardAction(tournamentId, history)),
  }
}

const LeaderboardContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer)

export default LeaderboardContainer
