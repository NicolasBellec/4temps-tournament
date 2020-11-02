// @flow

import type { RouterHistory } from 'react-router-dom';
import {
  createRound,
  deleteRound,
  startRound
} from '../../api/round';
import {
  CREATE_ROUND,
  DELETE_ROUND,
  START_ROUND
 } from '../action-types';

export function getCreateRoundAction(
  tournamentId: string,
  round: Round
): CreateRoundAction {
  return {
    type: CREATE_ROUND,
    promise: createRound(tournamentId, round),
  };
}

export function getDeleteRoundAction(
  tournamentId: string,
  deleteId: string
): DeleteRoundAction {
  return {
    type: DELETE_ROUND,
    promise: deleteRound(tournamentId, deleteId),
  };
}

export function getStartRoundAction(
  tournamentId: string,
  roundId: string,
  history: RouterHistory
) : StartRoundAction {
  return {
    type: START_ROUND,
    promise: startRound(tournamentId, roundId),
    meta: {
      onSuccess: () => history.push(`/tournament/${tournamentId}/round/${roundId}`),
    },
  };
}
