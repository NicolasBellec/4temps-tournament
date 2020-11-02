// @flow
import { GET_ACCESS_KEY } from '../action-types'

export function getAccessKeysAction(tournamentId: string): GetAccessKeyAction {
  return {
    type: GET_ACCESS_KEY,
    promise: getAccessKeysForTournament(tournamentId),
  }
}
