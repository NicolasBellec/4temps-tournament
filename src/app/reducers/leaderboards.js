// @flow

import { handle } from 'redux-pack'
import { GET_LEADERBOARD, GET_LEADERBOARD_UPDATE } from '../action-types';

export default function leaderboardsReducer(
  state: LeaderboardsReduxState = getInitialState(),
  action: ReduxPackAction
): LeaderboardsReduxState {
  switch (action.type) {
    case GET_LEADERBOARD:
      return getLeaderboard(state, action)
    case GET_LEADERBOARD_UPDATE:
      return getLeaderboardUpdate(state, action)
    default:
      return state
  }
}

function getLeaderboard(
  state: LeaderboardsReduxState,
  action: ReduxPackAction): LeaderboardsReduxState {
    const { type, payload } = action

    return handle(state, action, {
      success: (prevState) => ({
        ...prevState,
        byId: {
          ...prevState.byId,
          [payload.tournamentId]: payload,
        },
      }),
    })
}

function getLeaderboardUpdate(
  state: LeaderboardsReduxState,
  action: ReduxPackAction): LeaderboardsReduxState {
    // Todo: Modify this function accordingly
    const { type, payload } = action

    // console.log(JSON.stringify(payload));

    return handle(state, action, {
      success: (prevState) => ({
        ...prevState,
        byId: {
          ...prevState.byId,
          [payload.tournamentId]: payload,
        },
      }),
    })
}

export function getInitialState(): LeaderboardsReduxState {
  return { byId: {} }
}
