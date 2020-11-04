// @flow

import { GET_LEADERBOARD } from '../action-types';

export default function getLeaderboardAction(
  leaderboard: Leaderboard,
): GetLeaderboardAction {
  return {
    type: GET_LEADERBOARD,
    promise: Promise.resolve(leaderboard),
  };
}
