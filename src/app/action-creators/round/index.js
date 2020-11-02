// @flow

import type { RouterHistory } from 'react-router-dom';
import {
  createRound,
  deleteRound,
  startRound,
  settleDraw,
  startNextDance,
  generateGroupsForRound,
  endDance,
} from '../../api/round';
import {
  CREATE_ROUND,
  DELETE_ROUND,
  START_ROUND,
  SETTLE_DRAW,
  START_NEXT_DANCE,
  GENERATE_GROUPS,
  END_DANCE,
} from '../action-types';

export function getCreateRoundAction(
  tournamentId: string,
  round: Round,
): CreateRoundAction {
  return {
    type: CREATE_ROUND,
    promise: createRound(tournamentId, round),
  };
}

export function getDeleteRoundAction(
  tournamentId: string,
  deleteId: string,
): DeleteRoundAction {
  return {
    type: DELETE_ROUND,
    promise: deleteRound(tournamentId, deleteId),
  };
}

export function getStartRoundAction(
  tournamentId: string,
  roundId: string,
  history: RouterHistory,
): StartRoundAction {
  return {
    type: START_ROUND,
    promise: startRound(tournamentId, roundId),
    meta: {
      onSuccess: () => history.push(`/tournament/${tournamentId}/round/${roundId}`),
    },
  };
}

export function getSettleDrawAction(
  tournamentId: string,
  roundScores: Array<Score>,
): SettleDrawAction {
  return {
    type: SETTLE_DRAW,
    promise: settleDraw(tournamentId, roundScores),
  };
}

export function getStartNextDanceAction(
  tournamentId: string,
): StartNextDanceAction {
  return {
    type: START_NEXT_DANCE,
    promise: startNextDance(tournamentId),
  };
}

export function getGenerateGroupsAction(
  tournamentId: string,
  roundId: string,
): GenerateGroupsAction {
  return {
    type: GENERATE_GROUPS,
    promise: generateGroupsForRound(tournamentId, roundId),
  };
}

export function getEndDanceAction(tournamentId: string): EndDanceAction {
  return {
    type: END_DANCE,
    promise: endDance(tournamentId),
  };
}
