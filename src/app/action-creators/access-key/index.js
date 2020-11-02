// @flow
import { GET_ACCESS_KEYS } from '../action-types'

export function getAccessKeysAction(tournamentId: string): GetAccessKeyAction {
  return {
    type: GET_ACCESS_KEYS,
    promise: getAccessKeysForTournament(tournamentId),
  }
}
