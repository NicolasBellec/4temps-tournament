// @flow

import { TOURNAMENT_UPDATED } from '../../action-types'

export function getTournamentUpdatedAction(normalized: normalizedTournament): TournamentUpdatedAction {
  return {
    type: TOURNAMENT_UPDATED,
    payload: normalized,
  }
}
