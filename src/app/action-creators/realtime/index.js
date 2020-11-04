// @flow

import { TOURNAMENT_UPDATED } from '../action-types';

export function getTournamentUpdatedAction(
  normalized: mixed,
): TournamentUpdatedAction {
  return {
    type: TOURNAMENT_UPDATED,
    payload: normalized,
  };
}
