// @flow

import { connect } from 'react-redux';
import PreloadContainer from '../../containers/PreloadContainer';
import { getLeaderboardForTournament } from '../../api/leaderboard';
import Component from './component';
import { subscribeToLeaderboardForTournament } from '../../api/realtime';

import type {
  OwnProps, StateProps, DispatchProps, Props,
} from './types';

function mapStateToProps(
  { leaderboards }: ReduxState,
  { match }: OwnProps,
): StateProps {
  const tournamentId = match.params.tournamentId || '';
  return {
    shouldLoad: leaderboards.byId[tournamentId] == null,
    child: Component,
    leaderboard: leaderboards.byId[tournamentId],
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { match, history }: OwnProps,
): DispatchProps {
  const { tournamentId } = match.params;

  if (tournamentId == null) {
    history.push('/404');
  }

  return {
    load: () => dispatch(
      // TODO: Move: Conflict
      {
        type: 'GET_LEADERBOARD',
        promise: getLeaderboardForTournament(tournamentId || ''),
        meta: {
          onSuccess: () => subscribeToLeaderboardForTournament(tournamentId || ''),
          onFailure: (res) => {
            if (!res.didFindTournament) {
              history.push('/404');
            }
          },
        },
      },
    ),
  };
}

const LeaderboardContainer = connect<Props, OwnProps, StateProps, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadContainer);

export default LeaderboardContainer;
