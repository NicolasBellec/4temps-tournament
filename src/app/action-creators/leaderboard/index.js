// @flow

import { GET_LEADERBOARD, GET_LEADERBOARD_UPDATE } from '../../action-types';
import type { RouterHistory } from 'react-router-dom'
import { getLeaderboardForTournament } from '../../api/leaderboard'
import { subscribeToLeaderboardForTournament } from '../../api/realtime'

export function getLeaderboardUpdateAction(leaderboard: Leaderboard): GetLeaderboardUpdateAction {
  return {
    type: GET_LEADERBOARD_UPDATE,
    promise: Promise.resolve(leaderboard),
  }
}

export function getLeaderboardAction(tournamentId: ?string, history: RouterHistory) : GetLeaderboardAction {
  return {
    type: GET_LEADERBOARD,
    promise: getLeaderboardForTournament(tournamentId || ''),
    meta: {
      onSuccess: () => subscribeToLeaderboardForTournament(tournamentId || ''),
      onFailure: (res) => {
        if (!res.didFindTournament) {
          history.push('/404')
        }
      },
    },
  };
}
