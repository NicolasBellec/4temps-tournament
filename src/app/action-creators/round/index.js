// @flow

import { createRound } from '../../api/round';
import { CREATE_ROUND } from '../action-types';

export function getCreateRoundAction(
  tournamentId: string,
  round: Round
): CreateRoundAction {
  return {
    type: CREATE_ROUND,
    promise: createRound(tournamentId, round),
  };
}
