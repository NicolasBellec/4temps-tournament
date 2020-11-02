// no-flow

import { GET_LEADERBOARD } from '../action-types';

export function getLeaderboardAction( leaderboard ) {
  return {
    type: GET_LEADERBOARD,
    promise: Promise.resolve(leaderboard),
  }
}
